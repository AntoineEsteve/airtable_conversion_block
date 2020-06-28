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
  CONVERSION_TYPE,
  TemperatureConversionField,
  TEMPERATURE_UNIT,
} from "../../types";
import { saveConversionField } from "../../utils/save-conversion-field";
import { EditConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";

const availableTemperatureUnits = [
  { value: TEMPERATURE_UNIT.CELSIUS, label: "Celsius" },
  { value: TEMPERATURE_UNIT.FARENHEIT, label: "Farenheit" },
  { value: TEMPERATURE_UNIT.KELVIN, label: "Kelvin" },
];

export const MemoEditTemperatureConversionField = memo<{
  selectedTable: Table;
  conversionField?: Partial<TemperatureConversionField>;
  editConversionField: EditConversionField;
  close: () => unknown;
}>(function EditTemperatureConversionField({
  selectedTable,
  conversionField,
  editConversionField,
  close,
}) {
  const field = conversionField.fieldId
    ? selectedTable.getFieldByIdIfExists(conversionField.fieldId)
    : undefined;

  const [originalFieldId, setOriginalFieldId] = useState<string>(
    conversionField.originalFieldId
  );

  const originalField = originalFieldId
    ? selectedTable.getFieldByIdIfExists(originalFieldId)
    : undefined;

  const [options, setOptions] = useState<
    Partial<TemperatureConversionField["options"]>
  >({
    sourceUnits: conversionField?.options?.sourceUnits,
    destinationUnits: conversionField?.options?.destinationUnits,
  });

  const [name, setName] = useState(field?.name || "");

  const onChangeName = useCallback((event) => setName(event.target.value), [
    setName,
  ]);

  const save = useCallback(async () => {
    const { sourceUnits, destinationUnits } = options;
    if (!sourceUnits || !destinationUnits) {
      return;
    }
    saveConversionField<TemperatureConversionField>({
      selectedTable,
      fieldId: field?.id,
      fieldType: FieldType.NUMBER,
      fieldOptions: {
        precision: 1,
      },
      name: name || `${originalField.name} (${destinationUnits})`,
      originalField,
      conversionType: CONVERSION_TYPE.TEMPERATURE,
      options: { sourceUnits, destinationUnits },
      editConversionField,
      close,
    });
  }, [
    close,
    editConversionField,
    field,
    name,
    options,
    originalField,
    selectedTable,
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
        label="Source Field Units"
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
        label={`${field ? "Destination" : "New"} Field Units`}
        hint={`Specify the units that you want in the ${
          field ? "destination" : "new"
        } field`}
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

      {/* The name can only be edited when creating a new field because there is no API to update or delete a field (yet?) */}
      {!field ? (
        <LabeledComponent
          label={`${field ? "Destination" : "New"} Field Name`}
          hint={`Name the ${field ? "destination" : "new"} field`}
          marginTop={2}
        >
          <Input value={name} onChange={onChangeName} />
        </LabeledComponent>
      ) : null}

      <Box display="flex" marginTop={2}>
        <Button flex="1 0 auto" icon="chevronLeft" onClick={close}>
          Cancel
        </Button>
        <Button
          flex="1 0 auto"
          variant="primary"
          icon="check"
          onClick={save}
          disabled={
            !originalField || !options.sourceUnits || !options.destinationUnits
          }
          marginLeft={1}
        >
          {field ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
});
