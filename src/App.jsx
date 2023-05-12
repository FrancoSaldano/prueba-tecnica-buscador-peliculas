import './App.css'
import { useRef, useEffect, useState, useCallback } from 'react'
//crea referencia mutable que persiste en el ciclo de vida del componente
//una variable por ejemplo se crea y destruye entre renderizados.
//esto no pasa con useRef
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const firstInput = useRef(true)

  useEffect(() => {
    if (firstInput.current) {
      firstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('No se encuentra la película vacía')
      return
    }
    if (search.startsWith(' ')) {
      updateSearch('')
      return
    }
    if (search.match(/^\+d$/)) {
      setError('La búsqueda no puede empezar con un número')
      return
    }
    if (search.length <= 1) {
      setError('La búsqueda tiene que tener más de un caracteres')
      return
    }
    setError(null)
  }, [search])

  return { search, updateSearch, error }
}


function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })
  const inputRef = useRef()
  //FORMA CONTROLADA


  const debouncedGetMovies = useCallback(
    debounce(({ search }) => {
      getMovies({ search })
    }, 300), [getMovies])
  //como el cuerpo de la función se ejecuta con cada render 
  //y cada render se ejecuta porque estamos cambiando el search, el debounce
  //hace efecto del delay por asi decirlo pero en  cada render con el valor del search
  //entonces estamos como en la misma. Necesitamos que la función sea la misma
  //entre renders , por lo tanto usamos useCallback.
  // 300 ms de debounce esta bien
  const handleSort = () => {
    setSort(!sort)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    //const value = inputRef.current.value
    // const {query} = Objet.fromEntries(new window.FormData(event.target))
    //  FORMA NO CONTROLADA = depende del DOM
    getMovies({ search })
  }
  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies({ search: newSearch })
  }


  return (
    <div className='page'>
      <header>
        <h1>App de películas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input ref={inputRef} onChange={handleChange} value={search} name='search' type="text" placeholder='Avenger: Endgame, Titanic, Star Wars...' />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {loading ? <p>Cargando...</p> :
          <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
