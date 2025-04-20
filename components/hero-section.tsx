"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-b from-background via-muted to-background">
      {/* Left side content */}
      <div className="w-full lg:w-1/2 flex items-center order-2 lg:order-1 px-8 py-12 lg:py-0">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm text-primary font-medium tracking-wide uppercase">
              Where Classics Come to Life.
            </h2>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Poetic <span className="text-primary">Whispers</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Celebrate the enduring magic of the greatest poets in history.
            Timeless Verses brings together the masterpieces of literary icons
            like Shakespeare, Edward Thomas, and more, offering a curated
            sanctuary for those who cherish the elegance of words that have
            stood the test of time. Immerse yourself in a treasure trove of
            poetic brilliance, preserved for generations.
          </p>
          <div className="flex items-center gap-6 pt-6">
            <Button className="gap-2 px-8 py-4 text-lg rounded-full bg-primary text-background hover:bg-primary/90 transition-all">
              <a href="#poems" onClick={(e) => handleSmoothScroll(e, "poems")}>
                View poems
              </a>
              <ArrowRight size={20} />
            </Button>
            {/* <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer hover:bg-muted transition-all"
                >
                  <Github size={24} />
                </Button>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer hover:bg-muted transition-all"
                >
                  <Linkedin size={24} />
                </Button>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer hover:bg-muted transition-all"
                >
                  <Twitter size={24} />
                </Button>
              </a>
            </div> */}
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen order-1 lg:order-2 relative">
        <Image
          src="/images/ghibli-bg-3.jpg"
          alt="Debsourya Datta"
          fill
          priority
          className="object-cover brightness-90 hover:brightness-100 transition-all"
        />
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
        <a
          href="#about"
          onClick={(e) => handleSmoothScroll(e, "about")}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
