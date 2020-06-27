import { useGlobalConfig } from "@airtable/blocks/ui";
import { produce } from "immer";
import { useCallback } from "react";
import { ConversionField, ConversionFields } from "../types/conversion-field";

const CONVERSION_FIELDS_KEY = "GLOBAL_CONFIG_CONVERSION_FIELD";

export function useConversionFields() {
  const globalConfig = useGlobalConfig();

  const conversionFields = (globalConfig.get(CONVERSION_FIELDS_KEY) ?? []) as
    | ConversionFields
    | undefined;

  const addConversionField = useCallback(
    (conversionField: ConversionField) =>
      globalConfig.setAsync(CONVERSION_FIELDS_KEY, [
        ...conversionFields,
        conversionField,
      ] as any),
    [conversionFields, globalConfig]
  );

  const editConversionField = useCallback(
    (conversionField: ConversionField) =>
      globalConfig.setAsync(
        CONVERSION_FIELDS_KEY,
        produce(conversionFields, (mutableConversionFields) => {
          const index = mutableConversionFields.findIndex(
            (otherConversionField) =>
              otherConversionField.fieldId === conversionField.fieldId
          );
          if (index >= 0) {
            mutableConversionFields[index] = conversionField;
          } else {
            mutableConversionFields.push(conversionField);
          }
        }) as any
      ),
    [conversionFields, globalConfig]
  );

  return { conversionFields, addConversionField, editConversionField };
}

export type AddConversionField = ReturnType<
  typeof useConversionFields
>["addConversionField"];

export type EditConversionField = ReturnType<
  typeof useConversionFields
>["editConversionField"];
