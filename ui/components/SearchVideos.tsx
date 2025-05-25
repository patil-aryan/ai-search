import { ImagesIcon, PlusIcon, VideoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Lightbox, { GenericSlide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Message } from "./ChatWindow";

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
      setVideos([]);
    }
    setLoading(false);
  };

  return (
    <>
      {!loading && videos === null && (
        <button
          onClick={loadVideos}
          className="border border-dashed border-gray-300 hover:bg-gray-50 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg text-gray-700 text-sm w-full bg-white hover:border-gray-400"
        >
          <div className="flex flex-row items-center space-x-2">
            <VideoIcon size={17} />
            <p>Search videos</p>
          </div>
          <PlusIcon className="text-gray-600" size={17} />
        </button>
      )}
      {loading && (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <VideoIcon className="w-4 h-4 mr-2" />
            Related Videos
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-24 w-full rounded-lg animate-pulse aspect-video"
              />
            ))}
          </div>
        </div>
      )}
      {videos !== null && videos.length > 0 && (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <VideoIcon className="w-4 h-4 mr-2" />
            Related Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {videos.length > 4
              ? videos.slice(0, 3).map((video, i) => (
                  <div key={i} className="relative group">
                    <img
                      onClick={() => {
                        setOpen(true);
                        setSlides([
                          slides[i],
                          ...slides.slice(0, i),
                          ...slides.slice(i + 1),
                        ]);
                      }}
                      src={video.img_src}
                      alt={video.title}
                      className="h-24 w-full aspect-video object-cover rounded-lg transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105 hover:shadow-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-60 rounded-full p-2 group-hover:bg-opacity-80 transition-all duration-200">
                        <VideoIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))
              : videos.map((video, i) => (
                  <div key={i} className="relative group">
                    <img
                      onClick={() => {
                        setOpen(true);
                        setSlides([
                          slides[i],
                          ...slides.slice(0, i),
                          ...slides.slice(i + 1),
                        ]);
                      }}
                      src={video.img_src}
                      alt={video.title}
                      className="h-24 w-full aspect-video object-cover rounded-lg transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105 hover:shadow-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-60 rounded-full p-2 group-hover:bg-opacity-80 transition-all duration-200">
                        <VideoIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
            {videos.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 transition duration-200 active:scale-95 h-24 w-full rounded-lg flex flex-col justify-between text-gray-700 p-2 hover:scale-105"
              >
                <div className="flex flex-row items-center space-x-1">
                  {videos.slice(3, 6).map((video, i) => (
                    <img
                      key={i}
                      src={video.img_src}
                      alt={video.title}
                      className="h-4 w-8 rounded-md aspect-video object-cover"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs">
                  +{videos.length - 3} more
                </p>
              </button>
            )}
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
