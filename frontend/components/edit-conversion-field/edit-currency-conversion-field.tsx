import { Field, FieldType, Table } from "@airtable/blocks/models";
import {
  Box,
  Button,
  FieldPicker,
  Heading,
  Input,
  Select,
} from "@airtable/blocks/ui";
import React, { ChangeEvent, FC, useCallback, useState } from "react";
import {
  CONVERSION_TYPE,
  CURRENCY,
  CurrencyConversionField,
} from "../../types";
import { saveConversionField } from "../../utils/save-conversion-field";
import { BoxWithLoader } from "../box-with-loader";
import { EditConversionField } from "../hooks/conversion-fields";
import { LabeledComponent } from "../labeled-component";

const availableCurrencies = Object.values(CURRENCY).map((currency) => ({
  value: currency,
  label: currency,
}));

const currencySymbols: { [currency in CURRENCY]: string } = {
  [CURRENCY.USD]: "$",
  [CURRENCY.EUR]: "€",
  [CURRENCY.CNY]: "¥",
  [CURRENCY.JPY]: "¥",
  [CURRENCY.GBP]: "£",
  [CURRENCY.CAD]: "CA$",
  [CURRENCY.HKD]: "HK$",
  [CURRENCY.ISK]: "kr",
  [CURRENCY.PHP]: "₱",
  [CURRENCY.DKK]: "Kr.",
  [CURRENCY.HUF]: "Ft",
  [CURRENCY.CZK]: "Kč",
  [CURRENCY.AUD]: "AUD",
  [CURRENCY.RON]: "lei",
  [CURRENCY.SEK]: "kr",
  [CURRENCY.IDR]: "Rp",
  [CURRENCY.INR]: "₹",
  [CURRENCY.BRL]: "R$",
  [CURRENCY.RUB]: "₽",
  [CURRENCY.HRK]: "kn",
  [CURRENCY.THB]: "฿",
  [CURRENCY.CHF]: "Fr.",
  [CURRENCY.SGD]: "S$",
  [CURRENCY.PLN]: "zł",
  [CURRENCY.BGN]: "Лв.",
  [CURRENCY.TRY]: "₺",
  [CURRENCY.NOK]: "kr",
  [CURRENCY.NZD]: "NZ$",
  [CURRENCY.ZAR]: "R",
  [CURRENCY.MXN]: "Mex$",
  [CURRENCY.ILS]: "₪",
  [CURRENCY.KRW]: "₩",
  [CURRENCY.MYR]: "RM",
};

const tryToGuessCurrencyFromField = (field?: Field) => {
  if (field && field.type === FieldType.CURRENCY && field.options.symbol) {
    for (const currency in currencySymbols) {
      const symbol = currencySymbols[currency];
      if (symbol === field.options.symbol) {
        return currency as CURRENCY;
      }
    }
  }
  return undefined;
};

const minPrecision = 0;
const maxPrecision = 7;

export const EditCurrencyConversionFieldComponent: FC<{
  selectedTable: Table;
  conversionField?: Partial<CurrencyConversionField>;
  editConversionField: EditConversionField;
  close: () => unknown;
}> = ({ selectedTable, conversionField, editConversionField, close }) => {
  const field = conversionField.fieldId
    ? selectedTable.getFieldByIdIfExists(conversionField.fieldId)
    : undefined;

  const [originalFieldId, setOriginalFieldId] = useState<string>(
    conversionField.originalFieldId
  );

  const originalField = originalFieldId
    ? selectedTable.getFieldByIdIfExists(originalFieldId)
    : undefined;

  const [options, setOptions] = useState<
    Partial<CurrencyConversionField["options"]>
  >({
    sourceCurrency:
      conversionField?.options?.sourceCurrency ??
      tryToGuessCurrencyFromField(field),
    destinationCurrency: conversionField?.options?.destinationCurrency,
  });

  const [name, setName] = useState(field?.name || "");

  const onChangeName = useCallback((event) => setName(event.target.value), [
    setName,
  ]);

  const [precision, setPrecision] = useState<number>(
    (field?.options?.precision as number | undefined) ?? 2
  );

  const onChangePrecision = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value);
      if (Number.isFinite(value)) {
        setPrecision(Math.min(maxPrecision, Math.max(minPrecision, value)));
      }
    },
    []
  );

  const [loading, setLoading] = useState(false);

  const save = useCallback(async () => {
    const { sourceCurrency, destinationCurrency } = options;
    if (!sourceCurrency || !destinationCurrency) {
      return;
    }
    setLoading(true);
    await saveConversionField<CurrencyConversionField>({
      selectedTable,
      fieldId: field?.id,
      fieldType: FieldType.CURRENCY,
      fieldOptions: { precision, symbol: currencySymbols[destinationCurrency] },
      name: name || `${originalField.name} (${destinationCurrency})`,
      originalField,
      conversionType: CONVERSION_TYPE.CURRENCY,
      options: { sourceCurrency, destinationCurrency },
      editConversionField,
    });
    setLoading(false);
    close();
  }, [
    close,
    editConversionField,
    field,
    name,
    options,
    originalField,
    precision,
    selectedTable,
  ]);

  return (
    <BoxWithLoader display="flex" flexDirection="column" loading={loading}>
      <Heading size="small">Currency Conversion &#128230;</Heading>

      <Heading size="xsmall" marginTop={3}>
        Source field
      </Heading>

      <LabeledComponent
        label="Field"
        hint="Select the field you want to convert"
        error={
          originalField &&
          originalField.type !== FieldType.NUMBER &&
          originalField.type !== FieldType.CURRENCY
            ? `We do not support the fields of type "${originalField.type}", please select a field of type "currency" or "number"`
            : undefined
        }
        marginTop={2}
      >
        <FieldPicker
          table={selectedTable}
          field={
            originalFieldId
              ? selectedTable.getFieldByIdIfExists(originalFieldId)
              : undefined
          }
          onChange={useCallback(
            (field: Field) => {
              setOriginalFieldId(field.id);
              const guessedCurrency = tryToGuessCurrencyFromField(field);
              if (guessedCurrency) {
                setOptions({
                  ...options,
                  sourceCurrency: guessedCurrency,
                });
              }
            },
            [options]
          )}
        />
      </LabeledComponent>

      <LabeledComponent
        label="Currency"
        hint="Specify the currency used in the source field"
        marginTop={2}
      >
        <Select
          options={availableCurrencies}
          value={options.sourceCurrency}
          onChange={useCallback(
            (currency: CURRENCY) =>
              setOptions({ ...options, sourceCurrency: currency }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      <Heading size="xsmall" marginTop={3}>
        {field ? "Destination field" : "New field"}
      </Heading>

      <LabeledComponent
        label="Currency"
        hint={`Specify the currency that you want in the ${
          field ? "destination" : "new"
        } field`}
        marginTop={2}
      >
        <Select
          options={availableCurrencies}
          value={options.destinationCurrency}
          onChange={useCallback(
            (currency: CURRENCY) =>
              setOptions({ ...options, destinationCurrency: currency }),
            [options, setOptions]
          )}
        />
      </LabeledComponent>

      {/* The name can only be edited when creating a new field because there is no API to update or delete a field (yet?) */}
      {!field ? (
        <>
          <LabeledComponent
            label="Name"
            hint={`Give a name to the ${field ? "destination" : "new"} field`}
            marginTop={2}
          >
            <Input value={name} onChange={onChangeName} />
          </LabeledComponent>

          <LabeledComponent
            label="Precision"
            hint={`Specify the maximum number of decimal digits in the ${
              field ? "destination" : "new"
            } field`}
            marginTop={2}
          >
            <Input
              value={precision.toString()}
              type="number"
              min={minPrecision}
              max={maxPrecision}
              step={1}
              onChange={onChangePrecision}
            />
          </LabeledComponent>
        </>
      ) : null}

      <Box display="flex" marginTop={3}>
        <Button flex="1 0 auto" icon="chevronLeft" onClick={close}>
          Cancel
        </Button>
        <Button
          flex="1 0 auto"
          variant="primary"
          icon="check"
          onClick={save}
          disabled={
            !originalField ||
            !options.sourceCurrency ||
            !options.destinationCurrency
          }
          marginLeft={1}
        >
          {field ? "Update" : "Create"}
        </Button>
      </Box>
    </BoxWithLoader>
  );
};
