import Link from "next/link"
import { Github, Heart, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-md py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg font-pt-sans">Poetic Whispers</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive" /> by SRF and inspired by <a href="https://matsu-theme.vercel.app/" target="_blank" className="underline hover:text-primary">Matsu Theme - Studio Ghibli </a>
          </p>
          <p className="mt-2">
            Using{" "}
            <Link
              href="https://poetrydb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              PoetryDB API
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
