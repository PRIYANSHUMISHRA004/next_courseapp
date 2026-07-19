import React from "react";
import { Stack, Typography } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";

interface FeatureItemProps {
  text: string;
}

export const FeatureItem = ({ text }: FeatureItemProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <CheckCircleRounded
        sx={{
          fontSize: "1.2rem",
          color: "primary.light",
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: 500,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};
