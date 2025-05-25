const MessageBoxLoading = () => {
  return (
    <div className="flex flex-col space-y-3 w-full lg:w-9/12 bg-gradient-to-br from-[#181c24] to-[#1a1f2e] rounded-2xl p-4 border border-[#23272f]/50 shadow-lg">
      <div className="h-3 rounded-full w-full bg-gradient-to-r from-[#23272f] to-[#2a2f3a] animate-pulse" />
      <div className="h-3 rounded-full w-4/5 bg-gradient-to-r from-[#23272f] to-[#2a2f3a] animate-pulse" />
      <div className="h-3 rounded-full w-3/4 bg-gradient-to-r from-[#23272f] to-[#2a2f3a] animate-pulse" />
    </div>
  );
};

export default MessageBoxLoading;
