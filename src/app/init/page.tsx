import {
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  PinInput,
  Stack,
} from "@mantine/core";
import classes from "./styles.module.css";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { store } from "@/lib/utils";
import { migrateDb, seedData } from "@/lib/db";
import { closeInit } from "@/lib/backend";

export default function InitPage() {
  const form = useForm({
    initialValues: {
      productKey: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync: validateAsync, isPending } = useMutation({
    mutationKey: ["product-key-validation"],
    mutationFn: async ({ productKey }: { productKey: string }) => {
      if (import.meta.env.PROD) {
        const { default: mNumbers } = await import("@/assets/mNumbers.json");
        return mNumbers;
      }

      const response = await fetch(
        "http://localhost:3000/api/product/validate",
        {
          method: "POST",
          body: JSON.stringify({ productKey }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Invalid product key");
      }

      return response.json();
    },
    async onSuccess(data, variables) {
      await store.set("productKey", variables.productKey);
      await store.save();
      await queryClient.setQueryData(["product-data"], data);
      console.log("Data saved to store");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await migrateDb();
      console.log("Database migrated");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await seedData(data);
      console.log("Data seeded to database");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await closeInit();
      //   navigate("./downloadData", { state: data });
    },
  });
  console.log({ isPending });

  const validateProductKey = form.onSubmit((data) => validateAsync(data));

  return (
    <Container size="sm" style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ type: "dots" }}
      />
      <Stack align="stretch" justify="center" h="100svh">
        {/* @ts-ignore */}
        <Stack gap="xl" component="form" onSubmit={validateProductKey}>
          <Input.Wrapper>
            <Input.Label>Enter your activation key</Input.Label>
            <PinInput
              size="xs"
              length={20}
              gap={0}
              classNames={{ pinInput: classes.pinInput }}
              key={form.key("productKey")}
              {...form.getInputProps("productKey")}
            />
          </Input.Wrapper>
          <Group justify="flex-end">
            <Button type="reset" color="red" fullWidth={false}>
              Cancel
            </Button>
            <Button type="submit" color="green" fullWidth={false}>
              Activate
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Container>
  );
}
