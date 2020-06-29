import { Table } from "@airtable/blocks/models";
import { Box, Button, Heading, Select } from "@airtable/blocks/ui";
import React, { FC, useCallback, useState } from "react";
import {
  ConversionField,
  CONVERSION_TYPE,
  CurrencyConversionField,
  LengthConversionField,
  TemperatureConversionField,
  VolumeConversionField,
} from "../../types";
import { EditConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";
import { EditCurrencyConversionFieldComponent } from "./edit-currency-conversion-field";
import { EditLengthConversionFieldComponent } from "./edit-length-conversion-field";
import { EditTemperatureConversionFieldComponent } from "./edit-temperature-conversion-field";
import { EditVolumeConversionFieldComponent } from "./edit-volume-conversion-field";

const availableConversionTypes = [
  { value: CONVERSION_TYPE.CURRENCY, label: "Currency" },
  { value: CONVERSION_TYPE.LENGTH, label: "Length" },
  { value: CONVERSION_TYPE.VOLUME, label: "Volume" },
  { value: CONVERSION_TYPE.TEMPERATURE, label: "Temperature" },
];

export const EditConversionFieldComponent: FC<{
  selectedTable: Table;
  conversionField?: Partial<ConversionField>;
  editConversionField: EditConversionField;
  close: () => unknown;
}> = ({ selectedTable, conversionField, editConversionField, close }) => {
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
          <EditTemperatureConversionFieldComponent
            selectedTable={selectedTable}
            conversionField={conversionField as TemperatureConversionField}
            editConversionField={editConversionField}
            close={close}
          />
        ) : conversionType === CONVERSION_TYPE.LENGTH ? (
          <EditLengthConversionFieldComponent
            selectedTable={selectedTable}
            conversionField={conversionField as LengthConversionField}
            editConversionField={editConversionField}
            close={close}
          />
        ) : conversionType === CONVERSION_TYPE.VOLUME ? (
          <EditVolumeConversionFieldComponent
            selectedTable={selectedTable}
            conversionField={conversionField as VolumeConversionField}
            editConversionField={editConversionField}
            close={close}
          />
        ) : conversionType === CONVERSION_TYPE.CURRENCY ? (
          <EditCurrencyConversionFieldComponent
            selectedTable={selectedTable}
            conversionField={conversionField as CurrencyConversionField}
            editConversionField={editConversionField}
            close={close}
          />
        ) : (
          `Sorry the conversion "${conversionType}" is not implemented yet`
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
};
