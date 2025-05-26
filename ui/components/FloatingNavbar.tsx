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
		<>			<header
				className={cn(
					"fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-md shadow-lg",
					className
				)}
			>				<div className="flex h-12 items-center w-full max-w-2xl px-6">
					{/* Left: Brand Logo */}					<Link
						href="/"
						className="flex items-center space-x-2 select-none flex-shrink-0"
					>						<span
							className="font-semibold text-xl select-none lowercase font-sans"
							style={{ fontFamily: 'Inter, var(--font-sans), Segoe UI, Arial, sans-serif', letterSpacing: '0.01em', color: 'inherit' }}
						>
							<span className="font-normal">intelli</span>
							<span className="font-bold">search</span>
						</span>
					</Link>{/* Center: Navigation - Flex grow to take remaining space */}
					<nav className="hidden md:flex items-center justify-center flex-1 mx-8">
						<div className="flex items-center gap-8">						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
									pathname === item.href
										? "bg-black text-white shadow-sm"
										: "text-gray-600 hover:bg-gray-100 hover:text-black"
								)}
							>
								{item.name}
							</Link>
						))}
						</div>
					</nav>

					{/* Right: Settings */}
					<div className="flex items-center flex-shrink-0">
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="hidden md:inline-flex text-gray-600 hover:text-black hover:bg-gray-100 rounded-md h-8 w-8"
						>
							<Link href="/settings">
								<Settings className="h-4 w-4" />
							</Link>
						</Button>

						{/* Mobile Menu */}
						<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<SheetTrigger asChild className="md:hidden">
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-md h-8 w-8"
								>
									{isMobileMenuOpen ? (
										<X className="h-4 w-4" />
									) : (
										<Menu className="h-4 w-4" />
									)}
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-full max-w-xs bg-white p-6"
							>
								<div className="mb-4 flex items-center justify-between">									<Link
										href="/"
										className="flex items-center space-x-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<span className="font-bold text-lg select-none">
											<span className="font-normal">intelli</span>
											<span className="font-bold">search</span>
										</span>
									</Link>
								</div>
								<nav className="flex flex-col space-y-2">									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											onClick={() => setIsMobileMenuOpen(false)}
											className={cn(
												"flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
												pathname === item.href
													? "bg-black text-white"
													: "text-gray-700 hover:bg-gray-100 hover:text-black"
											)}
										>
											<item.icon className="h-5 w-5" />
											{item.name}
										</Link>
									))}									<Link
										href="/settings"
										onClick={() => setIsMobileMenuOpen(false)}
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
											pathname === "/settings"
												? "bg-black text-white"
												: "text-gray-700 hover:bg-gray-100 hover:text-black"
										)}
									>
										<Settings className="h-5 w-5" />
										Settings
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
			<div className="h-12" />
		</>
	);
}

export default FloatingNavbar;