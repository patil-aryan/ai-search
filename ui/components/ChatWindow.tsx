"use client";

import { Document } from "@langchain//core/documents";
import { useEffect, useRef, useState } from "react";
import EnhancedHomepage from "./EnhancedHomepage";
import Chat from "./Chat";
import Navbar from "./Navbar";
import { getSuggestions } from "@/lib/actions";

export type Message = {
  id: string;
  createdAt: Date;
  content: string;
  role: "user" | "assistant";
  suggestions?: string[];
  sources?: Document[];
};

interface ChatHistory {
  id: string;
  title: string;
  firstMessage: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  starred: boolean;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
}

const useSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!ws) {
      const ws = new WebSocket(url);
      ws.onopen = () => {
        console.log("[DEBUG] open");
        setWs(ws);
      };
    }

    return () => {
      ws?.close();
    };
  }, [ws, url]);

  return ws;
};

const ChatWindow = () => {
  const ws = useSocket(process.env.NEXT_PUBLIC_WS_URL!);
  const [chatHistory, setChatHistory] = useState<[string, string][]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageAppeared, setMessageAppeared] = useState(false);
  const [focusMode, setFocusMode] = useState("all");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const saveChatToHistory = (chatMessages: Message[]) => {
    if (chatMessages.length === 0) return;

    const chatId = currentChatId || Date.now().toString();
    const firstUserMessage = chatMessages.find(m => m.role === "user");
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    const chatHistoryEntry: ChatHistory = {
      id: chatId,
      title: (firstUserMessage?.content ? 
        firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "") 
        : "Untitled Chat"),
      firstMessage: firstUserMessage?.content || "",
      lastMessage: lastMessage?.content || "",
      timestamp: new Date(),
      messageCount: chatMessages.length,
      starred: false,
      messages: chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt
      }))
    };

    try {
      const stored = localStorage.getItem("futuresearch_chats");
      const existingChats: ChatHistory[] = stored ? JSON.parse(stored) : [];
      
      // Update existing chat or add new one
      const existingIndex = existingChats.findIndex(chat => chat.id === chatId);
      if (existingIndex !== -1) {
        existingChats[existingIndex] = chatHistoryEntry;
      } else {
        existingChats.unshift(chatHistoryEntry);
      }
      
      // Keep only last 100 chats to prevent localStorage overflow
      const limitedChats = existingChats.slice(0, 100);
      
      localStorage.setItem("futuresearch_chats", JSON.stringify(limitedChats));
      
      if (!currentChatId) {
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };

  const saveToLibraryChatHistory = (query: string, response: string) => {
    try {
      const existingHistory = localStorage.getItem('futuresearch_chat_history');
      const chatHistory = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newChatItem = {
        id: Date.now().toString(),
        query: query,
        response: response,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [newChatItem, ...chatHistory].slice(0, 50); // Keep only last 50
      localStorage.setItem('futuresearch_chat_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save to library chat history:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (loading) return;

    setLoading(true);
    setMessageAppeared(false);

    let sources: Document[] | undefined = undefined;
    let receivedMessage = "";
    let added = false;

    ws?.send(
      JSON.stringify({
        type: "message",
        content: message,
        focusMode: focusMode,
        history: [...chatHistory, ["human", message]],
      })
    );

    const newUserMessage: Message = {
      content: message,
      id: Math.random().toString(36).substring(7),
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const messageHandler = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      if (data.type === "sources") {
        sources = data.data;

        if (!added) {
          const assistantMessage: Message = {
            content: "",
            id: data.messageId,
            role: "assistant",
            sources: sources,
            createdAt: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          added = true;
        }
        setMessageAppeared(true);
      }

      if (data.type === "message") {
        if (!added) {
          const assistantMessage: Message = {
            content: data.data,
            id: data.messageId,
            role: "assistant",
            sources: sources,
            createdAt: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          added = true;
        }

        setMessages((prev) =>
          prev.map((message) => {
            if (message.id === data.messageId) {
              return { ...message, content: message.content + data.data };
            }
            return message;
          })
        );

        receivedMessage += data.data;
        setMessageAppeared(true);
      }

      if (data.type === "messageEnd") {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          ["human", message],
          ["assistant", receivedMessage],
        ]);
        ws?.removeEventListener("message", messageHandler);
        setLoading(false);

        // Save chat history after message completion
        const updatedMessages = [...messagesRef.current];
        // Update the last assistant message with complete content
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === "assistant") {
          updatedMessages[updatedMessages.length - 1].content = receivedMessage;
        }
        saveChatToHistory(updatedMessages);

        // Also save to library chat history format
        saveToLibraryChatHistory(message, receivedMessage);

        const lastMsg = messagesRef.current[messagesRef.current.length - 1];

        if (
          lastMsg.role === "assistant" &&
          lastMsg.sources &&
          lastMsg.sources.length > 0 &&
          !lastMsg.suggestions
        ) {
          const suggestions = await getSuggestions(messagesRef.current);
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === lastMsg.id) {
                return { ...msg, suggestions: suggestions };
              }
              return msg;
            })
          );
        }
      }
    };

    ws?.addEventListener("message", messageHandler);
  };

  const rewrite = (messageId: string) => {
    const index = messages.findIndex((msg) => msg.id === messageId);

    if (index === -1) return;

    const message = messages[index - 1];

    setMessages((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });

    setChatHistory((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });

    sendMessage(message.content);
  };

  return (
    <div>
      {messages.length > 0 ? (
        <>
          <Navbar messages={messages} />
          <Chat
            loading={loading}
            messages={messages}
            sendMessage={sendMessage}
            messageAppeared={messageAppeared}
            rewrite={rewrite}
          />
        </>
      ) : (
        <EnhancedHomepage
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
};

export default ChatWindow;
