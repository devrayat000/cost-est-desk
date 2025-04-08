import { useCallback, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import payItems from "@/assets/pay_items.csv";
import {
  Table,
  Button,
  Autocomplete,
  UnstyledButton,
  Stack,
  Text,
  Group,
  AutocompleteProps,
  OptionsFilter,
  ComboboxItem,
  TextInput,
  NumberInput,
  Container,
  Box,
  Title,
  TextInputProps,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";

interface PayItem {
  itemNumber: string;
  description: string;
  unit: string;
}

const items = new Map(
  (payItems as PayItem[]).map(({ itemNumber, ...rest }) => [itemNumber, rest])
);

const renderAutocompleteOption: AutocompleteProps["renderOption"] = (input) => {
  const item = items.get(input.option.value);

  if (!item) {
    return null;
  }

  return (
    <Stack gap={0} style={{ width: "100%" }}>
      <Group justify="space-between">
        <Text>{input.option.value}</Text>
        <Text size="sm" c="dimmed">
          {item.unit}
        </Text>
      </Group>
      <Text size="xs" c="dimmed">
        {item.description}
      </Text>
    </Stack>
  );
};

const optionsFilter: OptionsFilter = ({ search, limit }) => {
  const splittedSearch = search.toLowerCase().trim().split(" ");

  return (payItems as PayItem[])
    .filter((option) => {
      const words = option.description.toLowerCase().trim().split(" ");
      return splittedSearch.every(
        (searchWord) =>
          option.itemNumber.includes(searchWord) ||
          words.some((word) => word.includes(searchWord))
      );
    })
    .slice(0, limit)
    .map((val) => ({ label: val.itemNumber, value: val.itemNumber }));
};

interface InvoiceItem extends PayItem {
  quantity?: number;
  unitPrice?: number;
}

interface Invoice {
  items: InvoiceItem[];
}

const [FormProvider, useFormContext, useForm] = createFormContext<Invoice>();

export default function App() {
  // const [addedItems, setAddedItems] = useState<string[]>([]);
  const form = useForm({
    initialValues: {
      items: [],
    },
    mode: "controlled",
  });

  return (
    <Box mx="lg" my="xl">
      <Title ta="center">Create cost estimations</Title>

      <Container mt="xl">
        <FormProvider form={form}>
          <Table>
            <Table.Caption>A list of your recent invoices.</Table.Caption>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Item Number</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Unit</Table.Th>
                <Table.Th ta="right">Quantity</Table.Th>
                <Table.Th ta="right">Unit Price</Table.Th>
                <Table.Th ta="right">Total Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {form.values.items.map(({ itemNumber }, index) => {
                return <AddedItem key={itemNumber} index={index} />;
              })}
              <Table.Tr key="add-item">
                <Table.Td colSpan={3}>
                  <ItemSelector />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td colSpan={5} fw={500}>
                  Total
                </Table.Td>
                <Table.Td ta="right">
                  $
                  {new Intl.NumberFormat("en-us", {
                    currency: "USD",
                    currencySign: "standard",
                    maximumFractionDigits: 2,
                  }).format(
                    form.values.items.reduce(
                      (prev, curr) =>
                        (curr.quantity ?? 0) * (curr.unitPrice ?? 0) + prev,
                      0
                    )
                  )}
                </Table.Td>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </FormProvider>
      </Container>
    </Box>
  );
}

import classes from "./editable-input.module.css";

function EditableInput(props: TextInputProps) {
  const [editable, setEditable] = useState(true);

  const enableEditing = useCallback(() => {
    setEditable(true);
  }, []);

  const disableEditing = useCallback(() => {
    setEditable(false);
  }, []);

  return (
    <TextInput
      {...props}
      onBlur={(event) => {
        props.onBlur?.(event);
        if (!!props.value) {
          disableEditing();
        }
      }}
      onDoubleClick={enableEditing}
      contentEditable={editable}
      classNames={{ input: classes.input }}
    />
  );
}

function AddedItem({ index }: { index: number }) {
  const form = useFormContext();
  const addedItem = form.getValues().items[index];

  return (
    <Table.Tr>
      <Table.Td w={120}>{addedItem.itemNumber}</Table.Td>
      <Table.Td>{addedItem?.description}</Table.Td>
      <Table.Td w={100}>{addedItem?.unit}</Table.Td>
      <Table.Td w={120}>
        <Group justify="flex-end">
          <EditableInput
            placeholder="e.g. 200"
            type="number"
            w="100%"
            styles={{ input: { textAlign: "right" } }}
            key={form.key(`items.${index}.quantity`)}
            {...form.getInputProps(`items.${index}.quantity`)}
          />
        </Group>
      </Table.Td>
      <Table.Td w={140}>
        <Group justify="flex-end">
          <EditableInput
            placeholder="e.g. 200"
            type="number"
            w="100%"
            styles={{ input: { textAlign: "right" } }}
            leftSection={"$"}
            key={form.key(`items.${index}.unitPrice`)}
            {...form.getInputProps(`items.${index}.unitPrice`)}
          />
        </Group>
      </Table.Td>
      <Table.Td ta="right" w={120}>
        $
        {new Intl.NumberFormat("en-us", {
          currency: "USD",
          currencySign: "standard",
          maximumFractionDigits: 2,
        }).format((addedItem.quantity ?? 0) * (addedItem.unitPrice ?? 0))}
      </Table.Td>
    </Table.Tr>
  );
}

function ItemSelector() {
  const form = useFormContext();
  const addedItems = form.getValues().items;

  return (
    <Autocomplete
      key={addedItems.length}
      placeholder="Pick value or enter anything"
      limit={10}
      data={[...items.keys()]}
      renderOption={renderAutocompleteOption}
      filter={optionsFilter}
      onChange={(key) => {
        if (items.has(key)) {
          const item = items.get(key)!;
          form.setFieldValue("items", (prev) => [
            ...prev,
            {
              itemNumber: key,
              ...item,
            },
          ]);
        }
      }}
    />
  );
}
