import { BrowserRouter as Router, Routes, Route, Location } from "react-router";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/client";
import { Provider, getDefaultStore } from "jotai";

import InitPage from "./app/init/page";
import DownloadDataPage from "./app/init/downloadData/page";
import AppPage from "./app/app/page";

export default function AppRoutes({
  location,
}: {
  location?: string | Partial<Location<any>>;
}) {
  return (
    <Router>
      <Provider store={getDefaultStore()}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <Routes location={location}>
              <Route path="/app">
                <Route index element={<AppPage />} />
              </Route>
              <Route path="/init">
                <Route index element={<InitPage />} />
                <Route path="downloadData" element={<DownloadDataPage />} />
              </Route>
            </Routes>
          </MantineProvider>
        </QueryClientProvider>
      </Provider>
    </Router>
  );
}
