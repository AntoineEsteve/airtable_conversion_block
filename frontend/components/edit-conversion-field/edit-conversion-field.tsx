import { Table } from "@airtable/blocks/models";
import { Box, Button, Heading, Select } from "@airtable/blocks/ui";
import React, { memo, useCallback, useState } from "react";
import { ConversionField, CONVERSION_TYPE } from "../../types";
import { AddConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";
import { MemoEditTemperatureConversionField } from "./edit-temperature-conversion-field";

const availableConversionTypes = [
  { value: CONVERSION_TYPE.DISTANCE, label: "Distance" },
  { value: CONVERSION_TYPE.TEMPERATURE, label: "Temperature" },
];

export const MemoEditConversionField = memo<{
  selectedTable: Table;
  conversionField?: Partial<ConversionField>;
  addConversionField: AddConversionField;
  close: () => unknown;
}>(function EditConversionField({
  selectedTable,
  conversionField,
  addConversionField,
  close,
}) {
  const [conversionType, setConversionType] = useState<CONVERSION_TYPE>(
    conversionField.type
  );
  const [step, setStep] = useState<"type" | "options">(
    conversionType ? "options" : "type"
  );
  const confirmConversionType = useCallback(() => setStep("options"), []);
  return (
    <Box display="flex" flexDirection="column">
      {step === "options" && conversionType ? (
        conversionType === CONVERSION_TYPE.TEMPERATURE ? (
          <MemoEditTemperatureConversionField
            selectedTable={selectedTable}
            conversionField={conversionField}
            addConversionField={addConversionField}
            close={close}
          />
        ) : (
          "TODO: DISTANCE FORM"
        )
      ) : (
        <>
          <Heading size="small">What do you want to convert?</Heading>
          <LabeledComponent label="Conversion Type" marginTop={2}>
            <Select
              options={availableConversionTypes}
              value={conversionType}
              onChange={
                setConversionType as (value: CONVERSION_TYPE) => unknown
              }
            />
          </LabeledComponent>
          <Box display="flex" marginTop={2}>
            <Button flex="1 0 auto" icon="chevronLeft" onClick={close}>
              Cancel
            </Button>
            <Button
              flex="1 0 auto"
              variant="primary"
              icon="chevronRight"
              onClick={confirmConversionType}
              disabled={!conversionType}
              marginLeft={1}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
});
