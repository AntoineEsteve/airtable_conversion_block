import { Table } from "@airtable/blocks/models";
import { Box, Button, Heading, Text } from "@airtable/blocks/ui";
import React, { Dispatch, FC, SetStateAction } from "react";
import { ConversionField, ConversionFields } from "../types";
import { ConversionFieldComponent } from "./conversion-field";

export const ConversionFieldsComponent: FC<{
  selectedTable: Table;
  conversionFields: ConversionFields;
  startCreatingConversionField: () => unknown;
  startEditingConversionField: Dispatch<
    SetStateAction<Partial<ConversionField>>
  >;
}> = ({
  selectedTable,
  conversionFields,
  startCreatingConversionField,
  startEditingConversionField,
}) => {
  const selectedTableConversionFields = conversionFields
    .map((conversionField) => ({
      field: selectedTable.getFieldByIdIfExists(conversionField.fieldId),
      originalField: selectedTable.getFieldByIdIfExists(
        conversionField.originalFieldId
      ),
      conversionField,
    }))
    .filter(({ field, originalField }) => !!field && !!originalField);

  return (
    <Box display="flex" flexDirection="column">
      {selectedTableConversionFields.length === 0 ? (
        <>
          <Heading size="small" marginBottom={2} textAlign="center">
            Welcome to the Conversion&#160;Block!&#160;&#127881;
          </Heading>
          <Text marginBottom={2}>
            This block allows you to create new fields which convert existing
            fields into the units you need.
          </Text>
          <Text marginBottom={1} fontWeight={500}>
            A few examples:
          </Text>
          <Box marginBottom={1} marginLeft={3}>
            <Text>
              &#128178; Convert{" "}
              <Text display="inline" fontWeight={500}>
                currency
              </Text>
            </Text>
            <Text marginBottom={1} marginLeft={3} fontSize={11}>
              with up-to-date currency exchange rates
            </Text>

            <Text marginBottom={1}>
              &#128207; Convert{" "}
              <Text display="inline" fontWeight={500}>
                length
              </Text>
            </Text>

            <Text marginBottom={1}>
              &#128506; Convert{" "}
              <Text display="inline" fontWeight={500}>
                surface
              </Text>
            </Text>

            <Text marginBottom={1}>
              &#127759; Convert{" "}
              <Text display="inline" fontWeight={500}>
                volume
              </Text>
            </Text>

            <Text marginBottom={1}>
              &#127777; Convert{" "}
              <Text display="inline" fontWeight={500}>
                temperature
              </Text>
            </Text>
          </Box>
          <Text marginBottom={2}>And more to come...</Text>
        </>
      ) : (
        <>
          <Heading marginBottom={2} size="small">
            Your Conversion Fields
          </Heading>
          {selectedTableConversionFields.map(
            ({ field, originalField, conversionField }, index) => (
              <ConversionFieldComponent
                key={index}
                selectedTable={selectedTable}
                field={field}
                originalField={originalField}
                conversionField={conversionField}
                last={index === selectedTableConversionFields.length - 1}
                startEditingConversionField={startEditingConversionField}
              />
            )
          )}
        </>
      )}
      <Button
        onClick={startCreatingConversionField}
        icon="plus"
        variant="primary"
      >
        New Conversion
      </Button>
    </Box>
  );
};
