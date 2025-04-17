import {
  Autocomplete,
  AutocompleteProps,
  Group,
  OptionsFilter,
  Text,
} from "@mantine/core";
import { useFormContext } from "./form";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

async function getCategories() {
  const categories = await db.query.categories.findMany();
  return categories;
}

export default function SectionSelector() {
  const form = useFormContext();
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categoriesMap = useMemo(
    () => new Map(data?.map((category) => [category.code, category])),
    [data]
  );

  const renderAutocompleteOption = useCallback<
    Exclude<AutocompleteProps["renderOption"], undefined>
  >(
    ({ option }) => {
      const item = categoriesMap.get(option.value);

      if (!item) {
        return null;
      }

      return (
        <Group justify="space-between">
          <Text c="dimmed">{item.code}</Text>
          <Text>{item.name}</Text>
        </Group>
      );
    },
    [categoriesMap]
  );

  const optionsFilter = useCallback<OptionsFilter>(
    ({ search, limit }) => {
      const splittedSearch = search.toLowerCase().trim().split(" ");

      return (data ?? [])
        .filter((option) => {
          const words = option.name.toLowerCase().trim().split(" ");
          return splittedSearch.every(
            (searchWord) =>
              option.code.includes(searchWord) ||
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
      if (categoriesMap.has(key)) {
        const section = categoriesMap.get(key)!;
        console.log({ section });
        form.setFieldValue("sections", (prev) => [
          ...prev,
          {
            code: key,
            name: section.name,
            items: [],
          },
        ]);
      }
    },
    [categoriesMap]
  );

  return (
    <Autocomplete
      key={form.getInputProps("sections").value.length}
      placeholder="Pick value or enter anything"
      limit={10}
      data={[...categoriesMap.keys()]}
      renderOption={renderAutocompleteOption}
      filter={optionsFilter}
      onChange={onOptionSelect}
    />
  );
}
