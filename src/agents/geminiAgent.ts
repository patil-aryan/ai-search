import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  ChatSession,
} from "@google/generative-ai";
import { getChatModel, getGeminiApiKey } from "../config";
import { Message } from "../websocket/messageHandler"; // Assuming Message type is defined here

const MODEL_NAME = getChatModel();
const API_KEY = getGeminiApiKey();

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

interface GeminiMessageContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

function formatHistoryForGemini(history: Array<[string, string]>): GeminiMessageContent[] {
  return history.map((msgTuple) => ({
    role: msgTuple[0] === "human" ? "user" : "model",
    parts: [{ text: msgTuple[1] }],
  }));
}

export class GeminiAgent {
  private chat: ChatSession;

  constructor(history: Array<[string, string]> = []) {
    this.chat = model.startChat({
      generationConfig,
      safetySettings,
      history: formatHistoryForGemini(history), // This now expects Array<[string, string]>
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error("Failed to get response from Gemini API.");
    }
  }

  async *sendMessageStream(
    history: Array<[string, string]>, // Changed type to Array<[string, string]>
    message: string
  ): AsyncGenerator<string, void, unknown> {
    // For streaming, we might need to re-initialize chat if history is significantly different
    // or manage history more carefully. For now, let's assume a fresh chat for stream for simplicity,
    // or use the existing chat session if appropriate.
    // This example will use the existing chat session and send the new message.
    // Note: Gemini's Node.js SDK's `sendMessageStream` might behave differently or require specific history handling.
    // This is a simplified conceptual implementation.

    // Re-initialize chat with current history for streaming context
    const currentChat = model.startChat({
        generationConfig,
        safetySettings,
        history: formatHistoryForGemini(history),
    });

    try {
      const result = await currentChat.sendMessageStream(message);
      for await (const chunk of result.stream) {
        if (chunk && chunk.text) {
          yield chunk.text();
        }
      }
    } catch (error) {
      console.error("Error streaming message from Gemini:", error);
      throw new Error("Failed to stream response from Gemini API.");
    }
  }
}
