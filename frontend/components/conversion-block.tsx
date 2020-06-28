import { Box, Loader, useBase } from "@airtable/blocks/ui";
import React, { useCallback, useState } from "react";
import { MemoEditConversionFieldForm } from "./edit-conversion-field-form";
import { ConversionField } from "../types";
import { MemoConversionFields } from "./conversion-fields";
import { useConversionFields } from "./hooks/conversion-fields";
import { useSelectedTable } from "./hooks/selected-table";

export function ConversionBlock() {
  const base = useBase();

  const selectedTable = useSelectedTable(base);

  const {
    conversionFields,
    addConversionField,
    editConversionField,
  } = useConversionFields();

  const [editingConversionField, startEditingConversionField] = useState<
    Partial<ConversionField>
  >();

  const startCreatingConversionField = useCallback(() => {
    startEditingConversionField({});
  }, [startEditingConversionField]);

  const stopEditingConversionField = useCallback(() => {
    startEditingConversionField(undefined);
  }, [startEditingConversionField]);

  if (!selectedTable) {
    return (
      <Box justifyContent="center" alignItems="center">
        <Loader scale={0.3} />
      </Box>
    );
  }

  return (
    <Box padding={2} overflow="auto">
      {editingConversionField ? (
        <MemoEditConversionFieldForm
          selectedTable={selectedTable}
          conversionField={editingConversionField}
          addConversionField={addConversionField}
          close={stopEditingConversionField}
        />
      ) : (
        <MemoConversionFields
          selectedTable={selectedTable}
          conversionFields={conversionFields}
          startCreatingConversionField={startCreatingConversionField}
          editConversionField={editConversionField}
        />
      )}
    </Box>
  );
}
