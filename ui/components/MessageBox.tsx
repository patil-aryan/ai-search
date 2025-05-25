import { MutableRefObject, lazy, useEffect, useState } from "react";
import { Message } from "./ChatWindow";
import { cn } from "@/lib/utils";
import {
  BookCopy,
  Disc3,
  FilePen,
  Layers3,
  Plus,
  PlusIcon,
  Share,
  StopCircle,
  ThumbsDown,
  VideoIcon,
  Volume2,
} from "lucide-react";
import MessageSources from "./MessageSources";
import Markdown from "markdown-to-jsx";
import Rewrite from "./MessageActions/Rewrite";
import Copy from "./MessageActions/Copy";
import SearchImages from "./SearchImages";
import SearchVideos from "./SearchVideos";
import { useSpeech } from "react-text-to-speech";

const MessageBox = ({
  message,
  messageIndex,
  history,
  loading,
  dividerRef,
  isLast,
  rewrite,
  sendMessage,
}: {
  message: Message;
  messageIndex: number;
  history: Message[];
  loading: boolean;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
  rewrite: (messageId: string) => void;
  sendMessage: (message: string) => void;
}) => {
  const [parsedMessage, setParsedMessage] = useState(message.content);
  const [speechMessage, setSpeechMessage] = useState(message.content);

  useEffect(() => {
    if (
      message.role === "assistant" &&
      message?.sources &&
      message.sources.length > 0
    ) {
      const regex = /\[(\d+)\]/g;

      setSpeechMessage(message.content.replace(regex, ""));

      message.suggestions = [
        "tell me about his products at apple",
        "tell me about this personal journey",
      ];
      return setParsedMessage(
        message.content.replace(
          regex,
          (_, number) =>
            `<a href="${
              message.sources?.[number - 1]?.metadata?.url
            }" target="_blank" className="bg-gray-100 text-gray-900 px-1 rounded ml-1 no-underline text-xs hover:bg-gray-200 transition-colors">
            ${number}</a>`
        )
      );
    }

    setParsedMessage(message.content);
  }, [message.content, message.sources, message.role]);

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  return (
    <div className="bg-white">
      {message.role === "user" && (
        <div className={cn("w-full bg-gray-50 p-6 rounded-lg", messageIndex === 0 ? "mt-6" : "mt-4")}>
          <h2 className="text-gray-900 font-medium text-xl lg:text-2xl">
            {message.content}
          </h2>
        </div>
      )}

      {message.role === "assistant" && (
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:space-x-8 bg-white p-6 rounded-lg border border-gray-200">
          <div
            ref={dividerRef}
            className="flex flex-col space-y-6 w-full lg:w-9/12"
          >
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-col space-y-3">
                <div className="flex flex-row items-center space-x-2">
                  <BookCopy className="text-gray-700" size={20} />
                  <h3 className="text-gray-900 font-medium text-lg">Sources</h3>
                </div>
                <MessageSources sources={message.sources} />
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <div className="flex flex-row items-center space-x-2">
                <Disc3
                  className={cn(
                    "text-gray-700",
                    isLast && loading ? "animate-spin" : "animate-none"
                  )}
                  size={20}
                />
                <h3 className="text-gray-900 font-medium text-lg">Answer</h3>
              </div>
              <Markdown className="prose prose-gray max-w-none break-words prose-p:leading-relaxed prose-pre:p-0 text-gray-900 text-sm md:text-base font-normal prose-headings:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:text-gray-800">
                {parsedMessage}
              </Markdown>
              {!loading && (
                <div className="flex flex-row items-center justify-between w-full text-gray-700 py-4 border-t border-gray-200 mt-4">
                  <div className="flex flex-row items-center space-x-1">
                    <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition duration-200 hover:text-gray-700">
                      <Share size={18} />
                    </button>
                    <Rewrite rewrite={rewrite} messageId={message.id} />
                  </div>
                  <div className="flex flex-row items-center space-x-1">
                    <Copy initialMessage={message.content} message={message} />
                    <button
                      onClick={() => {
                        if (speechStatus === "started") {
                          stop();
                        } else {
                          start();
                        }
                      }}
                      className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition duration-200 hover:text-gray-700"
                    >
                      {speechStatus === "started" ? (
                        <StopCircle size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isLast &&
                message.suggestions &&
                message.suggestions.length > 0 &&
                message.role === "assistant" &&
                !loading && (
                  <>
                    <div className="h-px w-full bg-gray-200" />
                    <div className="flex flex-col space-y-3 text-gray-900">
                      <div className="flex flex-row items-center space-x-2 mt-4">
                        <Layers3 className="text-gray-700" />
                        <h3 className="text-lg font-medium">Related</h3>
                      </div>
                      <div className="flex flex-col space-y-3">
                        {message.suggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="flex flex-col space-y-3 text-sm"
                          >
                            <div className="h-px w-full bg-gray-200" />
                            <div
                              onClick={() => sendMessage(suggestion)}
                              className="cursor-pointer flex flex-row justify-between font-medium space-x-2 items-center p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                              <p className="hover:text-gray-900 transition duration-200 text-gray-700">
                                {suggestion}
                              </p>
                              <Plus size={20} className="text-gray-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
          <div className="lg:sticky lg:top-20 flex flex-col items-center space-y-3 w-full lg:w-3/12 z-30 h-full pb-4">
            <SearchImages
              query={history[messageIndex - 1].content}
              chat_history={history.slice(0, messageIndex - 1)}
            />
            <SearchVideos
              chat_history={history.slice(0, messageIndex - 1)}
              query={history[messageIndex - 1].content}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
