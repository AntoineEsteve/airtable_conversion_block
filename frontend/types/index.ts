export interface AbstractConversion {
  type: string;
}

export enum CONVERSION_TYPE {
  TEMPERATURE = "temperature",
  LENGTH = "length",
}

interface AbstractConversionField {
  readonly originalFieldId: string;
  readonly fieldId: string;
  readonly type: CONVERSION_TYPE;
  readonly options: unknown;
}

export enum TEMPERATURE_UNIT {
  CELSIUS = "celsius",
  FARENHEIT = "farenheit",
  KELVIN = "kelvin",
}

export interface TemperatureConversionField extends AbstractConversionField {
  type: CONVERSION_TYPE.TEMPERATURE;
  options: {
    sourceUnits: TEMPERATURE_UNIT;
    destinationUnits: TEMPERATURE_UNIT;
  };
}

export enum LENGTH_UNIT {
  // METRIC
  KILOMETER = "kilometer",
  HECTOMETER = "hectometer",
  DECAMETER = "decameter",
  METER = "meter",
  DECIMETER = "decimeter",
  CENTIMETER = "centimer",
  MILLIMETER = "millimeter",
  MICROMETER = "micrometer",
  NANOMETER = "nanometer",

  // IMPERIAL/US
  THOU = "thou",
  LINE = "line",
  INCH = "inch",
  FOOT = "foot",
  YARD = "yard",
  MILE = "mile",
}

export interface LengthConversionField extends AbstractConversionField {
  type: CONVERSION_TYPE.LENGTH;
  options: {
    sourceUnits: LENGTH_UNIT;
    destinationUnits: LENGTH_UNIT;
  };
}

export type ConversionField =
  | TemperatureConversionField
  | LengthConversionField;

export type ConversionFields = readonly ConversionField[];
