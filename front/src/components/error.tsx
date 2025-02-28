import { Box, Typography } from '@mui/material';

export function AccessDenied() {
  return (
    <Box
      sx={{
        mt: 10,
      }}
    >
      <Typography variant="h4" color="error">
        Access Denied
      </Typography>
      <Typography variant="body1">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
}

export function NotFound() {
  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h4" color="error">
        Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
}
