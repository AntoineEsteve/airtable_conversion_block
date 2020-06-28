import { Field, Record } from "@airtable/blocks/models";
import { TemperatureConversionField, TEMPERATURE_UNIT } from "../../types";

const celsiusToFarenheit = (temperature: number) => (temperature * 9) / 5 + 32;
const farenheitToCelsius = (temperature: number) =>
  ((temperature - 32) * 5) / 9;

export const convertTemperature = (
  record: Record,
  field: Field,
  options: TemperatureConversionField["options"]
) => {
  const temperature = record.getCellValue(field);

  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    throw new Error(
      `Invalid value: number expected. Cannot convert record ${record.id}`
    );
  }

  switch (options.sourceUnits) {
    case TEMPERATURE_UNIT.CELSIUS:
      switch (options.destinationUnits) {
        case TEMPERATURE_UNIT.CELSIUS:
          return temperature;
        case TEMPERATURE_UNIT.FARENHEIT:
          return celsiusToFarenheit(temperature);
      }
      throw new Error(`Unknown configuration unit ${options.destinationUnits}`);
    case TEMPERATURE_UNIT.FARENHEIT:
      switch (options.destinationUnits) {
        case TEMPERATURE_UNIT.CELSIUS:
          return farenheitToCelsius(temperature);
        case TEMPERATURE_UNIT.FARENHEIT:
          return temperature;
      }
      throw new Error(`Unknown configuration unit ${options.destinationUnits}`);
  }

  throw new Error(`Unknown configuration unit ${options.sourceUnits}`);
};
