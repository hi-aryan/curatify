"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  onNavigateToAbout: () => void;
}

export function MobileMenu({ onNavigateToAbout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleAboutClick = () => {
    onNavigateToAbout();
    closeMenu();
  };

  return (
    <>
      {/* Hamburger/Close Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex items-center gap-2 rounded-full border border-green/50 text-green bg-transparent hover:bg-green/10 px-3 py-2 transition-colors relative z-[60]"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="text-sm font-medium">Close</span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="text-sm font-medium">Menu</span>
          </>
        )}
      </button>

      {/* Full-Screen Overlay Menu (below navbar) */}
      <div
        className={cn(
          "fixed top-[72px] left-0 right-0 bottom-0 bg-dark/95 backdrop-blur-md z-40 lg:hidden transition-all duration-300 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
            <button
              onClick={handleAboutClick}
              className="w-full text-left text-2xl font-semibold text-light hover:text-green hover:translate-x-2 transition-all py-4 border-b border-light/10"
            >
              About
            </button>
            <button
              onClick={closeMenu}
              className="w-full text-left text-2xl font-semibold text-light hover:text-green hover:translate-x-2 transition-all py-4 border-b border-light/10"
            >
              Features
            </button>
            <button
              onClick={closeMenu}
              className="w-full text-left text-2xl font-semibold text-light hover:text-green hover:translate-x-2 transition-all py-4 border-b border-light/10"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
