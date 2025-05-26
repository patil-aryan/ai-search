import { useEffect, useState } from "react";
import { Message } from "./ChatWindow";
import { formatTimeDifference } from "@/lib/utils";
import { Clock, Edit, Share, Trash } from "lucide-react";

const Navbar = ({ messages }: { messages: Message[] }) => {
  const [title, setTitle] = useState<string>("");
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);

      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt!
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return empty navbar - effectively removing the black bar
  return null;
};

export default Navbar;
