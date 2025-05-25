import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Attach, CopilotToggle } from "./MessageInputActions";
import { ArrowUp, Search } from "lucide-react";

const MessageInput = ({
  sendMessage,
  loading,
}: {
  sendMessage: (message: string) => void;
  loading: boolean;
}) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [textareaRows, setTextareaRows] = useState(1);

  const [mode, setMode] = useState<"multi" | "single">("single");

  useEffect(() => {
    if (textareaRows >= 2 && message && mode === "single") {
      setMode("multi");
    } else if (!message && mode === "multi") {
      setMode("single");
    }
  }, [textareaRows, mode, message]);

  return (
    <form
      onSubmit={(e) => {
        if (loading) return;
        e.preventDefault();
        sendMessage(message);
        setMessage("");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }
      }}
      className={cn(
        "bg-white border border-gray-300 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200",
        mode === "multi" ? "flex-col p-4 rounded-lg shadow-lg" : "flex-row p-3 shadow-sm"
      )}
    >
      {mode === "single" && (
        <div className="flex items-center mr-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <TextareaAutosize
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onHeightChange={(height, props) => {
          setTextareaRows(Math.ceil(height / props.rowHeight));
        }}
        className="bg-transparent placeholder:text-gray-400 text-gray-900 resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink text-base"
        placeholder="Ask a follow up..."
      />
      {mode === "single" && (
        <div className="flex flex-row items-center space-x-3 ml-3">
          <CopilotToggle
            copilotEnabled={copilotEnabled}
            setCopilotEnabled={setCopilotEnabled}
          />
          <button
            disabled={message.trim().length === 0 || loading}
            className="bg-gray-900 text-white disabled:text-gray-400 hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-200 rounded-md p-2"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      )}
      {mode === "multi" && (
        <>
          <div className="flex items-center mb-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <Attach />
          </div>
          <div className="flex flex-row items-center justify-between w-full pt-2 border-t border-gray-200">
            <div className="flex flex-row items-center space-x-3">
              <CopilotToggle
                copilotEnabled={copilotEnabled}
                setCopilotEnabled={setCopilotEnabled}
              />
            </div>
            <button
              disabled={message.trim().length === 0 || loading}
              className="bg-gray-900 text-white disabled:text-gray-400 hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-200 rounded-md p-2"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default MessageInput;
