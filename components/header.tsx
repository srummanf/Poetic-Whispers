"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import Search from "@/components/search";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSurpriseMe = async () => {
    try {
      const response = await fetch("https://poetrydb.org/random");
      if (!response.ok) {
        throw new Error("Failed to fetch random poem");
      }
      const data = await response.json();
      const randomPoem = data[0];

      // Redirect to the surprise page with the poem data
      router.push(
        `/surprise?title=${encodeURIComponent(randomPoem.title)}&author=${encodeURIComponent(
          randomPoem.author
        )}&lines=${encodeURIComponent(randomPoem.lines.join("\n"))}`
      );
    } catch (err) {
      console.error("Error fetching random poem:", err);
    }
  };

  return (
    <header className="bg-white/50 sticky top-0 z-50 w-full backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 ">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 5,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 6.5C12 6.5 10 4 7 4C4 4 2 6 2 9C2 12 4 14 7 14C10 14 12 11.5 12 11.5M12 6.5C12 6.5 14 4 17 4C20 4 22 6 22 9C22 12 20 14 17 14C14 14 12 11.5 12 11.5M12 6.5V11.5M12 11.5V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="font-bold text-lg font-pt-sans">
            Poetic Whispers
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Search />
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSurpriseMe}
            >
              Surprise Me
            </Button>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <Search />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/40 bg-background"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
