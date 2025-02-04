import { Grid } from '@mui/material';
import MovieCard from './MovieCard';
import MovieSkeleton from './MovieSkeleton';
import ErrorMessage from './ErrorMessage';

interface Movie {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Type: string;
}

interface MovieGridProps {
    movies: Movie[];
    loading?: boolean;
    error?: Error | null;
    onRetry?: () => void;
}

const MovieGrid = ({ movies, loading = false, error = null, onRetry }: MovieGridProps) => {
    if (error) {
        return <ErrorMessage message={error.message} onRetry={onRetry} />;
    }

    // Filter only by valid imdbID, letting MovieCard handle poster fallback
    const validMovies = movies.filter((movie) => movie.imdbID);

    return (
        <Grid container spacing={3} padding={3}>
            {loading ? (
                <MovieSkeleton />
            ) : (
                validMovies.map((movie) => (
                    <Grid item key={movie.imdbID} xs={12} sm={6} md={4} lg={3}>
                        <MovieCard movie={movie} />
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default MovieGrid; 