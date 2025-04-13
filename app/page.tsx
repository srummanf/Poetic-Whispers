"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

interface Author {
  name: string;
}

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize the router

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

  const handleCardClick = (authorName: string) => {
    // Redirect to the author's page
    router.push(`/author/${encodeURIComponent(authorName)}`);
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("https://poetrydb.org/author");
        const data = await response.json();

        if (data && data.authors) {
          const formattedAuthors = data.authors.map((name: string) => ({
            name,
          }));
          setAuthors(formattedAuthors);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div
      className="min-h-screen ghibli-container"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-16" id="poems">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Poetic Whispers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A collection of poems inspired by the magical world of Studio Ghibli
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading
            ? // Loading skeletons
              Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            : authors.map((author, index) => (
                <motion.div
                  key={author.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.95, y: 10 }} // Push-down animation
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(author.name)} // Redirect after animation
                >
                  <Card className="cursor-pointer">
                    <CardContent className="p-6 flex flex-col h-full">
                      <h2 className="text-xl font-bold mb-2 author-name">
                        {author.name}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-auto">
                        Explore poems
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
