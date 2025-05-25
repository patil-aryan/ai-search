import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Attach, CopilotToggle, Focus } from "./MessageInputActions";
import { ArrowRight } from "lucide-react";

const EmptyChatMessageInput = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const [copilotEnabled, setCopilotEnabled] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage("");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }
      }}
      className="w-full"
    >      <div className="flex flex-col bg-gradient-to-br from-[#181c24] to-[#1a1f2e] px-6 pt-6 pb-3 rounded-2xl w-full border border-[#23272f] shadow-2xl backdrop-blur-sm hover:shadow-[#24A0ED]/5 transition-all duration-300">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={2}
          className="bg-transparent placeholder:text-white/40 text-sm text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
          placeholder="Ask anything..."
        />
        <div className="flex flex-row items-center justify-between mt-5">
          <div className="flex flex-row items-center space-x-1 -mx-2">
            <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
            <Attach />
          </div>
          <div className="flex flex-row items-center space-x-4 -mx-2">
            <CopilotToggle
              copilotEnabled={copilotEnabled}
              setCopilotEnabled={setCopilotEnabled}
            />
            <button
              disabled={message.trim().length === 0}
              className="bg-gradient-to-r from-[#24A0ED] to-[#1a8fd1] text-white disabled:text-white/40 hover:from-[#2bb0ff] hover:to-[#24A0ED] hover:scale-105 active:scale-95 transition-all duration-150 disabled:bg-gradient-to-r disabled:from-[#2a2f3a] disabled:to-[#1f242e] rounded-full p-2.5 shadow-lg disabled:shadow-none"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;
