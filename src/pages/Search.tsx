import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import MovieGrid from '../components/MovieGrid';
import MoviePagination from '../components/MoviePagination';
import { omdbApi } from '../services/omdb';

const YEARS = Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i);

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const year = searchParams.get('year') || '';
  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedYear, setSelectedYear] = useState(year);

  // Reset page when query or year changes
  useEffect(() => {
    setPage(1);
  }, [query, year]);

  // Update local state when URL params change
  useEffect(() => {
    setLocalQuery(query);
    setSelectedYear(year);
  }, [query, year]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', query, year, page],
    queryFn: () => omdbApi.searchMovies(query, page, year),
    enabled: !!query,
    keepPreviousData: true,
  });

  const movies = data?.data?.Search || [];
  const totalResults = Number(data?.data?.totalResults || 0);
  const totalPages = Math.ceil(totalResults / 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localQuery) params.set('q', localQuery);
    if (selectedYear) params.set('year', selectedYear);
    setSearchParams(params);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSelectedYear('');
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Movies
        </Typography>

        <Paper component="form" onSubmit={handleSearch} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search movies"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                InputProps={{
                  endAdornment: localQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setLocalQuery('')} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  <MenuItem value="">Any year</MenuItem>
                  {YEARS.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <IconButton
                size="large"
                color="primary"
                type="submit"
                disabled={!localQuery}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  width: '100%',
                  height: 56,
                }}
              >
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        {query && (
          <>
            {totalResults > 0 && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Found {totalResults} results
                {year && ` from ${year}`}
              </Typography>
            )}

            <MovieGrid
              movies={movies}
              loading={isLoading}
              error={error as Error}
              onRetry={() => refetch()}
            />

            {totalResults === 0 && !isLoading && (
              <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                No movies found matching "{query}"
                {year && ` from ${year}`}
              </Typography>
            )}

            {!isLoading && !error && movies.length > 0 && (
              <MoviePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Search; 