import { cursor } from "@airtable/blocks";
import { Base, Table } from "@airtable/blocks/models";
import { useWatchable } from "@airtable/blocks/ui";

export function useSelectedTable(base: Base): Table | null {
  useWatchable(cursor, ["activeTableId"]);

  return base.getTableByIdIfExists(cursor.activeTableId);
}
