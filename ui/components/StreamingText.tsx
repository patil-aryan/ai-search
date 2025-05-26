import { useState, useEffect } from 'react';
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";

interface StreamingTextProps {
  text: string;
  className?: string;
  speed?: number;
  isComplete?: boolean;
  enableWordStreaming?: boolean;
}

const StreamingText = ({ 
  text, 
  className = "", 
  speed = 20, 
  isComplete = false,
  enableWordStreaming = true
}: StreamingTextProps) => {
  // Just display the text immediately without streaming
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Markdown className="prose prose-neutral max-w-none break-words prose-p:leading-relaxed prose-pre:p-0 text-foreground text-sm md:text-base font-normal prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          {text}
        </Markdown>
      </div>
    </div>
  );
};

export default StreamingText; 