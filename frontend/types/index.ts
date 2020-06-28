export interface AbstractConversion {
  type: string;
}

export enum CONVERSION_TYPE {
  TEMPERATURE = "temperature",
  DISTANCE = "distance",
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
}

export interface TemperatureConversionField extends AbstractConversionField {
  type: CONVERSION_TYPE.TEMPERATURE;
  options: {
    sourceUnits: TEMPERATURE_UNIT;
    destinationUnits: TEMPERATURE_UNIT;
  };
}

export interface DistanceConversionField extends AbstractConversionField {
  type: CONVERSION_TYPE.TEMPERATURE;
  options: any; // TODO
}

export type ConversionField =
  | TemperatureConversionField
  | DistanceConversionField;

export type ConversionFields = readonly ConversionField[];
