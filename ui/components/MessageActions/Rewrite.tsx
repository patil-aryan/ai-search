import { ArrowLeftRight } from "lucide-react";

const Rewrite = ({
  rewrite,
  messageId,
}: {
  rewrite: (messagedId: string) => void;
  messageId: string;
}) => {
  return (
    <button
      className="p-2 text-black/70 rounded-xl hover:bg-[#1c1c1c] transition duration-200 hover:text-black"
      onClick={() => rewrite(messageId)}
    >
      <ArrowLeftRight size={18} />
    </button>
  );
};

export default Rewrite;
