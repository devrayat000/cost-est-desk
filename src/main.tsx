import { createRoot } from "react-dom/client";
import AppRoutes from "./routes";

createRoot(document.getElementById("root") as HTMLElement).render(
  <AppRoutes location={location} />
);
