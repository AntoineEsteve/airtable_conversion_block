import { Field, Table } from "@airtable/blocks/models";
import { Button, Icon, Text } from "@airtable/blocks/ui";
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
import { TextEllipsis } from "./text-ellipsis";

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
      <Text flex="1 1 auto" minWidth={0}>
        <TextEllipsis fontWeight={500}>{field.name}</TextEllipsis>
        <TextEllipsis fontSize={10} display="flex" alignItems="center">
          <Icon name="formula" size={10} marginRight={1} /> {originalField.name}
        </TextEllipsis>
      </Text>
      <Button flex="0 0 auto" icon="edit" marginLeft={2} onClick={edit} />
      <Button flex="0 0 auto" icon="play" marginLeft={2} onClick={convert} />
    </BoxWithLoader>
  );
});
