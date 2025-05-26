import { WebSocket, EventEmitter } from "ws";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import handleWebSearch from "../agents/webSearchAgent";
import handleAcademicSearch from "../agents/academicSearchAgent";
import handleBusinessSearch from "../agents/businessSearchAgent";
import handleWritingAssistant from "../agents/writingAssistant";
import handleYoutubeSearch from "../agents/youtubeSearchAgent";
import handleRedditSearch from "../agents/redditSearchAgent";
import handleImageSearch from "../agents/imageSearchAgent";
import handleVideoSearch from "../agents/videoSearchAgent";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
import { getChatModelProvider } from "../config"; // Added import
import { GeminiAgent } from "../agents/geminiAgent"; // Added import

export type Message = {
  type: string;
  content: string;
  copilot: string;
  focusMode: string;
  history: Array<[string, string]>;
};

const searchHandlers = {
  webSearch: handleWebSearch,
  academicSearch: handleAcademicSearch,
  businessSearch: handleBusinessSearch,
  writingAssistant: handleWritingAssistant,
  youtubeSearch: handleYoutubeSearch,
  redditSearch: handleRedditSearch,
  imageSearch: handleImageSearch,
  videoSearch: handleVideoSearch,
  all: handleWebSearch,
  academic: handleAcademicSearch,
  business: handleBusinessSearch,
  news: handleWebSearch,
  videos: handleYoutubeSearch,
  images: handleImageSearch,
  code: handleWebSearch,
  reddit: handleRedditSearch,
  youtube: handleYoutubeSearch,
  writing: handleWritingAssistant,
};

const handleEmitterEvents = (
  emitter: EventEmitter,
  ws: WebSocket,
  id: string
) => {
  emitter.on("data", (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type === "response") {
      ws.send(
        JSON.stringify({
          type: "message",
          data: parsedData.data,
          messageId: id,
        })
      );
    } else if (parsedData.type === "sources") {
      ws.send(
        JSON.stringify({
          type: "sources",
          data: parsedData.data,
          messageId: id,
        })
      );
    }
  });
  emitter.on("end", () => {
    ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
  });
  emitter.on("error", (data) => {
    const parsedData = JSON.parse(data);
    ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
  });
};

export const handleMessage = async (
  message: string,
  ws: WebSocket,
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  try {
    const paresedMessage = JSON.parse(message) as Message;
    const id = Math.random().toString(36).substring(7);

    if (!paresedMessage.content) {
      return ws.send(
        JSON.stringify({ type: "error", data: "Invalid message format" })
      );
    }

    if (paresedMessage.type === "message") {
      const history: BaseMessage[] = paresedMessage.history.map((msg) => {
        if (msg[0] === "human") {
          return new HumanMessage({
            content: msg[1],
          });
        } else {
          return new AIMessage({
            content: msg[1],
          });
        }
      });      // Enhanced content processing for specific focus modes
      let processedContent = paresedMessage.content;
      if (paresedMessage.focusMode === "code") {
        processedContent = `Code help: ${paresedMessage.content}. Please provide code examples with proper syntax highlighting and explanations.`;
      } else if (paresedMessage.focusMode === "youtube" || paresedMessage.focusMode === "videos") {
        processedContent = `Find videos about: ${paresedMessage.content}`;
      } else if (paresedMessage.focusMode === "reddit") {
        processedContent = `Search Reddit discussions about: ${paresedMessage.content}`;
      } else if (paresedMessage.focusMode === "writing") {
        processedContent = `Writing assistance for: ${paresedMessage.content}`;
      } else if (paresedMessage.focusMode === "business" || paresedMessage.focusMode === "businessSearch") {
        processedContent = `Business and market information about: ${paresedMessage.content}`;
      }

      const handler = searchHandlers[paresedMessage.focusMode];
      if (handler) {
        console.log(`[MessageHandler] Using ${paresedMessage.focusMode} agent for query: "${processedContent}"`);
        const emitter = handler(
          processedContent,
          history,
          llm,
          embeddings
        );
        handleEmitterEvents(emitter, ws, id);
      } else {
        console.warn(`Unknown focus mode: ${paresedMessage.focusMode}, falling back to web search`);
        const emitter = handleWebSearch(
          processedContent,
          history,
          llm,
          embeddings
        );
        handleEmitterEvents(emitter, ws, id);
      }
    }
  } catch (error) {
    console.error("Failed to handle message", error);
    ws.send(JSON.stringify({ type: "error", data: "Invalid message format" }));
  }
};
