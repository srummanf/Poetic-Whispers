"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, User, BookOpen, Feather } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Poem {
  title: string
  author: string
  lines: string[]
  linecount: string
}

export default function PoemPage() {
  const params = useParams()
  const authorName = decodeURIComponent(params.author as string)
  const poemTitle = decodeURIComponent(params.title as string)

  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const response = await fetch(
          `https://poetrydb.org/author,title/${encodeURIComponent(authorName)};${encodeURIComponent(poemTitle)}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch poem")
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          setPoem(data[0])
        } else {
          throw new Error("Poem not found")
        }
      } catch (err) {
        console.error("Error fetching poem:", err)
        setError("Could not load the poem. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (authorName && poemTitle) {
      fetchPoem()
    }
  }, [authorName, poemTitle])

  return (
    <div className="min-h-screen ghibli-container" style={{ backgroundColor: "var(--background)" }}>
      <Header />

      {/* Decorative elements */}
      

      <main className="container mx-auto px-4 py-16 pt-24" >
        <div className="mb-8">
          <Link href={`/author/${encodeURIComponent(authorName)}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {authorName}
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="ghibli-card">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 mt-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="ghibli-card">
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : poem ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="ghibli-card max-w-3xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <Link
                      href={`/author/${encodeURIComponent(poem.author)}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {poem.author}
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold">{poem.title}</h1>
                  </div>
                </div>

                <div className="poem-text space-y-4 mt-8">
                  {poem.lines.map((line, index) => (
                    <p key={index} className={line.trim() === "" ? "h-6" : ""}>
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-border/30 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{poem.linecount} lines</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="ghibli-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Poem not found</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
