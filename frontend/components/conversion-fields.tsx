import Table from "@airtable/blocks/dist/types/src/models/table";
import { Box, Button } from "@airtable/blocks/ui";
import React, { memo } from "react";
import { ConversionFields } from "../types";
import { MemoConversionField } from "./conversion-field";
import { EditConversionField } from "./hooks/conversion-fields";

export const MemoConversionFields = memo<{
  selectedTable: Table;
  conversionFields: ConversionFields;
  startCreatingConversionField: () => unknown;
  editConversionField: EditConversionField;
}>(function ConversionFields({
  selectedTable,
  conversionFields,
  startCreatingConversionField,
  editConversionField,
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
    <Box>
      {selectedTableConversionFields.map(
        ({ field, originalField, conversionField }, index) => (
          <MemoConversionField
            key={index}
            selectedTable={selectedTable}
            field={field}
            originalField={originalField}
            conversionField={conversionField}
            index={index}
            editConversionField={editConversionField}
          />
        )
      )}
      <Button onClick={startCreatingConversionField} icon="plus">
        New conversion
      </Button>
    </Box>
  );
});
