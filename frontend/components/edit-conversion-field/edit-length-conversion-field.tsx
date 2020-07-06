import { Field, FieldType, Table } from "@airtable/blocks/models";
import {
  Box,
  Button,
  FieldPicker,
  Heading,
  Input,
  Select,
} from "@airtable/blocks/ui";
import React, { ChangeEvent, FC, useCallback, useState } from "react";
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
const maxPrecision = 8;
const defaultPrecision = 1;

export const EditLengthConversionFieldComponent: FC<{
  selectedTable: Table;
  conversionField?: Partial<LengthConversionField>;
  editConversionField: EditConversionField;
  close: () => unknown;
}> = ({ selectedTable, conversionField, editConversionField, close }) => {
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
    sourceUnit: conversionField?.options?.sourceUnit,
    destinationUnit: conversionField?.options?.destinationUnit,
  });

  const [name, setName] = useState(field?.name || "");

  const onChangeName = useCallback((event) => setName(event.target.value), [
    setName,
  ]);

  const [precision, setPrecision] = useState<number>(
    (field?.options?.precision as number | undefined) ?? defaultPrecision
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
    const { sourceUnit, destinationUnit } = options;
    if (!sourceUnit || !destinationUnit) {
      return;
    }
    setLoading(true);
    try {
      await saveConversionField<LengthConversionField>({
        selectedTable,
        fieldId: field?.id,
        fieldType: FieldType.NUMBER,
        fieldOptions: { precision },
        name: name || `${originalField.name} (${destinationUnit})`,
        originalField,
        conversionType: CONVERSION_TYPE.LENGTH,
        options: { sourceUnit, destinationUnit },
        editConversionField,
      });
    } catch (error) {
      console.error(
        "An error occured while trying to save a conversion field",
        error
      );
      // TODO: Notify the user
    }
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
      <Heading size="small">Length Conversion &#128207;</Heading>

      <Heading size="xsmall" marginTop={3}>
        Source field
      </Heading>

      <LabeledComponent
        label="Field"
        hint="Select the field you want to convert"
        error={
          originalField && originalField.type !== FieldType.NUMBER
            ? `We do not support the fields of type "${originalField.type}", please select a field of type "${FieldType.NUMBER}"`
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
        label="Unit"
        hint="Specify the unit used in the source field"
        marginTop={2}
      >
        <Select
          options={availableLengthUnits}
          value={options.sourceUnit}
          onChange={useCallback(
            (unit: LENGTH_UNIT) => setOptions({ ...options, sourceUnit: unit }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      <Heading size="xsmall" marginTop={3}>
        {field ? "Destination field" : "New field"}
      </Heading>

      <LabeledComponent
        label="Unit"
        hint={`Specify the unit that you want in the ${
          field ? "destination" : "new"
        } field`}
        marginTop={2}
      >
        <Select
          options={availableLengthUnits}
          value={options.destinationUnit}
          onChange={useCallback(
            (unit: LENGTH_UNIT) =>
              setOptions({ ...options, destinationUnit: unit }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      {/* The name can only be edited when creating a new field because there is no API to update or delete a field (yet?) */}
      {!field ? (
        <>
          <LabeledComponent
            label="Name"
            hint={`Give a name to the ${field ? "destination" : "new"} field`}
            marginTop={2}
          >
            <Input value={name} onChange={onChangeName} />
          </LabeledComponent>

          <LabeledComponent
            label="Precision"
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

      <Box display="flex" marginTop={3}>
        <Button flex="1 0 auto" icon="chevronLeft" onClick={close}>
          Cancel
        </Button>
        <Button
          flex="1 0 auto"
          variant="primary"
          icon="check"
          onClick={save}
          disabled={
            !originalField ||
            originalField.type !== FieldType.NUMBER ||
            !options.sourceUnit ||
            !options.destinationUnit
          }
          marginLeft={1}
        >
          {field ? "Update" : "Create"}
        </Button>
      </Box>
    </BoxWithLoader>
  );
};
