import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '/placeholder-movie.svg';
import { useState } from 'react';

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

    const processImageUrl = (url: string) => {
        const trimmedUrl = url.trim();
        if (trimmedUrl === 'N/A' || !trimmedUrl) {
            return placeholderImage;
        }
        if (trimmedUrl.toLowerCase().includes('amazon')) {
            if (!useFallback) {
                const apiKey = import.meta.env.VITE_OMDB_API_KEY;
                if (apiKey) {
                    return `https://img.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
                }
            }
            return trimmedUrl;
        }
        return trimmedUrl;
    };

    const imageUrl = imageError ? placeholderImage : processImageUrl(movie.Poster);

    const handleImageError = () => {
        if (!useFallback && movie.Poster.toLowerCase().includes('amazon')) {
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