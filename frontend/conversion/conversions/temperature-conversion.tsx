import { Field, Record } from "@airtable/blocks/models";
import { TemperatureConversionField, TEMPERATURE_UNIT } from "../../types";

const convertTemperatureToCelsius = (
  temperature: number,
  units: TEMPERATURE_UNIT
) => {
  switch (units) {
    case TEMPERATURE_UNIT.CELSIUS:
      return temperature;
    case TEMPERATURE_UNIT.KELVIN:
      return temperature - 273.15;
    case TEMPERATURE_UNIT.FARENHEIT:
      return ((temperature - 32) * 5) / 9;
  }
  throw new Error(`Unknow temperature unit ${units}`);
};

const convertTemperatureFromCelsius = (
  temperature: number,
  units: TEMPERATURE_UNIT
) => {
  switch (units) {
    case TEMPERATURE_UNIT.CELSIUS:
      return temperature;
    case TEMPERATURE_UNIT.KELVIN:
      return temperature + 273.15;
    case TEMPERATURE_UNIT.FARENHEIT:
      return (temperature * 9) / 5 + 32;
  }
  throw new Error(`Unknow temperature unit ${units}`);
};

export const convertTemperature = (
  record: Record,
  field: Field,
  options: TemperatureConversionField["options"]
) => {
  const temperature = record.getCellValue(field);

  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    throw new Error(
      `Invalid temperature: number expected. Cannot convert record ${record.id}`
    );
  }

  return convertTemperatureFromCelsius(
    convertTemperatureToCelsius(temperature, options.sourceUnits),
    options.destinationUnits
  );
};
