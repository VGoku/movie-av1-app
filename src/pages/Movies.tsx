import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import MovieGrid from '../components/MovieGrid';
import MoviePagination from '../components/MoviePagination';
import { omdbApi } from '../services/omdb';

const Movies = () => {
  const [tab, setTab] = useState<'popular' | 'top_rated'>('popular');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movies', tab, page],
    queryFn: () => tab === 'popular' ? omdbApi.getPopular(page) : omdbApi.getTopRated(page),
    keepPreviousData: true,
  });

  const movies = data?.data?.Search || [];
  const totalResults = Number(data?.data?.totalResults || 0);
  const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'popular' | 'top_rated') => {
    setTab(newValue);
    setPage(1);
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movies
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="movie categories"
          >
            <Tab label="Popular" value="popular" />
            <Tab label="Top Rated" value="top_rated" />
          </Tabs>
        </Box>

        <MovieGrid
          movies={movies}
          loading={isLoading}
          error={error as Error}
          onRetry={() => refetch()}
        />

        {!isLoading && !error && movies.length > 0 && (
          <MoviePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Container>
  );
};

export default Movies; 