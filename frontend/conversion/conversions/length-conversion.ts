import { Field, Record } from "@airtable/blocks/models";
import { LengthConversionField, LENGTH_UNIT } from "../../types";

const convertLengthToMeter = (length: number, units: LENGTH_UNIT) => {
  switch (units) {
    // METRIC
    case LENGTH_UNIT.KILOMETER:
      return length * 1000;
    case LENGTH_UNIT.HECTOMETER:
      return length * 100;
    case LENGTH_UNIT.DECAMETER:
      return length * 10;
    case LENGTH_UNIT.METER:
      return length;
    case LENGTH_UNIT.DECIMETER:
      return length / 10;
    case LENGTH_UNIT.CENTIMETER:
      return length / 100;
    case LENGTH_UNIT.MILLIMETER:
      return length / 1000;
    case LENGTH_UNIT.MICROMETER:
      return length / 10000;
    case LENGTH_UNIT.NANOMETER:
      return length / 100000;

    // IMPERIAL/US
    case LENGTH_UNIT.THOU:
      return length * 0.0000254;
    case LENGTH_UNIT.LINE:
      return length * 0.002116;
    case LENGTH_UNIT.INCH:
      return length * 0.0254;
    case LENGTH_UNIT.FOOT:
      return length * 0.3048;
    case LENGTH_UNIT.YARD:
      return length * 0.9144;
    case LENGTH_UNIT.MILE:
      return length * 1609.34;
  }
};

const convertLengthFromMeter = (length: number, units: LENGTH_UNIT) => {
  switch (units) {
    // METRIC
    case LENGTH_UNIT.KILOMETER:
      return length / 1000;
    case LENGTH_UNIT.HECTOMETER:
      return length / 100;
    case LENGTH_UNIT.DECAMETER:
      return length / 10;
    case LENGTH_UNIT.METER:
      return length;
    case LENGTH_UNIT.DECIMETER:
      return length * 10;
    case LENGTH_UNIT.CENTIMETER:
      return length * 100;
    case LENGTH_UNIT.MILLIMETER:
      return length * 1000;
    case LENGTH_UNIT.MICROMETER:
      return length * 10000;
    case LENGTH_UNIT.NANOMETER:
      return length * 100000;

    // IMPERIAL/US
    case LENGTH_UNIT.THOU:
      return length / 0.0000254;
    case LENGTH_UNIT.LINE:
      return length / 0.002116;
    case LENGTH_UNIT.INCH:
      return length / 0.0254;
    case LENGTH_UNIT.FOOT:
      return length / 0.3048;
    case LENGTH_UNIT.YARD:
      return length / 0.9144;
    case LENGTH_UNIT.MILE:
      return length / 1609.34;
  }
};

export const convertLength = (
  record: Record,
  field: Field,
  options: LengthConversionField["options"]
) => {
  const temperature = record.getCellValue(field);

  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    throw new Error(
      `Invalid temperature: number expected. Cannot convert record ${record.id}`
    );
  }

  return convertLengthFromMeter(
    convertLengthToMeter(temperature, options.sourceUnits),
    options.destinationUnits
  );
};
