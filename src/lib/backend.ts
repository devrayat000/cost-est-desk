// These contents can be copy-pasted below the existing code, don't replace the entire file!!

import { invoke } from "@tauri-apps/api/core";

// Setup function
export async function closeInit() {
  console.log("Frontend setup task complete!");
  return invoke("close_init");
}
