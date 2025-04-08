import { createFormContext } from "@mantine/form";

interface PayCategory {
  code: string;
  name: string;
  items: InvoiceItem[];
}

interface PayItem {
  code: string;
  description: string;
  unit: string;
}

export interface InvoiceItem extends PayItem {
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  sections: PayCategory[];
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<Invoice>();
