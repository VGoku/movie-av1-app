import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_OMDB_API_KEY;
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`);
        const data = await response.json();
        if (data.Response === "False") {
          setError(data.Error);
        } else {
          setMovie(data);
        }
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ marginTop: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardMedia
          component="img"
          sx={{ width: { md: 300 }, objectFit: 'cover' }}
          image={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.svg'}
          alt={movie.Title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {movie.Title} ({movie.Year})
          </Typography>
          <Typography variant="body1" paragraph><strong>Genre: </strong>{movie.Genre}</Typography>
          <Typography variant="body1" paragraph><strong>Director: </strong>{movie.Director}</Typography>
          <Typography variant="body1" paragraph><strong>Actors: </strong>{movie.Actors}</Typography>
          <Typography variant="body1" paragraph><strong>Plot: </strong>{movie.Plot}</Typography>
          <Typography variant="body1" paragraph><strong>Runtime: </strong>{movie.Runtime}</Typography>
          <Typography variant="body1" paragraph><strong>IMDB Rating: </strong>{movie.imdbRating}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MovieDetail; 