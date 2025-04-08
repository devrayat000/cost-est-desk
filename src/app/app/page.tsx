import {
  Table,
  Stack,
  Text,
  Container,
  Box,
  Title,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import SectionSelector from "./components/section-selector";
import ItemSelector from "./components/item-selector";
import AddedItem from "./components/added-item";
import { FormProvider, Invoice } from "./components/form";

// const renderAutocompleteOption: AutocompleteProps["renderOption"] = (input) => {
//   const item = items.get(input.option.value);

//   if (!item) {
//     return null;
//   }

//   return (
//     <Stack gap={0} style={{ width: "100%" }}>
//       <Group justify="space-between">
//         <Text>{input.option.value}</Text>
//         <Text size="sm" c="dimmed">
//           {item.unit}
//         </Text>
//       </Group>
//       <Text size="xs" c="dimmed">
//         {item.description}
//       </Text>
//     </Stack>
//   );
// };

// const optionsFilter: OptionsFilter = ({ search, limit }) => {
//   const splittedSearch = search.toLowerCase().trim().split(" ");

//   return (payItems as PayItem[])
//     .filter((option) => {
//       const words = option.description.toLowerCase().trim().split(" ");
//       return splittedSearch.every(
//         (searchWord) =>
//           option.itemNumber.includes(searchWord) ||
//           words.some((word) => word.includes(searchWord))
//       );
//     })
//     .slice(0, limit)
//     .map((val) => ({ label: val.itemNumber, value: val.itemNumber }));
// };

export default function AppPage() {
  const form = useForm<Invoice>({
    initialValues: {
      sections: [],
    },
    mode: "controlled",
  });

  console.log(form.values.sections);

  return (
    <Box mx="lg" my="xl">
      <Title ta="center">Create cost estimations</Title>
      <Container mt="xl">
        <FormProvider form={form}>
          <Stack>
            {form.values.sections.map((section, sectionIndex) => {
              return (
                <Paper p="lg" key={section.code}>
                  <Stack gap="xs">
                    <Text size="lg" fw={500}>
                      {section.code} - {section.name}
                    </Text>
                    <Table>
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
                        {section.items.map(({ code }, itemIndex) => {
                          return (
                            <AddedItem
                              key={code}
                              section={sectionIndex}
                              item={itemIndex}
                            />
                          );
                        })}
                        <Table.Tr key="add-item">
                          <Table.Td colSpan={3}>
                            <ItemSelector categoryCode={section.code} />
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
                              section.items.reduce(
                                (prev, curr) =>
                                  (curr.quantity ?? 0) * (curr.unitPrice ?? 0) +
                                  prev,
                                0
                              )
                            )}
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tfoot>
                    </Table>
                  </Stack>
                </Paper>
              );
            })}
            <Paper p="lg" key="add-section">
              <SectionSelector />
            </Paper>
          </Stack>
        </FormProvider>
      </Container>
    </Box>
  );
}
