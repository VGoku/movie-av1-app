import { Card, CardContent, Skeleton, Grid } from '@mui/material';

const MovieSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Grid item key={item} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ height: '100%' }}>
            <Skeleton
              variant="rectangular"
              sx={{ aspectRatio: '2/3', width: '100%' }}
              animation="wave"
            />
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} animation="wave" />
              <Skeleton variant="text" width="40%" height={24} animation="wave" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default MovieSkeleton; 