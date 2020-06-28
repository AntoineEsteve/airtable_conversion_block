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
    sourceUnit: TEMPERATURE_UNIT;
    destinationUnit: TEMPERATURE_UNIT;
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
    sourceUnit: LENGTH_UNIT;
    destinationUnit: LENGTH_UNIT;
  };
}

export type ConversionField =
  | TemperatureConversionField
  | LengthConversionField;

export type ConversionFields = readonly ConversionField[];
