import EmptyChatMessageInput from "./EmptyChatMessageInput";

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-screen mx-auto p-2 space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-white text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent -mt-8">
          Research begins here.
        </h2>
        <p className="text-white/50 text-lg font-light max-w-md mx-auto">
          Ask anything and let AI search the web for comprehensive answers
        </p>
      </div>
      <EmptyChatMessageInput
        sendMessage={sendMessage}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />
    </div>
  );
};

export default EmptyChat;
