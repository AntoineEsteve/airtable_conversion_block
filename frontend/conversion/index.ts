import Field from "@airtable/blocks/dist/types/src/models/field";
import Record from "@airtable/blocks/dist/types/src/models/record";
import { ConversionField, CONVERSION_TYPE } from "../types";
import { convertTemperature } from "./conversions/temperature-conversion";

export const convert = async (
  record: Record,
  field: Field,
  conversionField: ConversionField
) => {
  switch (conversionField.type) {
    case CONVERSION_TYPE.TEMPERATURE:
      return convertTemperature(record, field, conversionField.options);
    default:
      throw new Error(
        `TODO: Implement conversion for type ${conversionField.type}`
      );
  }
};
