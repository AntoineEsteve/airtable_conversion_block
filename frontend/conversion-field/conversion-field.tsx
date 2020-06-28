import { Box, Button } from "@airtable/blocks/ui";
import React, { memo, useCallback } from "react";
import { ConversionField } from "../types";
import { EditConversionField } from "../utils/conversion-fields";
import Field from "@airtable/blocks/dist/types/src/models/field";
import Table from "@airtable/blocks/dist/types/src/models/table";
import { convert } from "./convert";

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

  const convertAllRecords = useCallback(async () => {
    const queryResult = await selectedTable.selectRecordsAsync();
    const updates = await Promise.all(
      queryResult.recordIds.map(async (recordId) => {
        const record = queryResult.getRecordById(recordId);
        const convertedValue = await convert(
          record,
          originalField,
          conversionField
        );
        return {
          id: recordId,
          fields: {
            [field.id]: convertedValue,
          },
        };
      })
    );
    await selectedTable.updateRecordsAsync(updates);
  }, [conversionField, field.id, originalField, selectedTable]);

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
