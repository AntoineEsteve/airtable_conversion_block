import { Field, Table } from "@airtable/blocks/models";
import chunk from "lodash/chunk";
import { convert } from "../conversion";
import { ConversionField } from "../types";

export async function convertAllRecords({
  selectedTable,
  field,
  originalField,
  conversionField,
}: {
  selectedTable: Table;
  field: Field;
  originalField: Field;
  conversionField: ConversionField;
}) {
  const queryResult = await selectedTable.selectRecordsAsync();

  const updates = (
    await Promise.all(
      queryResult.recordIds.map(async (recordId) => {
        const record = queryResult.getRecordById(recordId);
        try {
          return {
            id: recordId,
            fields: {
              [field.id]: await convert(record, originalField, conversionField),
            },
          };
        } catch (error) {
          console.error(`Could not convert the record ${record.id}`, error);
          return undefined;
        }
      })
    )
  ).filter((update) => !!update);

  // updateRecordsAsync only allow 50 updates at a time
  for (const updateBatch of chunk(updates, 50)) {
    await selectedTable.updateRecordsAsync(updateBatch);
  }
}
