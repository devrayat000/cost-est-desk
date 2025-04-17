import {
  Table,
  Stack,
  Text,
  Container,
  Box,
  Title,
  Paper,
  NumberFormatter,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import SectionSelector from "./components/section-selector";
import ItemSelector from "./components/item-selector";
import AddedItem from "./components/added-item";
import { FormProvider, Invoice } from "./components/form";
import TotalCost from "./components/total";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { formAtom } from "./store";
import { PDFViewer } from "@react-pdf/renderer";
import PrintingDocument from "@/components/menu/pdf";

export default function AppPage() {
  const form = useForm<Invoice>({
    initialValues: {
      sections: [],
    },
    mode: "controlled",
  });

  const setForm = useSetAtom(formAtom);

  // form.watch("sections", ({ value }) => setForm(value));
  useEffect(() => {
    setForm(form.values.sections);
  }, [form.values]);

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
                            <NumberFormatter
                              prefix="$ "
                              value={section.items.reduce(
                                (prev, curr) =>
                                  (curr.quantity ?? 0) * (curr.unitPrice ?? 0) +
                                  prev,
                                0
                              )}
                              thousandSeparator
                              fixedDecimalScale
                              decimalScale={2}
                            />
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tfoot>
                    </Table>
                  </Stack>
                </Paper>
              );
            })}
            <TotalCost />
            <Paper p="lg" key="add-section">
              <SectionSelector />
            </Paper>
          </Stack>
        </FormProvider>
        {/* <Paper radius={0}>
          <PDFViewer style={{ width: "100%", height: "50vh" }}>
            <PrintingDocument />
          </PDFViewer>
        </Paper> */}
      </Container>
    </Box>
  );
}
