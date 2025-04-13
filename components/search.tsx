"use client"

import { useState, useEffect, useRef } from "react"
import { SearchIcon, X, Loader2, BookOpen, User, AlignLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authors } from "@/data/authors" // Import authors data

interface SearchResult {
  author?: string
  title?: string
  lines?: string[]
  linecount?: number
  poems?: string[] // Added poems property
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<"author" | "title" | "lines">("author")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle search
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length < 2) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        if (searchType === "author") {
          // Perform local search for authors
          const filteredAuthors = authors
            .filter((author) =>
              author.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5) // Limit to 5 results

          const authorResults = filteredAuthors.map((author) => ({
            author,
            poems: [], // Placeholder for poems
          }))

          setResults(authorResults)
        } else {
          // Perform API search for title or lines
          let endpoint = ""
          let fields = ""

          switch (searchType) {
            case "title":
              endpoint = `https://poetrydb.org/title/${encodeURIComponent(query)}:abs`
              fields = "/author,title"
              break
            case "lines":
              endpoint = `https://poetrydb.org/lines/${encodeURIComponent(query)}:abs`
              fields = "/author,title,lines"
              break
          }

          fetch(endpoint + fields)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch search results")
              }
              return response.json()
            })
            .then((data) => {
              if (Array.isArray(data)) {
                setResults(data.slice(0, 5)) // Limit to 5 results
              } else {
                setResults([])
              }
            })
            .catch((err) => {
              console.error("Search error:", err)
              setError("Something went wrong with the search. Please try again.")
              setResults([])
            })
        }
      } catch (err) {
        console.error("Search error:", err)
        setError("Something went wrong with the search. Please try again.")
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(searchTimeout)
  }, [query, searchType])

  const handleSearchToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }

  const handleResultSelect = (result: SearchResult) => {
    if (searchType === "author" && result.author) {
      router.push(`/author/${encodeURIComponent(result.author)}`)
    } else if (result.author && result.title) {
      router.push(`/poem/${encodeURIComponent(result.author)}/${encodeURIComponent(result.title)}`)
    }
    setIsOpen(false)
    setQuery("")
  }

  const handleFullSearch = () => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`)
    setIsOpen(false)
  }

  return (
    <div className="relative z-50" ref={searchRef}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-10 w-10"
        onClick={handleSearchToggle}
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        {isOpen ? <X size={20} /> : <SearchIcon size={20} />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg overflow-hidden border border-border ghibli-card"
          >
            <div className="bg-white p-3 border-b border-border/50">
              <Tabs defaultValue="author" className="w-full" onValueChange={(value) => setSearchType(value as any)}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="author" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    Author
                  </TabsTrigger>
                  <TabsTrigger value="title" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Title
                  </TabsTrigger>
                  <TabsTrigger value="lines" className="text-xs">
                    <AlignLeft className="h-3 w-3 mr-1" />
                    Content
                  </TabsTrigger>
                </TabsList>

                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={`Search by ${searchType}...`}
                    className="pl-9 pr-4 py-2 w-full bg-background/50"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query.length >= 2) {
                        handleFullSearch()
                      }
                    }}
                  />
                </div>
              </Tabs>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="bg-white flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              ) : error ? (
                <div className="bg-white p-4 text-sm text-destructive">{error}</div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((result, index) => (
                    <motion.li
                      key={`${result.author || ""}-${result.title || ""}-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border-b border-border/50 last:border-0"
                    >
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors"
                        onClick={() => handleResultSelect(result)}
                      >
                        {searchType === "author" && result.author ? (
                          <div className="flex items-start gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                              {result.author.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{result.author}</p>
                              {result.poems && result.poems.length > 0 ? (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {result.poems.slice(0, 2).map((poem, i) => (
                                    <p key={i} className="truncate">
                                      {poem}
                                    </p>
                                  ))}
                                  {result.poems.length > 2 && <p>+ {result.poems.length - 2} more poems</p>}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">Poet</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white flex items-start gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                              {searchType === "title" && result.title ? result.title.charAt(0) : "A"}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">by {result.author || "Unknown"}</p>
                            </div>
                          </div>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : query.length > 1 ? (
                <div className="bg-white p-4 text-center text-sm text-muted-foreground">
                  <p>No results found</p>
                  <p className="mt-1 text-xs">Try a different search term</p>
                </div>
              ) : (
                <div className="bg-white p-4 text-center text-sm text-muted-foreground">
                  <p>Type at least 2 characters to search</p>
                  <p className="mt-1 text-xs">
                    {searchType === "author"
                      ? 'Try "Shakespeare" or "Frost"'
                      : searchType === "title"
                        ? 'Try "Ozymandias" or "Hope"'
                        : 'Try "love" or "dream"'}
                  </p>
                </div>
              )}
            </div>

            {query.length >= 2 && (
              <div className="bg-white p-2 border-t border-border/50">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleFullSearch}
                  disabled={loading}
                >
                  <SearchIcon className="h-3 w-3 mr-1" />
                  View all results
                </Button>
              </div>
            )}

            <div className="bg-white p-2 border-t border-border/50 bg-muted/30 text-xs text-center text-muted-foreground">
              Powered by PoetryDB
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
