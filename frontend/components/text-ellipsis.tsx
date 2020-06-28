import { Text } from "@airtable/blocks/ui";
import React, { ComponentProps, FC } from "react";

export const TextEllipsis: FC<ComponentProps<typeof Text>> = (props) => (
  <Text
    {...props}
    style={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  />
);
