import { Group, NumberFormatter, Table } from "@mantine/core";
import EditableInput from "./editable-input";
import { useFormContext } from "./form";

export default function AddedItem({
  item,
  section,
}: {
  item: number;
  section: number;
}) {
  const form = useFormContext();
  const addedItem = form.getValues().sections[section].items[item];

  return (
    <Table.Tr>
      <Table.Td w={120}>{addedItem.code}</Table.Td>
      <Table.Td>{addedItem?.description}</Table.Td>
      <Table.Td w={100}>{addedItem?.unit}</Table.Td>
      <Table.Td w={120}>
        <Group justify="flex-end">
          <EditableInput
            placeholder="e.g. 200"
            // type="number"
            w="100%"
            styles={{ input: { textAlign: "right" } }}
            key={form.key(`sections.${section}.items.${item}.quantity`)}
            {...form.getInputProps(
              `sections.${section}.items.${item}.quantity`
            )}
          />
        </Group>
      </Table.Td>
      <Table.Td w={140}>
        <Group justify="flex-end">
          <EditableInput
            placeholder="e.g. 200"
            // type="number"
            w="100%"
            styles={{ input: { textAlign: "right" } }}
            leftSection={"$"}
            key={form.key(`sections.${section}.items.${item}.unitPrice`)}
            {...form.getInputProps(
              `sections.${section}.items.${item}.unitPrice`
            )}
          />
        </Group>
      </Table.Td>
      <Table.Td ta="right" w={120}>
        <NumberFormatter
          prefix="$ "
          value={(addedItem.quantity ?? 0) * (addedItem.unitPrice ?? 0)}
          thousandSeparator
          fixedDecimalScale
          decimalScale={2}
        />
      </Table.Td>
    </Table.Tr>
  );
}
