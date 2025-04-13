"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen } from "lucide-react"

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

export default function AuthorPage() {
  const params = useParams()
  const authorName = decodeURIComponent(params.name as string)

  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)

  useEffect(() => {
    const fetchPoemsByAuthor = async () => {
      try {
        const response = await fetch(`https://poetrydb.org/author/${encodeURIComponent(authorName)}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setPoems(data)
          if (data.length > 0) {
            setSelectedPoem(data[0])
          }
        }
      } catch (error) {
        console.error("Error fetching poems:", error)
      } finally {
        setLoading(false)
      }
    }

    if (authorName) {
      fetchPoemsByAuthor()
    }
  }, [authorName])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Authors
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-2">{authorName}</h1>
          <p className="text-muted-foreground text-lg">
            {loading ? <Skeleton className="h-6 w-48" /> : `${poems.length} poem${poems.length !== 1 ? "s" : ""}`}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - List of Poems */}
          <div className="lg:w-1/3 space-y-4 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Poems
            </h2>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="ghibli-card">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              poems.map((poem) => (
                <motion.div
                  key={poem.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    onClick={() => setSelectedPoem(poem)}
                    className={`transition-all ghibli-card cursor-pointer border-2 ${
                      selectedPoem?.title === poem.title
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-muted"
                    }`}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{poem.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Main Content - Poem Text */}
          <div className="lg:w-2/3">
            {loading ? (
              <Card className="ghibli-card">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : selectedPoem ? (
              <motion.div
                key={selectedPoem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="ghibli-card">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <h2 className="text-3xl font-bold">{selectedPoem.title}</h2>
                    <div className="poem-text space-y-3 leading-relaxed">
                      {selectedPoem.lines.map((line, index) => (
                        <p key={index} className={line.trim() === "" ? "h-6" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="ghibli-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Select a poem to read</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
