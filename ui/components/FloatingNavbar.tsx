"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Compass, Library, Settings, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Search", href: "/", icon: Search },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Library", href: "/library", icon: Library },
];

export function FloatingNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-md",
          className
        )}
      >
        <div className="container mx-auto flex h-14 max-w-screen-lg items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 select-none">
            <span className="font-bold text-base sm:text-lg text-black">Intelligent</span>
            <span className="font-semibold text-base sm:text-lg text-neutral-700">Search</span>
          </Link>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 sm:gap-1.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md h-8 w-8 sm:h-9 sm:w-9">
              <Link href="/settings">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md h-8 w-8 sm:h-9 sm:w-9">
                  {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs bg-white p-4 sm:p-6">
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-bold text-base sm:text-lg text-black">Intelligent</span>
                        <span className="font-semibold text-base sm:text-lg text-neutral-700">Search</span>
                    </Link>
                </div>
                <nav className="flex flex-col space-y-1 sm:space-y-1.5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 sm:gap-3 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-black text-white"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                      )}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      {item.name}
                    </Link>
                  ))}
                  <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 sm:gap-3 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-colors",
                        pathname === "/settings"
                          ? "bg-black text-white"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                      )}
                    >
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                      Settings
                    </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="h-14" /> 
    </>
  );
}

export default FloatingNavbar; 