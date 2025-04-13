"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, SearchIcon, User, AlignLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface SearchResult {
  title: string
  author: string
  lines?: string[]
  linecount: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const type = (searchParams.get("type") as "author" | "title" | "lines") || "author"

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(query)
  const [searchType, setSearchType] = useState<"author" | "title" | "lines">(type)

  useEffect(() => {
    if (!query) return

    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        let endpoint = ""

        switch (type) {
          case "author":
            endpoint = `https://poetrydb.org/author/${encodeURIComponent(query)}:abs`
            break
          case "title":
            endpoint = `https://poetrydb.org/title/${encodeURIComponent(query)}:abs`
            break
          case "lines":
            endpoint = `https://poetrydb.org/lines/${encodeURIComponent(query)}:abs`
            break
          default:
            endpoint = `https://poetrydb.org/author/${encodeURIComponent(query)}:abs`
        }

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()

        if (Array.isArray(data)) {
          setResults(data)
        } else if (data.status === 404) {
          setResults([])
        } else {
          throw new Error("Unexpected response format")
        }
      } catch (err) {
        console.error("Search error:", err)
        setError("Something went wrong with the search. Please try again.")
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, type])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search query and type
    router.push(`/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`)
  }

  const handleTypeChange = (value: string) => {
    setSearchType(value as "author" | "title" | "lines")
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}&type=${value}`)
    }
  }

  // Group results by author
  const resultsByAuthor = results.reduce(
    (acc, poem) => {
      if (!acc[poem.author]) {
        acc[poem.author] = []
      }
      acc[poem.author].push(poem)
      return acc
    },
    {} as Record<string, SearchResult[]>,
  )

  // For lines search, highlight matching lines
  const highlightMatchingLines = (lines: string[] = [], query: string) => {
    const lowerQuery = query.toLowerCase()
    return lines.map((line) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        const index = line.toLowerCase().indexOf(lowerQuery)
        const before = line.substring(0, index)
        const match = line.substring(index, index + query.length)
        const after = line.substring(index + query.length)
        return (
          <>
            {before}
            <span className="bg-primary/20 text-foreground font-medium px-1 rounded">{match}</span>
            {after}
          </>
        )
      }
      return line
    })
  }

  return (
    <div className="min-h-screen ghibli-container" style={{ backgroundColor: "var(--background)" }}>
      <Header />

      <main className="container mx-auto px-4 py-16 pt-24">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Search Poems</h1>

          <form onSubmit={handleSearch} className="space-y-4 max-w-2xl">
            <Tabs defaultValue={searchType} onValueChange={handleTypeChange} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="author" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Author</span>
                </TabsTrigger>
                <TabsTrigger value="title" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Title</span>
                </TabsTrigger>
                <TabsTrigger value="lines" className="flex items-center gap-1">
                  <AlignLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search by ${searchType}...`}
                  className="pl-9 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="ghibli-card overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-24 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="ghibli-card">
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <div className="space-y-10">
            {type === "lines" ? (
              // Special display for lines search
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="ghibli-card overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <AlignLeft className="h-5 w-5 text-primary" />
                      Lines containing "{query}"
                    </h2>

                    <div className="space-y-8">
                      {results.map((poem, index) => (
                        <div
                          key={`${poem.author}-${poem.title}-${index}`}
                          className="border-t border-border/30 pt-4 first:border-0 first:pt-0"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-bold text-lg">
                              <Link
                                href={`/poem/${encodeURIComponent(poem.author)}/${encodeURIComponent(poem.title)}`}
                                className="hover:text-primary transition-colors"
                              >
                                {poem.title}
                              </Link>
                            </h3>
                            <span className="text-sm text-muted-foreground">by {poem.author}</span>
                          </div>

                          <div className="bg-background/50 rounded-md p-4 poem-text text-sm">
                            {poem.lines &&
                            poem.lines.some((line) => line.toLowerCase().includes(query.toLowerCase())) ? (
                              <div className="space-y-2">
                                {poem.lines
                                  .filter((line) => line.toLowerCase().includes(query.toLowerCase()))
                                  .slice(0, 3)
                                  .map((line, i) => {
                                    // Get context: lines before and after the matching line
                                    const lineIndex = poem.lines?.indexOf(line) || 0
                                    const contextLines = []

                                    // Add line before if it exists
                                    if (lineIndex > 0 && poem.lines) {
                                      contextLines.push(
                                        <p key={`${i}-before`} className="text-muted-foreground">
                                          {poem.lines[lineIndex - 1]}
                                        </p>,
                                      )
                                    }

                                    // Add the matching line with highlighted term
                                    contextLines.push(
  highlightMatchingLines([line], query).map((linePart, idx) => (
    <p key={idx} className="leading-relaxed font-medium">
      {linePart}
    </p>
  ))
)



                                    // Add line after if it exists
                                    if (lineIndex < (poem.lines?.length || 0) - 1 && poem.lines) {
                                      contextLines.push(
                                        <p key={`${i}-after`} className="text-muted-foreground">
                                          {poem.lines[lineIndex + 1]}
                                        </p>,
                                      )
                                    }

                                    return (
                                      <div key={`context-${i}`} className="border-l-2 border-primary/30 pl-3 py-1">
                                        {contextLines}
                                      </div>
                                    )
                                  })}
                                {poem.lines.filter((line) => line.toLowerCase().includes(query.toLowerCase())).length >
                                  3 && (
                                  <div className="text-xs text-muted-foreground mt-2 text-right">
                                    <Link
                                      href={`/poem/${encodeURIComponent(poem.author)}/${encodeURIComponent(poem.title)}`}
                                      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                      {poem.lines.filter((line) => line.toLowerCase().includes(query.toLowerCase()))
                                        .length - 3}{" "}
                                      more matching lines
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No preview available</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              // Author/title grouped display
              Object.entries(resultsByAuthor).map(([author, poems]) => (
                <motion.div
                  key={author}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="ghibli-card overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          {author.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-bold">
                          <Link
                            href={`/author/${encodeURIComponent(author)}`}
                            className="hover:text-primary transition-colors"
                          >
                            {author}
                          </Link>
                        </h2>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {poems.length} poem{poems.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {poems.slice(0, 6).map((poem) => (
                          <Link key={poem.title} href={`/author/${encodeURIComponent(author)}`} className="block">
                            <div className="border border-border/50 rounded-md p-4 hover:border-primary/50 hover:bg-accent/30 transition-colors h-full">
                              <div className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <div>
                                  <h3 className="font-medium line-clamp-2">{poem.title}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">{poem.linecount} lines</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {poems.length > 6 && (
                        <div className="mt-4 text-center">
                          <Link href={`/author/${encodeURIComponent(author)}`}>
                            <Button variant="outline" size="sm">
                              View all {poems.length} poems
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        ) : query ? (
          <Card className="ghibli-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <p className="mt-2 text-sm">
                {type === "author"
                  ? "Try searching for a different poet or check your spelling"
                  : type === "title"
                    ? "Try searching for a different poem title or check your spelling"
                    : "Try searching for different words or phrases"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="ghibli-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Enter a search term to find poems</p>
              <p className="mt-2 text-sm">
                {type === "author"
                  ? 'Try searching for poets like "Shakespeare" or "Frost"'
                  : type === "title"
                    ? 'Try searching for titles like "Ozymandias" or "Hope"'
                    : 'Try searching for words or phrases like "love" or "dream"'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
