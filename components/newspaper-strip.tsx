import Image from "next/image";
import { cn } from "@/lib/utils";

interface NewspaperStripProps {
  specialText?: string;
  mainTitle: string;
  dailyText?: string;
  publisherInfo?: string;
  articleTitle?: string;
  date?: string;
  headline: string;
  imageUrl?: string;
  imageAlt?: string;
  quote?: string;
  columns: string[];
  volumeInfo?: string;
  issueCode?: string;
  issueDate?: string;
  className?: string;
}

export function NewspaperStrip({
  specialText = "SPECIAL EDITION",
  mainTitle,
  dailyText = "DAILY REPORT",
  publisherInfo = "",
  articleTitle = "",
  date = "",
  headline,
  imageUrl,
  imageAlt = "Featured image",
  quote = "",
  columns,
  volumeInfo = "VOL. 1... NO.1",
  issueCode = "",
  issueDate = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase(),
  className,
}: NewspaperStripProps) {
  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto border border-black bg-[#fffdf7]",
        className
      )}
    >
      {/* Main Header */}
      <div className="flex justify-between font-serif items-center border-b border-black p-3">
        <div className="text-xs sm:text-sm font-serif uppercase tracking-wide">
          {specialText}
        </div>
        <div className="text-xl sm:text-3xl md:text-4xl font-black italic tracking-tight text-center">
          {mainTitle}
        </div>
        <div className="text-xs sm:text-sm font-serif uppercase tracking-wide">
          {dailyText}
        </div>
      </div>

      {/* Subheader */}
      {(publisherInfo || articleTitle || date) && (
        <div className="flex justify-between items-center border-b border-black p-2 text-xs">
          <div className="font-serif uppercase tracking-wide">
            {publisherInfo}
          </div>
          <div className="font-serif uppercase tracking-wide text-center">
            {articleTitle}
          </div>
          <div className="font-serif uppercase tracking-wide">{date}</div>
        </div>
      )}

      {/* Headline */}
      <div className="border-b border-black p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-center tracking-wide uppercase">
          {headline}
        </h1>
      </div>

      {/* Image Section */}
      {imageUrl && (
        <div className="border-b border-black p-4 flex justify-center">
          <div className="relative w-full max-w-2xl aspect-[4/3]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={imageAlt}
              fill
              className="object-cover grayscale"
            />
          </div>
        </div>
      )}

      {/* Quote */}
      {quote && (
        <div className="border-b border-black p-4 text-center">
          <p className="font-serif font-bold text-lg sm:text-xl">"{quote}"</p>
        </div>
      )}

      {/* Content Columns */}
<div
  className={`grid grid-cols-1 sm:grid-cols-${Math.min(
    columns.length,
    3
  )} border-b border-black`}
>
  {columns.map((column, index) => (
    <div
      key={index}
      className={cn(
        "p-6 font-serif text-base sm:text-lg leading-relaxed text-center",
        index !== columns.length - 1 && "sm:border-r border-black"
      )}
    >
      {typeof column === "string"
        ? column.split("\n").map((line, i) => (
            <p key={i} className="mb-3">
              {line}
            </p>
          ))
        : column}
    </div>
  ))}
</div>


      {/* Footer */}
      <div className="flex justify-between items-center p-2 text-xs">
        <div className="font-serif uppercase">{volumeInfo}</div>
        <div className="font-serif uppercase">{issueCode}</div>
        <div className="font-serif uppercase">{issueDate}</div>
      </div>
    </div>
  );
}
