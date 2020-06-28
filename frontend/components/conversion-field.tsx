import { Field, Table } from "@airtable/blocks/models";
import { Box, Button } from "@airtable/blocks/ui";
import React, { Dispatch, memo, SetStateAction, useCallback } from "react";
import { ConversionField } from "../types";
import { convertAllRecords } from "../utils/convert-all-records";

export const MemoConversionField = memo<{
  selectedTable: Table;
  index: number;
  field: Field;
  originalField: Field;
  conversionField: ConversionField;
  startEditingConversionField: Dispatch<
    SetStateAction<Partial<ConversionField>>
  >;
}>(function ConversionField({
  selectedTable,
  index,
  field,
  originalField,
  conversionField,
  startEditingConversionField,
}) {
  const edit = useCallback(() => startEditingConversionField(conversionField), [
    startEditingConversionField,
    conversionField,
  ]);

  const convert = useCallback(
    () =>
      convertAllRecords({
        selectedTable,
        field,
        originalField,
        conversionField,
      }),
    [conversionField, field, originalField, selectedTable]
  );

  return (
    <Box
      borderTop={index === 0 ? undefined : "1px solid red"}
      display="flex"
      alignItems="center"
    >
      <Box flex="1 1 auto">{`${originalField.name} → ${field.name}`}</Box>
      <Button flex="0 0 auto" icon="edit" marginLeft={2} onClick={edit} />
      <Button flex="0 0 auto" icon="play" marginLeft={2} onClick={convert} />
    </Box>
  );
});
