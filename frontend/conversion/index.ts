import { Field, Record } from "@airtable/blocks/models";
import { ConversionField, CONVERSION_TYPE } from "../types";
import { convertLength } from "./conversions/length-conversion";
import { convertTemperature } from "./conversions/temperature-conversion";
import { convertVolume } from "./conversions/volume-conversion";
import { convertCurrency } from "./conversions/currency-conversion";
import { convertArea } from "./conversions/area-conversion";

export const convert = async (
  record: Record,
  field: Field,
  conversionField: ConversionField
) => {
  switch (conversionField.type) {
    case CONVERSION_TYPE.TEMPERATURE:
      return convertTemperature(record, field, conversionField.options);
    case CONVERSION_TYPE.LENGTH:
      return convertLength(record, field, conversionField.options);
    case CONVERSION_TYPE.AREA:
      return convertArea(record, field, conversionField.options);
    case CONVERSION_TYPE.VOLUME:
      return convertVolume(record, field, conversionField.options);
    case CONVERSION_TYPE.CURRENCY:
      return await convertCurrency(record, field, conversionField.options);
  }
};
