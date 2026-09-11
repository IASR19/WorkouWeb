import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type MetricCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 1, sm: 2 }, '&:last-child': { pb: { xs: 1, sm: 2 } } }}>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.75, sm: 2 }}>
          <Box sx={{ display: 'flex', flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: { xs: 18, sm: 24 } } }}>
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900} noWrap sx={{ fontSize: { xs: '1rem', sm: '2.125rem' }, lineHeight: 1.2 }}>
              {value}
            </Typography>
            <Typography color="text.secondary" noWrap sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

