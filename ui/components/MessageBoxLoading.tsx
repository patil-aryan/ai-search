import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles, BookCopy, Search, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MessageBoxLoading = () => {
  return (
    <div className="bg-background">
      {/* User Query Skeleton */}
      <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-5 rounded-xl shadow-sm backdrop-blur-sm mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">Your Question</span>
              <Clock className="w-3 h-3 text-muted-foreground" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:space-x-8 bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col space-y-6 w-full lg:w-9/12">
          {/* Sources Loading */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Loader2 className="text-blue-600 animate-spin" size={20} />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg">Sources</h3>
                  <p className="text-sm text-muted-foreground">Gathering information...</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Loading
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "group hover:shadow-lg transition-all duration-200 border-border bg-card hover:border-primary/30 border rounded-lg p-3",
                    i === 0 && "animate-pulse"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
              <div className="border-border bg-accent/30 border rounded-lg p-3 flex flex-col justify-center items-center space-y-2 h-full">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties} />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties} />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties} />
                </div>
                <p className="text-xs text-muted-foreground">Searching...</p>
              </div>
            </div>
          </div>

          {/* Answer Loading */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Sparkles className="text-green-600 animate-pulse" size={20} />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg">Answer</h3>
                  <p className="text-sm text-muted-foreground">Generating response...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs animate-pulse">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Processing
                </Badge>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card to-muted/20 p-6 rounded-lg border border-border/50">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties} />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties} />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties} />
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
                
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                
                {/* Progress bar for longer responses */}
                <div className="mt-4">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full animate-pulse" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Content Loading */}
        <div className="lg:sticky lg:top-20 flex flex-col items-center space-y-4 w-full lg:w-3/12 z-30 h-full pb-4">
          {/* Images Loading */}
          <div className="w-full border border-border rounded-xl bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-8 rounded-md" />
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className={cn(
                      "h-20 w-full rounded-lg",
                      i === 0 && "animate-pulse"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Videos Loading */}
          <div className="w-full border border-border rounded-xl bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-8 rounded-md" />
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <Skeleton 
                      className={cn(
                        "h-16 w-24 rounded-lg flex-shrink-0",
                        i === 0 && "animate-pulse"
                      )} 
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxLoading;
