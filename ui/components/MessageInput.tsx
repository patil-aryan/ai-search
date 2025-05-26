import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Attach } from "./MessageInputActions";
import { Send, Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MessageInput = ({
  sendMessage,
  loading,
}: {
  sendMessage: (message: string) => void;
  loading: boolean;
}) => {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        if (loading) return;
        e.preventDefault();
        if (message.trim()) {
          sendMessage(message);
          setMessage("");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
          e.preventDefault();
          if (message.trim()) {
            sendMessage(message);
            setMessage("");
          }
        }
      }}
      className="flex items-center gap-3 bg-background border-2 border-border rounded-2xl p-4 max-w-3xl w-full shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary/30 focus-within:border-primary/50 focus-within:shadow-xl"
    >
      {/* Search Icon */}
      <div className="flex items-center justify-center">
        <Search className="w-5 h-5 text-primary" />
      </div>

      {/* Input Container */}
      <div className="flex-1 relative">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent placeholder:text-muted-foreground text-foreground resize-none focus:outline-none text-base leading-7 max-h-32 font-medium"
          placeholder="Ask anything..."
          rows={1}
          maxRows={4}
        />
      </div>

      {/* Attach Button */}
      <div className="flex items-center">
        <Attach />
      </div>

      {/* Send Button */}
      <Button
        type="submit"
        disabled={!message.trim() || loading}
        size="icon"
        className={cn(
          "h-10 w-10 rounded-xl transition-all duration-200 shadow-md",
          loading || !message.trim()
            ? "bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:scale-105"
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};

export default MessageInput;
