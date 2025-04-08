import { invoke } from "@tauri-apps/api/core";
import { LazyStore } from "@tauri-apps/plugin-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

async function get_env(name: string): Promise<string> {
  return await invoke("get_env", { name });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DATABASE_URL = await get_env("DATABASE_URL");
export const STORE_URL = await get_env("STORE_URL");

export const store = new LazyStore(STORE_URL);
