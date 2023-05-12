import { useState, useRef, useMemo, useCallback } from "react"
import { searchMovies } from "../services/movies"

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousSearch = useRef({ search })

  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return
    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (el) {
      setError(e.message)
    } finally {
      //esto pasa tanto como termine el catch o el try
      setLoading(false)
    }
  }, [])

  const sortedMovies = useMemo(() => {
    return sort && movies?.length > 0
      ? [...movies].sort((a, b) => a.year.localeCompare(b.year))
      : movies
  }, [movies, sort])

  return {
    movies: sortedMovies,
    getMovies,
    loading,
    error,
  }
}
