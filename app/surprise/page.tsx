"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import { NewspaperStrip } from "@/components/newspaper-strip";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";

export default function SurprisePage() {
  const [poem, setPoem] = useState<{
    title: string;
    author: string;
    lines: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("/images/ghibli-bg-1.jpg");
  const router = useRouter();

  // Sample lyrics content for the columns
  const lyricsColumns = [
    "I want you to stay. 'Til I'm in the grave. 'Til I'm far away, dead and buried. 'Til I'm in the casket you carry. If you go, I'm going too (uh). 'Cause it was always you, alright. And if I'm turning blue, please don't save me. Nothing left to lose without my baby. Birds of a feather, we should stick together, I know. I said I'd never think I wasn't better alone.",
    "I don't think I could love you more. It might not be long, but baby, I. I'll love you 'til the day that I die. 'Til the day that I die. 'Til the light leaves my eyes. 'Til the day that I die. I want you to see (hm) How you look. You wouldn't believe if I told ya. You would keep the compliments I throw ya. But you're so full of shit (uh). Tell me it's a bit (oh)",
    "I don't think I could love you more. Might not be long, but baby, I. Don't wanna say goodbye. Birds of a feather, we should stick together, I know ('til the day that I die) I said I'd never think I wasn't better alone ('til the light leaves my eyes) Can't change the weather, might not be forever ('til the day that I die) But if it's forever, it's even better. I knew you in another life. You had that same look in your eyes.",
    "I want you to stay. 'Til I'm in the grave. 'Til I'm far away, dead and buried. 'Til I'm in the casket you carry. If you go, I'm going too (uh). 'Cause it was always you, alright. And if I'm turning blue, please don't save me. Nothing left to lose without my baby. Birds of a feather, we should stick together, I know. I said I'd never think I wasn't better alone.",
    "I don't think I could love you more. It might not be long, but baby, I. I'll love you 'til the day that I die. 'Til the day that I die. 'Til the light leaves my eyes. 'Til the day that I die. I want you to see (hm) How you look. You wouldn't believe if I told ya. You would keep the compliments I throw ya. But you're so full of shit (uh). Tell me it's a bit (oh)",
    "I don't think I could love you more. Might not be long, but baby, I. Don't wanna say goodbye. Birds of a feather, we should stick together, I know ('til the day that I die) I said I'd never think I wasn't better alone ('til the light leaves my eyes) Can't change the weather, might not be forever ('til the day that I die) But if it's forever, it's even better. I knew you in another life. You had that same look in your eyes.",
  ];

  const fetchRandomPoem = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://poetrydb.org/random");
      if (!response.ok) {
        throw new Error("Failed to fetch random poem");
      }
      const data = await response.json();
      setPoem(data[0]);
      // Set random image from 1 to 7
      const randomNum = Math.floor(Math.random() * 7) + 1;
      setImageUrl(`/images/ghibli-bg-${randomNum}.jpg`);
    } catch (err) {
      console.error("Error fetching random poem:", err);
      setError("Failed to fetch a random poem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!poem && !loading && !error) {
      fetchRandomPoem();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <div className="container mx-auto px-4 py-10 flex-grow space-y-10">
        {/* Enhanced Button Container */}
        <div className="max-w-xl mx-auto">
          <div className=" rounded-lg p-6 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
            <Button
              variant="default"
              onClick={fetchRandomPoem}
              className="px-6 py-2 text-sm sm:text-base shadow hover:shadow-lg transition-all duration-200"
            >
              ✨ Another Verse
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm sm:text-base shadow hover:shadow-lg transition-all duration-200"
            >
              ← Return
            </Button>
          </div>
        </div>

        {/* Newspaper Strip Display */}
        <div className="max-w-4xl mx-auto">
          <NewspaperStrip
            mainTitle={poem?.author || "Unknown Author"}
            publisherInfo="POETRY DB API"
            articleTitle={poem?.title || "Untitled"}
            date={new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            headline={poem?.title || "Loading..."}
            imageUrl={imageUrl}
            quote="THE DAILY VERSE"
            columns={poem ? [poem.lines.join("\n")] : lyricsColumns}
            volumeInfo="VOL. 1... NO.1"
            issueCode="POEM-X1"
            issueDate={new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />
        </div>
        {/* Enhanced Button Container */}
        <div className="max-w-xl mx-auto">
          <div className=" rounded-lg p-6 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
            <Button
              variant="default"
              onClick={fetchRandomPoem}
              className="px-6 py-2 text-sm sm:text-base shadow hover:shadow-lg transition-all duration-200"
            >
              ✨ Another Verse
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm sm:text-base shadow hover:shadow-lg transition-all duration-200"
            >
              ← Return
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
