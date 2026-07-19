import React from "react";
import { Card, CardHeader, CardContent, CardActions, Button, Avatar, Stack } from "@mui/material";
import { FeatureItem } from "./FeatureItem";

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor?: string;
  onClick: () => void;
  accentColor: string;
}

export const RoleCard = ({
  icon,
  title,
  description,
  features,
  buttonText,
  buttonColor,
  onClick,
  accentColor,
}: RoleCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        width: "100%",
        maxWidth: 420,
        bgcolor: "background.paper",
        borderColor: "divider",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[4],
          borderColor: accentColor,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {icon}
          </Avatar>
        }
        title={title}
        titleTypographyProps={{
          variant: "h6",
          sx: {
            fontWeight: 700,
            color: "text.primary",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
        }}
        subheader={description}
        subheaderTypographyProps={{
          variant: "body2",
          sx: {
            color: "text.secondary",
            lineHeight: 1.4,
            mt: 0.5,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
        }}
        sx={{
          p: 3,
          pb: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "& .MuiCardHeader-avatar": {
            mr: 0,
            mb: 2,
          },
          "& .MuiCardHeader-content": {
            width: "100%",
          },
        }}
      />

      <CardContent
        sx={{
          p: 3,
          pt: 1.5,
          pb: 0,
          flexGrow: 1,
        }}
      >
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {features.map((feature, idx) => (
            <FeatureItem key={idx} text={feature} />
          ))}
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          p: 3,
          pt: 1.5,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={onClick}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "none",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            bgcolor: buttonColor || accentColor,
            boxShadow: "none",
            "&:hover": {
              bgcolor: buttonColor || accentColor,
              filter: "brightness(0.9)",
              boxShadow: "none",
            },
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};
