"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Attach, CopilotToggle, Focus } from "./MessageInputActions";
import { ArrowRight, Search } from "lucide-react";

const EnhancedMessageInput = ({
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
        if (message.trim()) {
          sendMessage(message);
          setMessage("");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (message.trim()) {
            sendMessage(message);
            setMessage("");
          }
        }
      }}
      className="w-full"
    >
      <div className="relative">
        {/* Main search container */}
        <div className="bg-gradient-to-br from-[#181c24] via-[#1a1f2e] to-[#1c2028] backdrop-blur-lg border border-[#23272f]/50 rounded-2xl shadow-2xl hover:shadow-[#24A0ED]/10 transition-all duration-300 overflow-hidden">
          {/* Search icon and input */}
          <div className="flex items-center px-6 py-4">
            <Search className="text-white/40 mr-4 flex-shrink-0" size={24} />
            <TextareaAutosize
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={1}
              maxRows={4}
              className="bg-transparent placeholder:text-white/40 text-lg text-white resize-none focus:outline-none w-full"
              placeholder="Ask anything..."
            />
            <button
              type="submit"
              disabled={message.trim().length === 0}
              className="ml-4 bg-gradient-to-r from-[#24A0ED] to-[#1a8fd1] text-white disabled:text-white/40 hover:from-[#2bb0ff] hover:to-[#24A0ED] hover:scale-105 active:scale-95 transition-all duration-150 disabled:bg-gradient-to-r disabled:from-[#2a2f3a] disabled:to-[#1f242e] rounded-xl p-3 shadow-lg disabled:shadow-none flex-shrink-0"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Bottom controls bar */}
          <div className="border-t border-[#23272f]/50 bg-gradient-to-r from-[#181c24]/80 to-[#1a1f2e]/80 px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left side controls */}
              <div className="flex items-center space-x-3">
                <div className="relative z-50">
                  <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
                </div>
                <div className="h-6 w-px bg-[#23272f]" />
                <Attach />
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-4">
                <CopilotToggle
                  copilotEnabled={copilotEnabled}
                  setCopilotEnabled={setCopilotEnabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Language options */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
          <span className="text-white/40">Language Options:</span>
          {["Hindi", "Marathi", "Bangla", "Punjabi", "Kannada", "Telugu", "Urdu", "Gujarati", "Malayalam", "Oriya", "Tamil"].map((lang) => (
            <button
              key={lang}
              className="text-white/50 hover:text-[#24A0ED] transition-colors duration-200"
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="text-white/40 text-sm">Try this:</span>
          {["CHAT", "IMAGES", "VIDEOS", "MAPS"].map((category) => (
            <button
              key={category}
              className="text-sm font-medium text-white/60 hover:text-[#24A0ED] border border-[#23272f] hover:border-[#24A0ED]/30 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#24A0ED]/5"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default EnhancedMessageInput; 