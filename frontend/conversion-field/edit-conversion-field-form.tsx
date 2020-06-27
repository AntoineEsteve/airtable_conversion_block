import Table from "@airtable/blocks/dist/types/src/models/table";
import { Box, Button, Select, Label } from "@airtable/blocks/ui";
import React, { memo, useCallback, useState } from "react";
import { ConversionField } from "../types/conversion-field";
import { AddConversionField } from "../utils/conversion-fields";
import { FieldType } from "@airtable/blocks/dist/types/src/types/field";

interface ConversionFieldForm {
  fieldId?: string;
  originalFieldId?: string;
  type?: FieldType;
  name?: string;
}

export const MemoEditConversionFieldForm = memo<{
  selectedTable: Table;
  conversionField?: Partial<ConversionField>;
  addConversionField: AddConversionField;
  close: () => unknown;
}>(function EditConversionFieldForm({
  selectedTable,
  conversionField,
  addConversionField,
  close,
}) {
  const [conversionFieldForm, setConversionFieldForm] = useState<
    ConversionFieldForm
  >({
    fieldId: conversionField?.fieldId,
    originalFieldId: conversionField?.originalFieldId,
    type: conversionField?.originalFieldId
      ? selectedTable.getFieldByIdIfExists(conversionField.originalFieldId).type
      : undefined,
    name: conversionField?.originalFieldId
      ? selectedTable.getFieldByIdIfExists(conversionField.originalFieldId).name
      : undefined,
  });
  const save = useCallback(async () => {
    const { fieldId, originalFieldId, name, type } = conversionFieldForm;
    if (!originalFieldId || !name || !type) {
      return;
    }
    if (fieldId) {
      return console.error("TODO: EDITING");
    } else {
      const field = await selectedTable.unstable_createFieldAsync(name, type);
      addConversionField({
        originalFieldId: conversionFieldForm.originalFieldId,
        fieldId: field.id,
      });
      close();
    }
  }, [conversionFieldForm, close, selectedTable, addConversionField]);
  return (
    <Box>
      <Label htmlFor="field">Field</Label>
      <Select
        options={selectedTable.fields.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        value={conversionFieldForm.originalFieldId}
        onChange={useCallback(
          (originalFieldId: string) =>
            setConversionFieldForm({ ...conversionFieldForm, originalFieldId }),
          [setConversionFieldForm, conversionFieldForm]
        )}
      />
      <Button icon="check" onClick={save}>
        Save
      </Button>
    </Box>
  );
});
