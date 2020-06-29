import { Field, Record } from "@airtable/blocks/models";
import { CurrencyConversionField, CURRENCY } from "../../types";

interface ExchangeRatesApiResponse {
  rates: { [currency in CURRENCY]: number | undefined };
  base: CURRENCY;
  date: string;
}

let dailyCurrencyRatesCache:
  | { date: string; exchangeRatesPromise: Promise<ExchangeRatesApiResponse> }
  | undefined;
async function getTodayExchangeRates() {
  const now = new Date();
  const date = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDay()}`;
  if (dailyCurrencyRatesCache && dailyCurrencyRatesCache.date === date) {
    return dailyCurrencyRatesCache.exchangeRatesPromise;
  }
  const exchangeRatesPromise = fetch(
    "https://api.exchangeratesapi.io/latest"
  ).then((response) => response.json()) as Promise<ExchangeRatesApiResponse>;
  dailyCurrencyRatesCache = {
    date,
    exchangeRatesPromise,
  };
  return await exchangeRatesPromise;
}

export const convertCurrency = async (
  record: Record,
  field: Field,
  options: CurrencyConversionField["options"]
) => {
  const amount = record.getCellValue(field);

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new Error(
      `Invalid temperature: number expected. Cannot convert record ${record.id}`
    );
  }

  const todayExchangeRates = await getTodayExchangeRates();

  const baseAmount =
    options.sourceCurrency === todayExchangeRates.base ||
    !todayExchangeRates.rates[options.sourceCurrency]
      ? amount
      : amount / todayExchangeRates.rates[options.sourceCurrency];

  return options.destinationCurrency === todayExchangeRates.base ||
    !todayExchangeRates.rates[options.destinationCurrency]
    ? baseAmount
    : baseAmount * todayExchangeRates.rates[options.destinationCurrency];
};
