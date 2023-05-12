export function ListOfMovies({ movies }) {
  return (
    <ul className='grid-responsive'>
      {movies.map(el =>
        <li key={el.id}>
          <img src={el.poster} alt={el.title} />
          <span>
            <h4>{el.title}</h4>
            <p>{el.year}</p>
          </span>
        </li>
      )}
    </ul>
  )
}
export function NoMoviesResult() {

  return (
    <h3>No se ha encontrado resultados para tu búsqueda</h3>
  )
}
export function Movies({ movies }) {
  const hasMovies = movies?.length > 0

  return (
    hasMovies ?
      <ListOfMovies movies={movies} /> :
      <NoMoviesResult />
  )
}
// retornamos de forma condicional