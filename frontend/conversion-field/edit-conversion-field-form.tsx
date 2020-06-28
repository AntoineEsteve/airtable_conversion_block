import Table from "@airtable/blocks/dist/types/src/models/table";
import { Box, Button, Select, Label, Input } from "@airtable/blocks/ui";
import React, { memo, useCallback, useState } from "react";
import { ConversionField, CONVERSION_TYPE, TEMPERATURE_UNIT } from "../types";
import { AddConversionField } from "../utils/conversion-fields";

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
  const [originalFieldId, setOriginalFieldId] = useState(
    conversionField.originalFieldId
  );

  const originalField = originalFieldId
    ? selectedTable.getFieldByIdIfExists(originalFieldId)
    : undefined;

  const [name, setName] = useState("");

  const save = useCallback(async () => {
    if (!originalFieldId || !originalField) {
      return;
    }
    if (conversionField.fieldId) {
      return console.error("TODO: EDITING");
    } else {
      const field = await selectedTable.unstable_createFieldAsync(
        name || `${originalField.name} (COPY)`,
        originalField.type,
        originalField.options
      );
      addConversionField({
        originalFieldId,
        fieldId: field.id,
        type: CONVERSION_TYPE.TEMPERATURE,
        options: {
          sourceUnits: TEMPERATURE_UNIT.CELSIUS,
          destinationUnits: TEMPERATURE_UNIT.FARENHEIT,
        },
      });
      close();
    }
  }, [
    originalFieldId,
    originalField,
    conversionField.fieldId,
    selectedTable,
    name,
    addConversionField,
    close,
  ]);

  return (
    <Box>
      <Label>
        Field
        <Select
          options={selectedTable.fields.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          value={originalFieldId}
          onChange={useCallback(
            (newOriginalFieldId: string) =>
              setOriginalFieldId(newOriginalFieldId),
            [setOriginalFieldId]
          )}
        />
      </Label>
      <Label>
        Name
        <Input
          value={name}
          onChange={useCallback((event) => setName(event.target.value), [
            setName,
          ])}
        />
      </Label>
      <Button icon="check" onClick={save}>
        Save
      </Button>
    </Box>
  );
});
