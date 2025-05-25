"use client";

import {
  BookOpenText,
  CircleAlert,
  Globe, // Added Globe icon
  Home,
  Search,
  SearchCode,
  Settings,
  SquareIcon,
} from "lucide-react";
import Layout from "./Layout";
import { useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import SettingsDialog from "./SettingsDialog";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navLinks = [
    {
      icon: Home,
      href: "/",
      active: segments.length === 0,
      label: "Home",
    },
    {
      icon: Search,
      href: "/",
      active: segments.includes("discover"),
      label: "Discover",
    },
    {
      icon: BookOpenText,
      href: "/",
      active: segments.includes("library"),
      label: "Library",
    },
  ];
  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col"> {/* Increased width for text */}
        <div className="flex grow flex-col items-start justify-between gap-y-5 overflow-y-auto bg-[#111111] px-4 py-8"> {/* Changed items-center to items-start and px-2 to px-4 */}
          <a href="/" className="flex flex-row items-center gap-x-3 mb-4"> {/* Added flex for icon and text, and margin */}
            <Globe className="text-white cursor-pointer h-8 w-8 animate-spin-slow" /> {/* Changed logo to Globe and added animation */}
            <span className="text-white font-semibold text-xl">AI SEARCH</span> {/* Changed App Name */}
          </a>
          <div className="flex flex-col items-start gap-y-1 w-full"> {/* Changed items-center to items-start and gap */}
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`
                    relative flex flex-row items-center gap-x-3 cursor-pointer hover:bg-white/10 hover:text-white duration-150 transition w-full px-3 py-2.5 rounded-lg ${
                      link.active ? "text-white bg-white/5" : "text-white/70"
                    }`}
              >
                <link.icon className="h-5 w-5" /> {/* Added icon size */}
                <span className="text-sm font-medium">{link.label}</span> {/* Added text label */}
                {link.active && (
                  <div className="absolute right-0 h-full w-1 rounded-l-lg bg-white" />
                )}
              </Link>
            ))}
          </div>
          <div
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-white/70 cursor-pointer hover:bg-white/10 hover:text-white duration-150 transition w-full px-3 py-2.5 rounded-lg flex flex-row items-center gap-x-3"
          >
            <Settings className="h-5 w-5" /> {/* Added icon size */}
            <span className="text-sm font-medium">Settings</span> {/* Added text label */}
          </div>
          <SettingsDialog
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
          />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-row w-full z-50 items-center gap-x-6 bg-[#111111] px-4 py-4 shadow-sm lg:hidden">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`
                    relative flex flex-col items-center space-y-1 text-center w-full ${
                      link.active ? "text-white" : "text-white/70"
                    }`}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 w-full h-1 rounded-l-lg bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>
      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
