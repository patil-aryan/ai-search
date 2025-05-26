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
      href: "/discover",
      active: segments.includes("discover"),
      label: "Discover",
    },
    {
      icon: BookOpenText,
      href: "/library",
      active: segments.includes("library"),
      label: "Library",
    },
  ];
  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col items-start justify-between gap-y-5 overflow-y-auto bg-gradient-to-b from-[#10131a] via-[#111111] to-[#181c24] px-5 py-8 shadow-2xl border-r border-[#1a1f2e]">
          <a href="/" className="flex flex-row items-center gap-x-3 mb-6 group">
            <div className="relative">
              <Globe className="text-[#24A0ED] cursor-pointer h-9 w-9 animate-pulse drop-shadow-lg" />
              <div className="absolute inset-0 text-[#24A0ED] h-9 w-9 animate-ping opacity-20">
                <Globe className="h-9 w-9" />
              </div>
            </div>
            <span className="text-white font-bold text-xl tracking-wide group-hover:text-[#24A0ED] transition-colors duration-200">AI SEARCH</span>
          </a>
          <div className="flex flex-col items-start gap-y-2 w-full">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`
                    relative flex flex-row items-center gap-x-4 cursor-pointer hover:bg-gradient-to-r hover:from-[#24A0ED]/10 hover:to-transparent hover:text-white duration-200 transition-all w-full px-4 py-3 rounded-md group hover:shadow-lg hover:shadow-[#24A0ED]/5 ${
                      link.active ? "text-white bg-gradient-to-r from-[#24A0ED]/20 to-transparent shadow-lg shadow-[#24A0ED]/10" : "text-white/70"
                    }`}
              >
                <link.icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{link.label}</span>
                {link.active && (
                  <div className="absolute right-0 h-full w-1 rounded-l-md bg-gradient-to-b from-[#24A0ED] to-[#1a8fd1]" />
                )}
              </Link>
            ))}
          </div>
          <div
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-white/70 cursor-pointer hover:bg-gradient-to-r hover:from-[#24A0ED]/10 hover:to-transparent hover:text-white duration-200 transition-all w-full px-4 py-3 rounded-md flex flex-row items-center gap-x-4 group hover:shadow-lg hover:shadow-[#24A0ED]/5"
          >
            <Settings className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Settings</span>
          </div>
          <SettingsDialog
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
          />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-row w-full z-50 items-center gap-x-6 bg-gradient-to-r from-[#10131a] via-[#111111] to-[#181c24] px-4 py-4 shadow-2xl border-t border-[#1a1f2e] lg:hidden">
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
              <div className="absolute top-0 -mt-4 w-full h-1 rounded-l-md bg-white" />
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
