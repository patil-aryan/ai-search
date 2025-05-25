import { CopyPlus, Globe, Pencil, ScanEye, SwatchBook } from "lucide-react";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";
import { SiYoutube, SiReddit } from "@icons-pack/react-simple-icons";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Attach = () => {
  return (
    <button
      type="button"
      className="p-2 text-white/50 rounded-xl hover:bg-gradient-to-r hover:from-[#24A0ED]/10 hover:to-transparent transition-all duration-200 hover:text-white hover:scale-105 active:scale-95"
    >
      <CopyPlus />
    </button>
  );
};

const focusModes = [
  {
    key: "webSearch",
    title: "All",
    description: "Searches across all of the internet",
    icon: <Globe size={20} />,
  },
  {
    key: "academicSearch",
    title: "Academic",
    description: "Search in published academic papers",
    icon: <SwatchBook size={20} />,
  },
  {
    key: "writingAssistant",
    title: "Writing",
    description: "Chat without searching the web",
    icon: <Pencil size={16} />,
  },
  {
    key: "youtubeSearch",
    title: "Youtube",
    description: "Search and watch videos",
    icon: (
      <SiYoutube
        className="h-5 w-auto mr-0.5"
        onPointerEnter={undefined}
        onPointerLeave={undefined}
      />
    ),
  },
  {
    key: "redditSearch",
    title: "Reddit",
    description: "Search for discussions and opinions",
    icon: (
      <SiReddit
        className="h-5 w-auto mr-0.5"
        onPointerEnter={undefined}
        onPointerLeave={undefined}
      />
    ),
  },
];

export const Focus = ({
  focusMode,
  setFocusMode,
}: {
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  return (
    <Popover className="relative">
      <Popover.Button
        type="button"
        className="flex items-center space-x-2 p-2 text-white/70 hover:text-white hover:bg-[#23272f] rounded-lg transition-all duration-200 active:scale-95"
      >
        {focusMode !== "webSearch" ? (
          <div className="flex flex-row items-center space-x-2">
            {focusModes.find((mode) => mode.key === focusMode)?.icon}
            <span className="text-sm font-medium">
              {focusModes.find((mode) => mode.key === focusMode)?.title}
            </span>
          </div>
        ) : (
          <>
            <ScanEye size={18} />
            <span className="text-sm font-medium">All</span>
          </>
        )}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95 translate-y-1"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 translate-y-1"
      >
        <Popover.Panel className="absolute bottom-full left-0 mb-2 z-[100] w-96">
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] border border-[#23272f] rounded-xl shadow-2xl backdrop-blur-lg p-3">
            <div className="grid grid-cols-2 gap-2">
              {focusModes.map((mode, i) => (
                <Popover.Button
                  onClick={() => setFocusMode(mode.key)}
                  key={i}
                  className={cn(
                    "p-3 rounded-lg flex flex-col items-start space-y-2 duration-200 cursor-pointer transition-all text-left",
                    focusMode === mode.key 
                      ? "bg-gradient-to-r from-[#24A0ED]/20 to-[#1a8fd1]/20 border border-[#24A0ED]/30 text-white shadow-lg" 
                      : "hover:bg-[#23272f] text-white/70 hover:text-white border border-transparent"
                  )}
                >
                  <div className={cn(
                    "flex flex-row items-center space-x-2",
                    focusMode === mode.key ? "text-[#24A0ED]" : "text-white/80"
                  )}>
                    {mode.icon}
                    <span className="text-sm font-medium">{mode.title}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{mode.description}</p>
                </Popover.Button>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export const CopilotToggle = ({
  copilotEnabled,
  setCopilotEnabled,
}: {
  copilotEnabled: boolean;
  setCopilotEnabled: (enabled: boolean) => void;
}) => {
  return (
    <div className="group flex flex-row items-center space-x-1 active:scale-95 duration-200 transition cursor-pointer">
      <Switch
        checked={copilotEnabled}
        onCheckedChange={setCopilotEnabled}
        className="bg=[#111111] border border-[#1C1C1C] relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full"
      >
        <span className="sr-only">Copilot</span>
        <span
          className={cn(
            copilotEnabled
              ? "translate-x-6 bg-[#24A0ED]"
              : "translate-x-1 bg-white/50",
            "inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full transition-all duration-200"
          )}
        ></span>
      </Switch>
      <p
        onClick={() => setCopilotEnabled(!copilotEnabled)}
        className={cn(
          "text-xs font-medium transition-colors duration-150 ease-in-out",
          copilotEnabled
            ? "text-[#24A0ED]"
            : "text-white/50 group-hover:text-white"
        )}
      >
        Copilot
      </p>
    </div>
  );
};
