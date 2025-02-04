import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { omdbApi } from '../services/omdb';
import MovieGrid from '../components/MovieGrid';
import SearchIcon from '@mui/icons-material/Search';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

// Popular movie backdrop URLs for the hero section
const BACKDROP_URLS = [
  'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg', // Avengers: Endgame
  'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', // Avengers: Infinity War
  'https://image.tmdb.org/t/p/original/8bcoRX3hQRHufLPSDREdvr3YMXx.jpg', // The Dark Knight
];

// Current year for filtering
const currentYear = new Date().getFullYear();

const Home = () => {
  const navigate = useNavigate();
  const backdropUrl = BACKDROP_URLS[Math.floor(Math.random() * BACKDROP_URLS.length)];

  const { data: popularMoviesData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => omdbApi.getPopular(1),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => omdbApi.searchMovies('star wars', 1),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Process popular movies
  const problematicSubstrings = [
    'avengers could never win',
    'return of ultron',
    'halloween special'
  ];

  let popularMoviesList = popularMoviesData?.data?.Search || [];

  const filteredMovies = popularMoviesList.filter((movie: any) => {
    const titleLower = movie.Title.toLowerCase();
    return !problematicSubstrings.some(problem => titleLower.includes(problem));
  });

  // If problematic movies were filtered out, append 3 alternative movies
  if (filteredMovies.length < popularMoviesList.length) {
    const alternativeMovies = [
      {
        imdbID: 'tt4154756',
        Title: 'Avengers: Infinity War',
        Poster: `https://img.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=tt4154756`,
        Year: '2018',
        Type: 'movie'
      },
      {
        imdbID: 'tt4154796',
        Title: 'Avengers: Endgame',
        Poster: `https://img.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=tt4154796`,
        Year: '2019',
        Type: 'movie'
      },
      {
        imdbID: 'tt2395427',
        Title: 'Avengers: Age of Ultron',
        Poster: `https://img.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=tt2395427`,
        Year: '2015',
        Type: 'movie'
      }
    ];
    popularMoviesList = [...filteredMovies, ...alternativeMovies];
  } else {
    popularMoviesList = filteredMovies;
  }

  const handleNavigateToMovies = () => {
    navigate('/movies');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            color="white"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Discover Your Next Favorite Movie
          </Typography>
          <Typography variant="h5" color="white" sx={{ mb: 4, maxWidth: '600px' }}>
            Explore thousands of movies, from classics to the latest releases. Start your cinematic journey today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/search')}
              sx={{ px: 4 }}
            >
              Search Movies
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LocalMoviesIcon />}
              onClick={handleNavigateToMovies}
              sx={{ px: 4, color: 'white', borderColor: 'white' }}
            >
              Browse All
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular Movies Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Popular Movies
          </Typography>
          <MovieGrid
            movies={popularMoviesList}
            isLoading={isLoadingPopular}
            error={null}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleNavigateToMovies}
              sx={{ px: 4 }}
            >
              View All Popular Movies
            </Button>
          </Box>
        </Box>

        {/* Top Rated Movies Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Top Rated Movies
          </Typography>
          <MovieGrid
            movies={topRatedMovies?.data?.Search || []}
            isLoading={isLoadingTopRated}
            error={null}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleNavigateToMovies}
              sx={{ px: 4 }}
            >
              View All Top Rated Movies
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 