import { Box, initializeBlock, Loader, useBase } from "@airtable/blocks/ui";
import React, { useCallback, useState } from "react";
import { MemoConversionFields } from "./conversion-field/conversion-fields";
import { MemoEditConversionFieldForm } from "./conversion-field/edit-conversion-field-form";
import { ConversionField } from "./types";
import { useConversionFields } from "./utils/conversion-fields";
import { useSelectedTable } from "./utils/selected-table";

function ConversionsBlock() {
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

initializeBlock(() => <ConversionsBlock />);
