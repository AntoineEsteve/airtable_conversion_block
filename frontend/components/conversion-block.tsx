import { Box, Loader, useBase } from "@airtable/blocks/ui";
import React, { useCallback, useState } from "react";
import { ConversionField } from "../types";
import { MemoConversionFields } from "./conversion-fields";
import { MemoEditConversionField } from "./edit-conversion-field/edit-conversion-field";
import { useConversionFields } from "./hooks/conversion-fields";
import { useSelectedTable } from "./hooks/selected-table";

export function ConversionBlock() {
  const base = useBase();

  const selectedTable = useSelectedTable(base);

  const { conversionFields, editConversionField } = useConversionFields();

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
        <MemoEditConversionField
          selectedTable={selectedTable}
          conversionField={editingConversionField}
          editConversionField={editConversionField}
          close={stopEditingConversionField}
        />
      ) : (
        <MemoConversionFields
          selectedTable={selectedTable}
          conversionFields={conversionFields}
          startCreatingConversionField={startCreatingConversionField}
          startEditingConversionField={startEditingConversionField}
        />
      )}
    </Box>
  );
}
