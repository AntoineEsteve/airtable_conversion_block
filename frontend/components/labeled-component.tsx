import { Label, Text } from "@airtable/blocks/ui";
import React, { FC, ReactNode, ComponentProps } from "react";

const LabelTitle: FC = ({ children }) => (
  <Text fontWeight={500} marginBottom={1}>
    {children}
  </Text>
);

const Hint: FC = ({ children }) => (
  <Text textColor="light" marginBottom={1}>
    {children}
  </Text>
);

const Error: FC = ({ children }) => (
  <Text textColor="#db3939" marginTop={1}>
    {children}
  </Text>
);

export const LabeledComponent: FC<
  {
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
  } & ComponentProps<typeof Label>
> = ({ label, hint, error, children }) => (
  <Label>
    {label ? <LabelTitle>{label}</LabelTitle> : null}
    {hint ? <Hint>{hint}</Hint> : null}
    {children}
    {error ? <Error>{error}</Error> : null}
  </Label>
);
