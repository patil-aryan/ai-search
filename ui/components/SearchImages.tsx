import { ImageIcon, ZoomIn, MoreHorizontal, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Message } from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Image = {
  url: string;
  img_src: string;
  title: string;
};

const SearchImages = ({
  query,
  chat_history,
}: {
  query: string;
  chat_history: Message[];
}) => {
  const [images, setImages] = useState<Image[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  // Auto-load images when component mounts
  useEffect(() => {
    if (query && query.trim()) {
      loadImages();
    }
  }, [query]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/images`,
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
        throw new Error(`Failed to fetch images: ${res.status}`);
      }

      const data = await res.json();
      const images = data.images || [];
      setImages(images);

      if (images && Array.isArray(images)) {
        setSlides(
          images.map((image: Image) => {
            return {
              src: image.img_src,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error loading images:", error);
      setError(error instanceof Error ? error.message : "Failed to load images");
      setImages([]);
    }
    setLoading(false);
  };

  const retry = () => {
    if (query && query.trim()) {
      loadImages();
    }
  };

  return (
    <>
      {!loading && images === null && (
        <Button
          onClick={loadImages}
          variant="outline"
          className="w-full border-dashed border-border hover:bg-accent hover:border-primary/50 transition-all duration-200 h-12 group"
        >
          <div className="flex items-center space-x-2">
            <ImageIcon size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Search Images</span>
          </div>
        </Button>
      )}
      
      {loading && (
        <div className="w-full border border-border rounded-xl bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-primary/10">
                  <ImageIcon className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Related Images</h3>
              </div>
              <Badge variant="secondary" className="text-xs animate-pulse">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Loading
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={cn(
                    "h-20 w-full rounded-lg",
                    i % 2 === 0 && "animate-pulse"
                  )}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
              <div className="flex gap-1 mr-2">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties} />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties} />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties} />
              </div>
              Searching for relevant images...
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
                <h3 className="text-sm font-semibold text-destructive">Image Search Failed</h3>
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

      {images !== null && images && Array.isArray(images) && images.length > 0 && (
        <div className="w-full border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-primary/10">
                  <ImageIcon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Related Images</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {images.length}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {images.length > 4
                ? images.slice(0, 3).map((image, i) => (
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
                      className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    >
                      <img
                        src={image.img_src}
                        alt={image.title}
                        className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/200x80/f1f5f9/64748b?text=Image+Not+Found`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-background/90 rounded-full p-2 shadow-lg backdrop-blur-sm">
                            <ZoomIn className="w-3 h-3 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : images.map((image, i) => (
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
                      className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    >
                      <img
                        src={image.img_src}
                        alt={image.title}
                        className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/200x80/f1f5f9/64748b?text=Image+Not+Found`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-background/90 rounded-full p-2 shadow-lg backdrop-blur-sm">
                            <ZoomIn className="w-3 h-3 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              {images.length > 4 && (
                <Button
                  onClick={() => setOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="h-20 w-full border border-dashed border-border hover:border-primary/50 hover:bg-accent flex-col justify-center p-2 group"
                >
                  <div className="flex items-center space-x-1 mb-1">
                    {images.slice(3, 6).map((image, i) => (
                      <img
                        key={i}
                        src={image.img_src}
                        alt={image.title}
                        className="h-2 w-4 rounded-sm object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/16x8/f1f5f9/64748b?text=?`;
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1">
                    <MoreHorizontal className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      +{images.length - 3}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>
          <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
        </div>
      )}

      {images !== null && images && Array.isArray(images) && images.length === 0 && (
        <div className="w-full border border-border rounded-xl bg-card shadow-sm">
          <div className="p-4">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <h3 className="text-sm font-medium text-foreground mb-1">No Images Found</h3>
              <p className="text-xs text-muted-foreground mb-3">Try refining your search query</p>
              <Button
                onClick={retry}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Search Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchImages;
