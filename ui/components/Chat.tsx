"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "./ChatWindow";
import MessageBox from "./MessageBox";
import MessageBoxLoading from "./MessageBoxLoading";
import MessageInput from "./MessageInput";

const Chat = ({
  loading,
  messages,
  sendMessage,
  messageAppeared,
  rewrite,
}: {
  messages: Message[];
  sendMessage: (message: string) => void;
  loading: boolean;
  messageAppeared: boolean;
  rewrite: (messageId: string) => void;
}) => {
  const [dividerWidth, setDividerWidth] = useState(0);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDividerWidth = () => {
      if (dividerRef.current) {
        setDividerWidth(dividerRef.current.scrollWidth);
      }
    };

    updateDividerWidth();

    window.addEventListener("resize", updateDividerWidth);

    return () => {
      window.removeEventListener("resize", updateDividerWidth);
    };
  });

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });

    if (messages.length === 1) {
      document.title = `${messages[0].content.substring(0, 30)} - FutureSearch`;
    }
  }, [messages]);

  return (
    <>
      {/* Main chat content */}
      <div className="flex flex-col space-y-6 pt-8 pb-32 sm:mx-4 md:mx-8">
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1;

          return (
            <>
              <MessageBox
                key={i}
                message={msg}
                history={messages}
                loading={loading}
                dividerRef={isLast ? dividerRef : undefined}
                isLast={isLast}
                rewrite={rewrite}
                messageIndex={i}
                sendMessage={sendMessage}
              />
              {!isLast && msg.role === "assistant" && (
                <div className="h-px w-full bg-border" />
              )}
            </>
          );
        })}
        {loading && !messageAppeared && <MessageBoxLoading />}
        <div ref={messageEnd} className="h-0" />
      </div>

      {/* Fixed bottom input area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background/95 to-background/0 pt-8">
        <div className="container max-w-screen-lg mx-auto px-6 pb-6">
          <div className="flex justify-center">
            <MessageInput sendMessage={sendMessage} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
