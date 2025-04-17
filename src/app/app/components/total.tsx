import { Box, Group, NumberFormatter, Text } from "@mantine/core";
import { useMemo } from "react";
import { useFormContext } from "./form";

export default function TotalCost() {
  const form = useFormContext();

  const total = useMemo(() => {
    return form.values.sections.reduce((acc, section) => {
      return (
        acc +
        section.items.reduce((acc, item) => {
          return acc + (item.unitPrice ?? 0) * (item.quantity ?? 0);
        }, 0)
      );
    }, 0);
  }, [form.values.sections]);

  return (
    <Box>
      <Group justify="space-between">
        <Text>Total Cost</Text>
        <Text fw="bold">
          <NumberFormatter
            prefix="$ "
            value={total}
            thousandSeparator
            fixedDecimalScale
            decimalScale={2}
          />
        </Text>
      </Group>
    </Box>
  );
}
