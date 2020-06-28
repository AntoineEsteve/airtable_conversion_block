import { Field, Table } from "@airtable/blocks/models";
import { Button, Icon, Text, Dialog, Heading } from "@airtable/blocks/ui";
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { ConversionField } from "../types";
import { convertAllRecords } from "../utils/convert-all-records";
import { BoxWithLoader } from "./box-with-loader";
import { RefreshIcon } from "./refresh-icon";
import { TextEllipsis } from "./text-ellipsis";
import { useToggle } from "./hooks/toggle";

export const MemoConversionField = memo<{
  selectedTable: Table;
  field: Field;
  originalField: Field;
  conversionField: ConversionField;
  index: number;
  startEditingConversionField: Dispatch<
    SetStateAction<Partial<ConversionField>>
  >;
}>(function ConversionField({
  selectedTable,
  field,
  originalField,
  conversionField,
  index,
  startEditingConversionField,
}) {
  const edit = useCallback(() => startEditingConversionField(conversionField), [
    startEditingConversionField,
    conversionField,
  ]);

  const [loading, setLoading] = useState(false);

  const convert = useCallback(async () => {
    setLoading(true);
    await convertAllRecords({
      selectedTable,
      field,
      originalField,
      conversionField,
    });
    setLoading(false);
  }, [conversionField, field, originalField, selectedTable]);

  const [openDeleteDialog, toggleDeleteDialog] = useToggle(false);

  return (
    <BoxWithLoader
      display="flex"
      alignItems="center"
      loading={loading}
      loaderScale={0.3}
      marginTop={2}
      borderTop={index !== 0 ? "1px solid #eee" : undefined}
      padding={2}
    >
      <Text flex="1 1 auto" minWidth={0} marginRight={2}>
        <TextEllipsis fontWeight={500}>{field.name}</TextEllipsis>
        <TextEllipsis fontSize={10} display="flex" alignItems="center">
          <Icon name="formula" size={10} marginRight={1} /> {originalField.name}
        </TextEllipsis>
      </Text>

      <Button
        flex="0 0 auto"
        onClick={convert}
        size="small"
        variant="secondary"
      >
        <RefreshIcon />
      </Button>

      <Button
        flex="0 0 auto"
        icon="cog"
        onClick={edit}
        size="small"
        variant="secondary"
      />

      <Button
        flex="0 0 auto"
        icon="trash"
        size="small"
        variant="secondary"
        onClick={toggleDeleteDialog}
      />

      {openDeleteDialog && (
        <Dialog onClose={toggleDeleteDialog} width="320px">
          <Dialog.CloseButton />
          <Heading>Delete Field</Heading>
          <Text variant="paragraph">
            To delete a conversion field, you can use the same interface than
            with any other field.
            <br />
            Right-click on the header and select &quot;Delete field&quot;.
          </Text>
          <img
            style={{
              display: "block",
              border: "1px solid #eee",
              margin: "auto",
              marginBottom: 16,
            }}
            src="data:image/png;base64,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"
          />
          <Button onClick={toggleDeleteDialog}>Close</Button>
        </Dialog>
      )}
    </BoxWithLoader>
  );
});
