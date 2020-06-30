import { Field, Record } from "@airtable/blocks/models";
import { AreaConversionField, AREA_UNIT } from "../../types";

const convertAreaToSquareMeter = (area: number, unit: AREA_UNIT) => {
  switch (unit) {
    // SI
    case AREA_UNIT.SQUARE_MILLIMETER:
      return area * 0.000001;
    case AREA_UNIT.SQUARE_CENTIMETER:
      return area * 0.0001;
    case AREA_UNIT.SQUARE_DECIMETER:
      return area * 0.01;
    case AREA_UNIT.SQUARE_METER:
      return area;
    case AREA_UNIT.SQUARE_KILOMETER:
      return area * 1000000;

    // Non-SI
    case AREA_UNIT.ARE:
      return area * 100;
    case AREA_UNIT.HECTARE:
      return area * 10000;
    case AREA_UNIT.ACRE:
      return area * 4046.86;

    // Imperial/US
    case AREA_UNIT.SQUARE_INCH:
      return area * 0.00064516;
    case AREA_UNIT.SQUARE_FOOT:
      return area * 0.092903;
    case AREA_UNIT.SQUARE_YARD:
      return area * 0.836127;
    case AREA_UNIT.SQUARE_MILE:
      return area * 2590000;
  }
};

const convertAreaFromSquareMeter = (area: number, unit: AREA_UNIT) => {
  switch (unit) {
    // SI
    case AREA_UNIT.SQUARE_MILLIMETER:
      return area / 0.000001;
    case AREA_UNIT.SQUARE_CENTIMETER:
      return area / 0.0001;
    case AREA_UNIT.SQUARE_DECIMETER:
      return area / 0.01;
    case AREA_UNIT.SQUARE_METER:
      return area;
    case AREA_UNIT.SQUARE_KILOMETER:
      return area / 1000000;

    // Non-SI
    case AREA_UNIT.ARE:
      return area / 100;
    case AREA_UNIT.HECTARE:
      return area / 10000;
    case AREA_UNIT.ACRE:
      return area / 4046.86;

    // Imperial/US
    case AREA_UNIT.SQUARE_INCH:
      return area / 0.00064516;
    case AREA_UNIT.SQUARE_FOOT:
      return area / 0.092903;
    case AREA_UNIT.SQUARE_YARD:
      return area / 0.836127;
    case AREA_UNIT.SQUARE_MILE:
      return area / 2590000;
  }
};

export const convertArea = (
  record: Record,
  field: Field,
  options: AreaConversionField["options"]
) => {
  const area = record.getCellValue(field);

  if (typeof area !== "number" || !Number.isFinite(area)) {
    throw new Error(
      `Invalid temperature: number expected. Cannot convert record ${record.id}`
    );
  }

  return convertAreaFromSquareMeter(
    convertAreaToSquareMeter(area, options.sourceUnit),
    options.destinationUnit
  );
};
