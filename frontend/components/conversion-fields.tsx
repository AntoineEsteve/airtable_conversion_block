import { Table } from "@airtable/blocks/models";
import { Box, Button } from "@airtable/blocks/ui";
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
      <Button
        onClick={startCreatingConversionField}
        icon="plus"
        variant="primary"
      >
        New conversion
      </Button>
      {selectedTableConversionFields.map(
        ({ field, originalField, conversionField }, index) => (
          <MemoConversionField
            key={index}
            selectedTable={selectedTable}
            field={field}
            originalField={originalField}
            conversionField={conversionField}
            index={index}
            startEditingConversionField={startEditingConversionField}
          />
        )
      )}
    </Box>
  );
});
