import {
  Autocomplete,
  AutocompleteProps,
  Group,
  OptionsFilter,
  Stack,
  Text,
} from "@mantine/core";
import { InvoiceItem, useFormContext } from "./form";
import { useCallback, useMemo } from "react";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

const getItemsByCategory = (async ({ queryKey: [, catId] }) => {
  const items = await db.query.items.findMany({
    where: (fields, { eq }) => eq(fields.categoryCode, catId),
  });
  return items;
}) satisfies QueryFunction<any, ["items/category", string], never>;

export default function ItemSelector({
  categoryCode,
}: {
  categoryCode: string;
}) {
  const form = useFormContext();
  const { data } = useQuery({
    queryKey: ["items/category", categoryCode],
    queryFn: getItemsByCategory,
  });
  const itemsMap = useMemo(
    () => new Map(data?.map((category) => [category.code, category])),
    [data]
  );

  const sectionIndex = useMemo(() => {
    return form.values.sections.findIndex((sec) => sec.code === categoryCode);
  }, [form.values.sections, categoryCode]);

  const renderAutocompleteOption = useCallback<
    Exclude<AutocompleteProps["renderOption"], undefined>
  >(
    ({ option }) => {
      const item = itemsMap.get(option.value);

      if (!item) {
        return null;
      }

      return (
        <Stack gap={0} style={{ width: "100%" }}>
          <Group justify="space-between">
            <Text>{item.code}</Text>
            <Text size="sm" c="dimmed">
              {item.unit}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </Stack>
      );
    },
    [itemsMap]
  );

  const optionsFilter = useCallback<OptionsFilter>(
    ({ search, limit }) => {
      const splittedSearch = search.toLowerCase().trim().split(" ");

      return (data ?? [])
        .filter((option) => {
          const words = option.description.toLowerCase().trim().split(" ");
          return splittedSearch.every(
            (searchWord) =>
              option.code.includes(searchWord) ||
              option.unit.includes(searchWord) ||
              words.some((word) => word.includes(searchWord))
          );
        })
        .slice(0, limit)
        .map((val) => ({ value: val.code, label: val.code }));
    },
    [data]
  );

  const onOptionSelect = useCallback(
    (key: string) => {
      if (itemsMap.has(key)) {
        const item = itemsMap.get(key)!;
        form.setFieldValue(
          `sections.${sectionIndex}.items`,
          (prev: InvoiceItem[]) => [...(prev ?? []), item]
        );
      }
    },
    [sectionIndex, itemsMap]
  );

  return (
    <Autocomplete
      key={form.getInputProps(`sections.${sectionIndex}.items`).value.length}
      placeholder="Pick value or enter anything"
      limit={10}
      data={[...itemsMap.keys()]}
      renderOption={renderAutocompleteOption}
      filter={optionsFilter}
      onChange={onOptionSelect}
    />
  );
}
