import { Field, FieldType, Table } from "@airtable/blocks/models";
import {
  Box,
  Button,
  FieldPicker,
  Heading,
  Input,
  Select,
} from "@airtable/blocks/ui";
import React, { memo, useCallback, useState } from "react";
import {
  ConversionField,
  CONVERSION_TYPE,
  TemperatureConversionField,
  TEMPERATURE_UNIT,
} from "../../types";
import { AddConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";

export const MemoEditTemperatureConversionField = memo<{
  selectedTable: Table;
  conversionField?: Partial<ConversionField>;
  addConversionField: AddConversionField;
  close: () => unknown;
}>(function EditTemperatureConversionField({
  selectedTable,
  conversionField,
  addConversionField,
  close,
}) {
  const [originalFieldId, setOriginalFieldId] = useState<string>(
    conversionField.originalFieldId
  );

  const originalField = originalFieldId
    ? selectedTable.getFieldByIdIfExists(originalFieldId)
    : undefined;

  const [options, setOptions] = useState<
    Partial<TemperatureConversionField["options"]>
  >({});

  const [name, setName] = useState("");

  const onChangeName = useCallback((event) => setName(event.target.value), [
    setName,
  ]);

  const save = useCallback(async () => {
    const { destinationUnits, sourceUnits } = options;
    if (!originalField || !destinationUnits || !sourceUnits) {
      return;
    }
    if (conversionField.fieldId) {
      return console.error("TODO: EDITING");
    } else {
      const field = await selectedTable.unstable_createFieldAsync(
        name || `${originalField.name} (COPY)`,
        FieldType.NUMBER,
        {}
      );
      addConversionField({
        originalFieldId: originalField.id,
        fieldId: field.id,
        type: CONVERSION_TYPE.TEMPERATURE,
        options: { sourceUnits, destinationUnits },
      });
      close();
    }
  }, [
    originalField,
    conversionField.fieldId,
    selectedTable,
    name,
    addConversionField,
    options,
    close,
  ]);

  return (
    <Box display="flex" flexDirection="column">
      <Heading size="small">Temperature Conversion</Heading>

      <LabeledComponent
        label="Source Field"
        hint="Select the field you want to convert"
        error={
          originalField && originalField.type !== FieldType.NUMBER
            ? `We do not support the fields of type "${originalField.type}", please select a field of type "number"`
            : undefined
        }
        marginTop={2}
      >
        <FieldPicker
          table={selectedTable}
          field={
            originalFieldId
              ? selectedTable.getFieldByIdIfExists(originalFieldId)
              : undefined
          }
          onChange={useCallback(
            (field: Field) => setOriginalFieldId(field.id),
            [setOriginalFieldId]
          )}
        />
      </LabeledComponent>

      <LabeledComponent
        label="Source Units"
        hint="Specify the units of the source field"
        marginTop={2}
      >
        <Select
          options={availableTemperatureUnits}
          value={options.sourceUnits}
          onChange={useCallback(
            (units: TEMPERATURE_UNIT) =>
              setOptions({ ...options, sourceUnits: units }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      <LabeledComponent
        label="Destination Units"
        hint="Specify the units that you want in your new field"
        marginTop={2}
      >
        <Select
          options={availableTemperatureUnits}
          value={options.destinationUnits}
          onChange={useCallback(
            (units: TEMPERATURE_UNIT) =>
              setOptions({ ...options, destinationUnits: units }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      <LabeledComponent
        label="Destination Field Name"
        hint="Please name your new field"
        marginTop={2}
      >
        <Input value={name} onChange={onChangeName} />
      </LabeledComponent>

      <Button icon="check" onClick={save} marginTop={2}>
        Save
      </Button>
    </Box>
  );
});

const availableTemperatureUnits = [
  { value: TEMPERATURE_UNIT.CELSIUS, label: "Celsius" },
  { value: TEMPERATURE_UNIT.FARENHEIT, label: "Farenheit" },
];
