import { Pagination, Box } from '@mui/material';

interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MoviePagination = ({ currentPage, totalPages, onPageChange }: MoviePaginationProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: 4,
        '& .MuiPagination-ul': {
          gap: 1,
        },
      }}
    >
      <Pagination
        page={currentPage}
        count={totalPages}
        color="primary"
        size="large"
        onChange={(_, page) => onPageChange(page)}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default MoviePagination; 