import { Table } from "@airtable/blocks/models";
import { Box, Button, Heading, Text } from "@airtable/blocks/ui";
import React, { memo, Dispatch, SetStateAction } from "react";
import { ConversionField, ConversionFields } from "../types";
import { MemoConversionField } from "./conversion-field";

export const MemoConversionFields = memo<{
  selectedTable: Table;
  conversionFields: ConversionFields;
  startCreatingConversionField: () => unknown;
  startEditingConversionField: Dispatch<
    SetStateAction<Partial<ConversionField>>
  >;
}>(function ConversionFields({
  selectedTable,
  conversionFields,
  startCreatingConversionField,
  startEditingConversionField,
}) {
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
          <Heading size="small" marginBottom={2}>
            Welcome to the Conversion Block! &#127881;
          </Heading>
          <Text marginBottom={2}>
            This block allows you to create new fields converting other fields
            values into the one that you need.
          </Text>
          <Text marginBottom={1} fontWeight={500}>
            Few examples:
          </Text>
          <ul
            style={{
              listStyleType: "circle",
              paddingInlineStart: 24,
              margin: "0 0 8px 0",
            }}
          >
            <li>
              <Text marginBottom={1}>
                Convert currencies &#128178; with up-to-date current rates,
                examples: USD&#8594;EUR, JPY&#8594;USD...
              </Text>
            </li>
            <li>
              <Text marginBottom={1}>
                Convert lengths &#128207;: inches&#8594;meters,
                kilometers&#8594;yard, foot&#8594;centimeters...
              </Text>
            </li>
            <li>
              <Text marginBottom={1}>
                Convert volumes &#128230;: liter&#8594;cubic&#160;meter,
                cubic&#160;millimeter&#8594;pint,
                milliliter&#8594;cubic&#160;inches...
              </Text>
            </li>
            <li>
              <Text marginBottom={1}>
                Convert temperatures &#127777;: celsius&#8594;kelvin,
                farenheit&#8594;celsius...
              </Text>
            </li>
          </ul>
          <Text marginBottom={2}>And much more! &#128293;</Text>
        </>
      ) : (
        <>
          <Heading marginBottom={2} size="small">
            Your Conversion Fields
          </Heading>
          {selectedTableConversionFields.map(
            ({ field, originalField, conversionField }, index) => (
              <MemoConversionField
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
        New conversion
      </Button>
    </Box>
  );
});
