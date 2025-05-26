import { VideoIcon, Play, MoreHorizontal, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Lightbox, { GenericSlide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Message } from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Video = {
  url: string;
  img_src: string;
  title: string;
  iframe_src: string;
};

declare module "yet-another-react-lightbox" {
  export interface VideoSlide extends GenericSlide {
    type: "video-slide";
    src: string;
    iframe_src: string;
  }

  interface SlideTypes {
    "video-slide": VideoSlide;
  }
}

const SearchVideos = ({
  query,
  chat_history,
}: {
  query: string;
  chat_history: Message[];
}) => {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  // Auto-load videos when component mounts
  useEffect(() => {
    if (query && query.trim()) {
      loadVideos();
    }
  }, [query]);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/videos`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            chat_history: chat_history,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch videos: ${res.status}`);
      }

      const data = await res.json();
      const videos = data.videos || [];
      setVideos(videos);

      setSlides(
        videos.map((video: Video) => {
          return {
            type: "video-slide",
            iframe_src: video.iframe_src,
            src: video.img_src,
          };
        })
      );
    } catch (error) {
      console.error("Error loading videos:", error);
      setError(error instanceof Error ? error.message : "Failed to load videos");
      setVideos([]);
    }
    setLoading(false);
  };

  const retry = () => {
    if (query && query.trim()) {
      loadVideos();
    }
  };

  // Don't show anything if there are no videos, loading failed, or error occurred
  if (!loading && (!videos || videos.length === 0 || error)) {
    return null;
  }

  // Don't show if videos is empty array
  if (videos && videos.length === 0) {
    return null;
  }

  return (
    <>
      {!loading && videos === null && (
        <Button
          onClick={loadVideos}
          variant="outline"
          className="w-full border-dashed border-border hover:bg-accent hover:border-primary/50 transition-all duration-200 h-12 group"
        >
          <div className="flex items-center space-x-2">
            <VideoIcon size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Search Videos</span>
          </div>
        </Button>
      )}
      
      {loading && (
        <div className="w-full border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm shadow-sm">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <VideoIcon className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <h3 className="text-sm font-medium text-foreground">Related Videos</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Searching...
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="h-16 w-24 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
              <div className="flex gap-1 mr-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties} />
              </div>
              Finding relevant videos...
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full border border-destructive/20 rounded-xl bg-destructive/5 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Video Search Failed</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{error}</p>
            <Button
              onClick={retry}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {videos && videos.length > 0 && (
        <div className="w-full border border-border/50 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <VideoIcon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">Related Videos</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {videos.slice(0, 3).map((video, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setOpen(true);
                    setSlides([
                      slides[i],
                      ...slides.slice(0, i),
                      ...slides.slice(i + 1),
                    ]);
                  }}
                  className="group flex space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/50"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.img_src}
                      alt={video.title}
                      className="h-16 w-24 aspect-video object-cover rounded-lg border border-border/20"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/96x64/f1f5f9/64748b?text=Video`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-200 rounded-lg">
                      <div className="bg-background/95 rounded-full p-2 shadow-lg backdrop-blur-sm border border-border/20">
                        <Play className="w-3 h-3 text-primary fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">Click to watch video</p>
                  </div>
                </div>
              ))}
              
              {videos.length > 3 && (
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full h-auto p-3 border-dashed border-border/50 hover:border-primary/50 hover:bg-accent/30 justify-center group"
                >
                  <div className="flex items-center space-x-2">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      View {videos.length - 3} more video{videos.length - 3 !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>
          
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            render={{
              slide: ({ slide }) =>
                slide.type === "video-slide" ? (
                  <div className="h-full w-full flex flex-row items-center justify-center">
                    <iframe
                      src={slide.iframe_src}
                      className="aspect-video max-h-[95vh] w-[95vw] rounded-2xl md:w-[80vw]"
                      allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : null,
            }}
          />
        </div>
      )}
    </>
  );
};

export default SearchVideos;
