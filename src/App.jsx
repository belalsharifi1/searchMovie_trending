import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spainer";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

export default function App() {
  const [SearchTerm, SetSearchTerm] = useState('');
  const [ErrorMassage, SetErrorMassage] = useState('');
  const [MovieList, SetMovieList] = useState([]);
  const [TrendingMovies, SetTrendingMovies] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const [DebounceSearchTerm, SetDebounceSearchTerm] = useState('');

  const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }

}
  useDebounce(() => SetDebounceSearchTerm(SearchTerm), 500, [SearchTerm]);



  async function FetchMovies( query = '') {
    SetLoading(true)
    try {
      const Endpoint =query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const Response = await fetch(Endpoint, API_OPTIONS);
      const data = await Response.json();

      if (data.Response === 'False') {
        SetErrorMassage(data.Error || 'failed to fetch movie')
        SetMovieList([]);
        return;
      }
      SetMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (err) {
      console.error(`Error fetch your movie:${err}`);
      SetErrorMassage('Error fetch your movies:please try again later ')
    } finally {
      SetLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      SetTrendingMovies(movies);
    } catch (err) {
      console.error(`Error fetching trending movies: ${err}`);
    }
  }
    useEffect(() => {
      FetchMovies(DebounceSearchTerm);
    }, [DebounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="hero banner" />
            <h1>find your <span className="text-gradient">movies </span>and your happy</h1>
            <Search SearchTerm={SearchTerm} SetSearchTerm={SetSearchTerm} />
          </header>
          {TrendingMovies.length > 0 && (
            <section className="trending">
              <h2 className="">Trending Movies</h2>
              <ul>
                {TrendingMovies.map((movie, index) => (

                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2 className="">All Movies</h2>
            {Loading ? (
              <Spinner/>
            ) : ErrorMassage ?(
                <p className="text-red-500">{ErrorMassage}</p>
              ) : (
                  <ul>
                    {MovieList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

















