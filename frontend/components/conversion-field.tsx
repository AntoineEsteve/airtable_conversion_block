import { Table, Field } from "@airtable/blocks/models";
import { Box, Button } from "@airtable/blocks/ui";
import React, { memo, useCallback } from "react";
import { ConversionField } from "../types";
import { EditConversionField } from "./hooks/conversion-fields";
import { useConvertAllRecords } from "./hooks/convert-all-records";

export const MemoConversionField = memo<{
  selectedTable: Table;
  index: number;
  field: Field;
  originalField: Field;
  conversionField: ConversionField;
  editConversionField: EditConversionField;
}>(function ConversionField({
  selectedTable,
  index,
  field,
  originalField,
  conversionField,
  editConversionField,
}) {
  const edit = useCallback(() => editConversionField(conversionField), [
    editConversionField,
    conversionField,
  ]);

  const convertAllRecords = useConvertAllRecords({
    selectedTable,
    field,
    originalField,
    conversionField,
  });

  return (
    <Box
      borderTop={index === 0 ? undefined : "1px solid red"}
      display="flex"
      alignItems="center"
    >
      <Box flex="1 1 auto">{`${originalField.name} → ${field.name}`}</Box>
      <Button flex="0 0 auto" icon="edit" marginLeft={2} onClick={edit} />
      <Button
        flex="0 0 auto"
        icon="play"
        marginLeft={2}
        onClick={convertAllRecords}
      />
    </Box>
  );
});
