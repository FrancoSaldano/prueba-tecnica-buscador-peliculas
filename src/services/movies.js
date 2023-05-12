const API_KEY = "daf707b6"

export const searchMovies = async ({ search }) => {
  if (search === "") return null
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
    )
    const json = await response.json()
    const movies = json.Search

    return movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }))
    //mapear movies es una buena práctica, porque mantener las variables directamente
    //nombradas como la api nos ata a ella y en términos de que esta cambie
    //va ser muy costoso cambiar todo de nuevo, más todavía si el componente está
    //muy profundo.
  } catch (e) {
    throw new Error("Error searching error")
  }
}
