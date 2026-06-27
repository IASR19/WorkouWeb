import { Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type MetricCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          {icon}
          <div>
            <Typography variant="h4" fontWeight={900}>{value}</Typography>
            <Typography color="text.secondary">{label}</Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}

