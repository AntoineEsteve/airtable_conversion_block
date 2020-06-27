import { Box, Button } from "@airtable/blocks/ui";
import React, { memo, useCallback } from "react";
import { ConversionField } from "../types/conversion-field";
import { EditConversionField } from "../utils/conversion-fields";
import Field from "@airtable/blocks/dist/types/src/models/field";

export const MemoConversionFieldRow = memo<{
  index: number;
  field: Field;
  originalField: Field;
  conversionField: ConversionField;
  editConversionField: EditConversionField;
}>(function ConversionFieldRow({
  index,
  field,
  originalField,
  conversionField,
  editConversionField,
}) {
  return (
    <Box borderTop={index === 0 ? undefined : "1px solid red"}>
      <Box>{`${originalField.name} → ${field.name}`}</Box>
      <Button
        icon="edit"
        onClick={useCallback(() => editConversionField(conversionField), [
          editConversionField,
          conversionField,
        ])}
      />
    </Box>
  );
});
