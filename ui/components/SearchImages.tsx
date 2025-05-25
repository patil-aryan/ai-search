import { ImagesIcon, PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Message } from "./ChatWindow";

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
      setImages([]);
    }
    setLoading(false);
  };

  return (
    <>
      {!loading && images === null && (
        <button
          onClick={loadImages}
          className="border border-dashed border-gray-300 hover:bg-gray-50 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg text-gray-700 text-sm w-full bg-white hover:border-gray-400"
        >
          <div className="flex flex-row items-center space-x-2">
            <ImagesIcon size={17} />
            <p>Search images</p>
          </div>
          <PlusIcon className="text-gray-600" size={17} />
        </button>
      )}
      {loading && (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <ImagesIcon className="w-4 h-4 mr-2" />
            Related Images
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
      {images !== null && images && Array.isArray(images) && images.length > 0 && (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <ImagesIcon className="w-4 h-4 mr-2" />
            Related Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {images.length > 4
              ? images.slice(0, 3).map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-24 w-full aspect-video object-cover rounded-lg transition-all duration-200 active:scale-95 cursor-zoom-in hover:scale-105 hover:shadow-md"
                  />
                ))
              : images.map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-24 w-full aspect-video object-cover rounded-lg transition-all duration-200 active:scale-95 cursor-zoom-in hover:scale-105 hover:shadow-md"
                  />
                ))}
            {images.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 transition duration-200 active:scale-95 h-24 w-full rounded-lg flex flex-col justify-between text-gray-700 p-2 hover:scale-105"
              >
                <div className="flex flex-row items-center space-x-1">
                  {images.slice(3, 6).map((image, i) => (
                    <img
                      key={i}
                      src={image.img_src}
                      alt={image.title}
                      className="h-4 w-8 rounded-md aspect-video object-cover"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs">
                  +{images.length - 3} more
                </p>
              </button>
            )}
          </div>
          <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
        </div>
      )}
    </>
  );
};

export default SearchImages;
