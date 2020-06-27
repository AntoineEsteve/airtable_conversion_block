import { cursor } from "@airtable/blocks";
import Base from "@airtable/blocks/dist/types/src/models/base";
import Table from "@airtable/blocks/dist/types/src/models/table";
import { useWatchable } from "@airtable/blocks/ui";

export function useSelectedTable(base: Base): Table | null {
  useWatchable(cursor, ["activeTableId"]);
  return base.getTableByIdIfExists(cursor.activeTableId);
}
