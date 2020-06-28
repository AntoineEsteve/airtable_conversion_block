export interface AbstractConversion {
  type: string;
}

export enum CONVERSION_TYPE {
  TEMPERATURE = "temperature",
  LENGTH = "length",
  VOLUME = "volume",
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

export enum VOLUME_UNIT {
  // SI
  CUBIC_MILLIMETER = "cubic_millimeter",
  CUBIC_CENTIMETER = "cubic_centimeter",
  CUBIC_DECIMETER = "cubic_decimeter",
  CUBIC_METER = "cubic_meter",
  CUBIC_KILOMETER = "cubic_kilometer",

  // Non-SI
  MILLILITER = "milliliter",
  CENTILITER = "centiliter",
  LITER = "liter",

  // Imperial/US
  CUBIC_INCH = "cubic_inch",
  CUBIC_FOOT = "cubic_foot",
  PINT = "pint",
  GALLON = "gallon",
  BARREL = "barrel",
}

export interface VolumeConversionField extends AbstractConversionField {
  type: CONVERSION_TYPE.VOLUME;
  options: {
    sourceUnit: VOLUME_UNIT;
    destinationUnit: VOLUME_UNIT;
  };
}

export type ConversionField =
  | TemperatureConversionField
  | LengthConversionField
  | VolumeConversionField;

export type ConversionFields = readonly ConversionField[];
