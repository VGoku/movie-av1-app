import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '/placeholder-movie.svg';
import { useState, useEffect } from 'react';

interface MovieCardProps {
    movie: {
        imdbID: string;
        Title: string;
        Poster: string;
        Year: string;
        Type: string;
    };
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const [fallbackPoster, setFallbackPoster] = useState('');

    // Fetch fallback poster from TMDb if movie.Poster is 'N/A'
    useEffect(() => {
        // Reset fallback state when poster changes
        setImageError(false);
        setUseFallback(false);
        setFallbackPoster('');

        if (movie.Poster.trim() === 'N/A' && movie.imdbID) {
            const fetchFallbackPoster = async () => {
                try {
                    const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
                    const tmdbBaseUrl = import.meta.env.VITE_TMDB_BASE_URL;
                    const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
                    if (!tmdbApiKey || !tmdbBaseUrl) return;

                    const response = await fetch(`${tmdbBaseUrl}/find/${movie.imdbID}?api_key=${tmdbApiKey}&external_source=imdb_id`);
                    const data = await response.json();
                    if (data.movie_results && data.movie_results.length > 0) {
                        const posterPath = data.movie_results[0].poster_path;
                        if (posterPath) {
                            setFallbackPoster(`${tmdbImageBaseUrl}/w500${posterPath}`);
                        }
                    }
                } catch (err) {
                    // If error, do nothing; fallbackPoster remains empty
                }
            };
            fetchFallbackPoster();
        }
    }, [movie.Poster, movie.imdbID]);

    // Process the image URL: if the URL is 'N/A' or empty (after trimming), return the fallbackPoster if available, else the placeholder.
    // If the URL contains 'amazon' (case-insensitive), then:
    // - If not using fallback, return the OMDb alternative image endpoint using movie.imdbID and VITE_OMDB_API_KEY.
    // - If using fallback, return the original amazon URL.
    // Otherwise, return the trimmed URL as is.
    const processImageUrl = (url: string) => {
        const trimmedUrl = url.trim();
        if (trimmedUrl === 'N/A' || !trimmedUrl) {
            return fallbackPoster || placeholderImage;
        }
        if (trimmedUrl.toLowerCase().includes('amazon')) {
            if (!useFallback) {
                const apiKey = import.meta.env.VITE_OMDB_API_KEY;
                if (apiKey) {
                    return `https://img.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
                } else {
                    return placeholderImage;
                }
            } else {
                return trimmedUrl;
            }
        }
        return trimmedUrl;
    };

    const imageUrl = imageError ? placeholderImage : processImageUrl(movie.Poster);

    useEffect(() => {
        console.log(`Movie: ${movie.Title} - Poster URL: ${movie.Poster} | Computed URL: ${imageUrl} | useFallback: ${useFallback} | fallbackPoster: ${fallbackPoster}`);
    }, [movie, imageUrl, useFallback, fallbackPoster]);

    const handleImageError = () => {
        if (!useFallback && movie.Poster.toLowerCase().includes('amazon')) {
            // First attempt (OMDb endpoint) failed, switch to original amazon URL
            setUseFallback(true);
            setImageError(false);
        } else {
            setImageError(true);
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    cursor: 'pointer',
                    boxShadow: (theme) => theme.shadows[8],
                },
                backgroundColor: 'background.paper',
            }}
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
        >
            <CardMedia
                key={imageError ? 'placeholder' : (useFallback ? 'amazon' : 'omdb')}
                component="img"
                image={imageUrl}
                alt={movie.Title}
                onError={handleImageError}
                sx={{
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    backgroundColor: 'background.paper',
                }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" component="h2" noWrap title={movie.Title}>
                    {movie.Title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {movie.Year}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MovieCard; 