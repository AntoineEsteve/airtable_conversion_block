import { Field, FieldType, Table } from "@airtable/blocks/models";
import {
  Box,
  Button,
  FieldPicker,
  Heading,
  Input,
  Select,
} from "@airtable/blocks/ui";
import React, { ChangeEvent, memo, useCallback, useState } from "react";
import {
  CONVERSION_TYPE,
  LengthConversionField,
  LENGTH_UNIT,
} from "../../types";
import { saveConversionField } from "../../utils/save-conversion-field";
import { BoxWithLoader } from "../box-with-loader";
import { EditConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";

const availableLengthUnits = [
  // METRIC
  { value: LENGTH_UNIT.KILOMETER, label: "Kilometer" },
  { value: LENGTH_UNIT.HECTOMETER, label: "Hectometer" },
  { value: LENGTH_UNIT.DECAMETER, label: "Decameter" },
  { value: LENGTH_UNIT.METER, label: "Meter" },
  { value: LENGTH_UNIT.DECIMETER, label: "Decimeter" },
  { value: LENGTH_UNIT.CENTIMETER, label: "Centimer" },
  { value: LENGTH_UNIT.MILLIMETER, label: "Millimeter" },
  { value: LENGTH_UNIT.MICROMETER, label: "Micrometer" },
  { value: LENGTH_UNIT.NANOMETER, label: "Nanometer" },

  // IMPERIAL/US
  { value: LENGTH_UNIT.THOU, label: "Thou" },
  { value: LENGTH_UNIT.LINE, label: "Line" },
  { value: LENGTH_UNIT.INCH, label: "Inch" },
  { value: LENGTH_UNIT.FOOT, label: "Foot" },
  { value: LENGTH_UNIT.YARD, label: "Yard" },
  { value: LENGTH_UNIT.MILE, label: "Mile" },
];

const minPrecision = 0;
const maxPrecision = 6;

export const MemoEditLengthConversionField = memo<{
  selectedTable: Table;
  conversionField?: Partial<LengthConversionField>;
  editConversionField: EditConversionField;
  close: () => unknown;
}>(function EditLengthConversionField({
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
    Partial<LengthConversionField["options"]>
  >({
    sourceUnits: conversionField?.options?.sourceUnits,
    destinationUnits: conversionField?.options?.destinationUnits,
  });

  const [name, setName] = useState(field?.name || "");

  const onChangeName = useCallback((event) => setName(event.target.value), [
    setName,
  ]);

  const [precision, setPrecision] = useState<number>(
    (field?.options?.precision as number | undefined) ?? 1
  );

  const onChangePrecision = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value);
      if (Number.isFinite(value)) {
        setPrecision(Math.min(maxPrecision, Math.max(minPrecision, value)));
      }
    },
    []
  );

  const [loading, setLoading] = useState(false);

  const save = useCallback(async () => {
    const { sourceUnits, destinationUnits } = options;
    if (!sourceUnits || !destinationUnits) {
      return;
    }
    setLoading(true);
    await saveConversionField<LengthConversionField>({
      selectedTable,
      fieldId: field?.id,
      fieldType: FieldType.NUMBER,
      fieldOptions: { precision },
      name: name || `${originalField.name} (${destinationUnits})`,
      originalField,
      conversionType: CONVERSION_TYPE.LENGTH,
      options: { sourceUnits, destinationUnits },
      editConversionField,
    });
    setLoading(false);
    close();
  }, [
    close,
    editConversionField,
    field,
    name,
    options,
    originalField,
    precision,
    selectedTable,
  ]);

  return (
    <BoxWithLoader display="flex" flexDirection="column" loading={loading}>
      <Heading size="small">Length Conversion</Heading>

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
        label="Source Field: Units"
        hint="Specify the units of the source field"
        marginTop={2}
      >
        <Select
          options={availableLengthUnits}
          value={options.sourceUnits}
          onChange={useCallback(
            (units: LENGTH_UNIT) =>
              setOptions({ ...options, sourceUnits: units }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      <LabeledComponent
        label={`${field ? "Destination" : "New"} Field: Units`}
        hint={`Specify the units that you want in the ${
          field ? "destination" : "new"
        } field`}
        marginTop={2}
      >
        <Select
          options={availableLengthUnits}
          value={options.destinationUnits}
          onChange={useCallback(
            (units: LENGTH_UNIT) =>
              setOptions({ ...options, destinationUnits: units }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      {/* The name can only be edited when creating a new field because there is no API to update or delete a field (yet?) */}
      {!field ? (
        <>
          <LabeledComponent
            label={`${field ? "Destination" : "New"} Field: Name`}
            hint={`Name the ${field ? "destination" : "new"} field`}
            marginTop={2}
          >
            <Input value={name} onChange={onChangeName} />
          </LabeledComponent>

          <LabeledComponent
            label={`${field ? "Destination" : "New"} Field: Precision`}
            hint={`Specify the maximum number of decimal digits in the ${
              field ? "destination" : "new"
            } field`}
            marginTop={2}
          >
            <Input
              value={precision.toString()}
              type="number"
              min={minPrecision}
              max={maxPrecision}
              step={1}
              onChange={onChangePrecision}
            />
          </LabeledComponent>
        </>
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
    </BoxWithLoader>
  );
});
