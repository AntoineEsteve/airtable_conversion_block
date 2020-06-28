import { Box, Loader } from "@airtable/blocks/ui";
import React, { ComponentProps, FC } from "react";

export const BoxWithLoader: FC<
  { loading?: boolean; loaderScale?: number } & ComponentProps<typeof Box>
> = ({ loading, loaderScale = 0.5, children, ...props }) => (
  <Box {...props} position="relative">
    {children}
    {loading ? (
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(255,255,255,0.7)"
      >
        <Loader flex="0 0 auto" scale={loaderScale} margin={3} />
      </Box>
    ) : null}
  </Box>
);
