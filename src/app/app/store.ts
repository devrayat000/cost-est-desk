import { atom } from "jotai";
import { PayCategory } from "./components/form";

export const formAtom = atom<PayCategory[]>([]);
