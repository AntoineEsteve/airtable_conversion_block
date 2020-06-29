import { Field, Record } from "@airtable/blocks/models";
import { VolumeConversionField, VOLUME_UNIT } from "../../types";

const convertVolumeToCubicMeter = (volume: number, unit: VOLUME_UNIT) => {
  switch (unit) {
    // SI
    case VOLUME_UNIT.CUBIC_MILLIMETER:
      return volume / 1000000000;
    case VOLUME_UNIT.CUBIC_CENTIMETER:
      return volume / 1000000;
    case VOLUME_UNIT.CUBIC_DECIMETER:
      return volume / 1000;
    case VOLUME_UNIT.CUBIC_METER:
      return volume;
    case VOLUME_UNIT.CUBIC_KILOMETER:
      return volume * 1000000000;

    // Non-SI
    case VOLUME_UNIT.MILLILITER:
      return volume / 1000000;
    case VOLUME_UNIT.CENTILITER:
      return volume / 100000;
    case VOLUME_UNIT.LITER:
      return volume / 1000;

    // Imperial/US
    case VOLUME_UNIT.CUBIC_INCH:
      return volume * 0.0000163871;
    case VOLUME_UNIT.CUBIC_FOOT:
      return volume * 0.0283168;
    case VOLUME_UNIT.PINT:
      return volume * 0.000473176;
    case VOLUME_UNIT.GALLON:
      return volume * 0.00378541;
    case VOLUME_UNIT.BARREL:
      return volume / 6.2898;
  }
};

const convertCubicMeterToVolume = (volume: number, unit: VOLUME_UNIT) => {
  switch (unit) {
    // SI
    case VOLUME_UNIT.CUBIC_MILLIMETER:
      return volume * 1000000000;
    case VOLUME_UNIT.CUBIC_CENTIMETER:
      return volume * 1000000;
    case VOLUME_UNIT.CUBIC_DECIMETER:
      return volume * 1000;
    case VOLUME_UNIT.CUBIC_METER:
      return volume;
    case VOLUME_UNIT.CUBIC_KILOMETER:
      return volume / 1000000000;

    // Non-SI
    case VOLUME_UNIT.MILLILITER:
      return volume * 1000000;
    case VOLUME_UNIT.CENTILITER:
      return volume * 100000;
    case VOLUME_UNIT.LITER:
      return volume * 1000;

    // Imperial/US
    case VOLUME_UNIT.CUBIC_INCH:
      return volume / 0.0000163871;
    case VOLUME_UNIT.CUBIC_FOOT:
      return volume / 0.0283168;
    case VOLUME_UNIT.PINT:
      return volume / 0.000473176;
    case VOLUME_UNIT.GALLON:
      return volume / 0.00378541;
    case VOLUME_UNIT.BARREL:
      return volume * 6.2898;
  }
};

export const convertVolume = (
  record: Record,
  field: Field,
  options: VolumeConversionField["options"]
) => {
  const volume = record.getCellValue(field);

  if (typeof volume !== "number" || !Number.isFinite(volume)) {
    throw new Error(
      `Invalid temperature: number expected. Cannot convert record ${record.id}`
    );
  }

  return convertCubicMeterToVolume(
    convertVolumeToCubicMeter(volume, options.sourceUnit),
    options.destinationUnit
  );
};
