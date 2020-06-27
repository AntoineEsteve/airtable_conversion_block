export interface ConversionField {
  readonly originalFieldId: string;
  readonly fieldId: string;
}

export type ConversionFields = readonly ConversionField[];
