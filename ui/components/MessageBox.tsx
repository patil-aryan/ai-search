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
  Sparkles,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Search,
} from "lucide-react";
import MessageSources from "./MessageSources";
import Markdown from "markdown-to-jsx";
import StreamingText from "./StreamingText";
import Rewrite from "./MessageActions/Rewrite";
import Copy from "./MessageActions/Copy";
import SearchImages from "./SearchImages";
import SearchVideos from "./SearchVideos";
import { useSpeech } from "react-text-to-speech";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Fetch related searches from SearXNG backend
const fetchRelatedSearches = async (query: string, chatHistory: Message[]): Promise<string[]> => {
  try {
    // Convert message history to the format expected by backend
    const chat_history = chatHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    }));

    console.log('Fetching related searches for query:', query);
    console.log('Chat history:', chat_history);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        chat_history: chat_history, // Reverted to chat_history
      }),
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      console.error(`Failed to fetch suggestions: ${response.status}`);
      throw new Error(`Failed to fetch suggestions: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    const suggestions = (data.suggestions || []).filter(Boolean).slice(0, 4);
    
    if (suggestions.length > 0) {
      console.log('Using API suggestions:', suggestions);
      return suggestions;
    } else {
      console.log('API returned empty suggestions, using fallback');
      return generateContextualSuggestions(query);
    }
  } catch (error) {
    console.error('Error fetching related searches:', error);
    // Use contextual fallback only on error
    return generateContextualSuggestions(query);
  }
};

// Generate contextual suggestions based on the user's query (fallback)
const generateContextualSuggestions = (query: string): string[] => {
  if (!query) return [];
  
  const queryLower = query.toLowerCase();
  const suggestions: string[] = [];
  
  // Add specific contextual suggestions based on query content
  if (queryLower.includes('programming') || queryLower.includes('code') || queryLower.includes('development')) {
    suggestions.push(`${query} best practices`);
    suggestions.push(`${query} examples and tutorials`);
    suggestions.push(`Latest ${query} frameworks`);
    suggestions.push(`${query} debugging tips`);
  } else if (queryLower.includes('health') || queryLower.includes('fitness') || queryLower.includes('medical')) {
    suggestions.push(`${query} symptoms and causes`);
    suggestions.push(`${query} treatment options`);
    suggestions.push(`${query} prevention methods`);
    suggestions.push(`${query} expert advice`);
  } else if (queryLower.includes('travel') || queryLower.includes('vacation')) {
    suggestions.push(`${query} cost and budget`);
    suggestions.push(`Best time to ${query}`);
    suggestions.push(`${query} itinerary planning`);
    suggestions.push(`${query} travel tips`);
  } else {
    // Generic suggestions
    suggestions.push(`How to ${query}`);
    suggestions.push(`${query} tutorial`);
    suggestions.push(`${query} vs alternatives`);
    suggestions.push(`Latest ${query} trends`);
  }
  
  // Remove duplicates and return first 4
  return Array.from(new Set(suggestions)).slice(0, 4);
};

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
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  useEffect(() => {
    if (
      message.role === "assistant" &&
      message?.sources &&
      message.sources.length > 0
    ) {
      const regex = /\[(\d+)\]/g;

      setSpeechMessage(message.content.replace(regex, ""));

      // Fetch related searches from SearXNG backend
      const userQuery = history[messageIndex - 1]?.content || "";
      if (userQuery && isLast && !loading) {
        fetchRelatedSearches(userQuery, history.slice(0, messageIndex - 1)).then(suggestions => {
          setRelatedSearches(suggestions);
          if (!message.suggestions) {
            message.suggestions = suggestions;
          }
        });
      }
      
      // Process citations more carefully to avoid duplicates
      let processedContent = message.content;
      const citationMap = new Map();
      
      // First pass: collect all unique citations
      let match;
      while ((match = regex.exec(message.content)) !== null) {
        const number = parseInt(match[1]);
        if (number > 0 && number <= message.sources.length && !citationMap.has(number)) {
          citationMap.set(number, message.sources[number - 1]?.metadata?.url);
        }
      }
      
      // Second pass: replace with clean citations
      regex.lastIndex = 0; // Reset regex
      processedContent = message.content.replace(
        /\[(\d+)\]/g,
        (_, number) => {
          const num = parseInt(number);
          const url = citationMap.get(num);
          if (url) {
            return `<a href="${url}" target="_blank" className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md ml-1 no-underline text-sm hover:bg-primary/20 transition-colors inline-flex items-center font-medium border border-primary/20">${number}</a>`;
          }
          return `[${number}]`; // Keep original if no valid source
        }
      );
      
      return setParsedMessage(processedContent);
    }

    setParsedMessage(message.content);
  }, [message.content, message.sources, message.role, isLast, loading, history, messageIndex]);

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const allSuggestions = message.suggestions || relatedSearches;
  const displayedSuggestions = showAllSuggestions ? allSuggestions : allSuggestions.slice(0, 4);

  return (
    <div className="bg-background">
      {message.role === "user" && (
        <div className={cn(
          "w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-5 rounded-xl shadow-sm backdrop-blur-sm",
          messageIndex === 0 ? "mt-4" : "mt-3"
        )}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">Your Question</span>
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{formatTimeAgo(message.createdAt)}</span>
              </div>
              <h2 className="text-foreground font-semibold text-lg leading-relaxed">
                {message.content}
              </h2>
            </div>
          </div>
        </div>
      )}

      {message.role === "assistant" && (
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:space-x-8 bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <div
            ref={dividerRef}
            className="flex flex-col space-y-6 w-full lg:w-9/12"
          >
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <BookCopy className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-lg">Sources</h3>
                      <p className="text-sm text-muted-foreground">Referenced information</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <MessageSources sources={message.sources} />
              </div>
            )}
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Disc3
                      className={cn(
                        "text-green-600",
                        isLast && loading ? "animate-spin" : "animate-none"
                      )}
                      size={20}
                    />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">Answer</h3>
                    <p className="text-sm text-muted-foreground">
                      {isLast && loading ? "Generating response..." : "AI-powered response"}
                    </p>
                  </div>
                </div>
                {!loading && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      High Quality
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(message.createdAt)}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-br from-card to-muted/20 p-6 rounded-lg border border-border/50">
                {isLast && loading ? (
                  <StreamingText 
                    text={parsedMessage} 
                    speed={25}
                    isComplete={!loading}
                  />
                ) : (
                  <Markdown className="prose prose-neutral max-w-none break-words prose-p:leading-relaxed prose-pre:p-0 text-foreground text-sm md:text-base font-normal prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:pl-4 prose-ol:pl-4 prose-li:my-1">
                    {parsedMessage}
                  </Markdown>
                )}
              </div>
              
              {!loading && (
                <div className="flex flex-row items-center justify-between w-full text-muted-foreground py-4 border-t border-border mt-6">
                  <div className="flex flex-row items-center space-x-1">
                    <Rewrite rewrite={rewrite} messageId={message.id} />
                  </div>
                  <div className="flex flex-row items-center space-x-1">
                    <Copy initialMessage={message.content} message={message} />
                    <Button
                      onClick={() => {
                        if (speechStatus === "started") {
                          stop();
                        } else {
                          start();
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-2 text-muted-foreground rounded-lg hover:bg-accent transition duration-200 hover:text-foreground"
                    >
                      {speechStatus === "started" ? (
                        <StopCircle size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {isLast &&
                allSuggestions.length > 0 &&
                message.role === "assistant" &&
                !loading && (
                  <>
                    <div className="border-t border-border/50 pt-6 mt-6" />
                    <div className="flex flex-col space-y-6">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <Sparkles className="text-primary w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Related Searches</h3>
                            <p className="text-sm text-muted-foreground">Continue exploring these topics</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {allSuggestions.length} suggestion{allSuggestions.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {displayedSuggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            onClick={() => sendMessage(suggestion)}
                            variant="outline"
                            className="group p-4 h-auto rounded-xl border border-border/50 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md text-left justify-start"
                          >
                            <div className="flex items-start justify-between w-full gap-3">
                              <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-3 leading-relaxed text-left flex-1">
                                {suggestion}
                              </p>
                              <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-all duration-200 flex-shrink-0">
                                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      {allSuggestions.length > 4 && (
                        <div className="flex justify-center pt-3">
                          <Button
                            onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                            variant="ghost"
                            size="sm"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                          >
                            {showAllSuggestions ? (
                              <>Show Less</>
                            ) : (
                              <>Show {allSuggestions.length - 4} More Suggestions</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
            </div>
          </div>
          
          <div className="lg:sticky lg:top-20 flex flex-col items-center space-y-4 w-full lg:w-3/12 z-30 h-full pb-4">
            <SearchImages
              query={history[messageIndex - 1]?.content || ""}
              chat_history={history.slice(0, messageIndex - 1)}
            />
            <SearchVideos
              chat_history={history.slice(0, messageIndex - 1)}
              query={history[messageIndex - 1]?.content || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
