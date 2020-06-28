import { FieldType, Field, Table } from "@airtable/blocks/models";
import { ConversionField } from "../types";
import { EditConversionField } from "../components/hooks/conversion-fields";
import { convertAllRecords } from "./convert-all-records";

export async function saveConversionField<
  TConversionField extends ConversionField
>({
  selectedTable,
  fieldId,
  fieldType,
  fieldOptions,
  name,
  originalField,
  conversionType,
  options,
  editConversionField,
}: {
  selectedTable: Table;
  fieldId?: string;
  fieldType: FieldType;
  fieldOptions?: any;
  name: string;
  originalField: Field;
  conversionType: TConversionField["type"];
  options: TConversionField["options"];
  editConversionField: EditConversionField;
}) {
  let field: Field;
  if (fieldId) {
    field = selectedTable.getFieldByIdIfExists(fieldId);
  }
  if (!field) {
    field = await selectedTable.unstable_createFieldAsync(
      name,
      fieldType,
      fieldOptions
    );
  }

  const conversionField = {
    originalFieldId: originalField.id,
    fieldId: field.id,
    type: conversionType,
    options,
  } as ConversionField;

  await convertAllRecords({
    selectedTable,
    conversionField,
    field,
    originalField,
  });

  editConversionField(conversionField);
}
