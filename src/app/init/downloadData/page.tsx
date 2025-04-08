import { download } from "@tauri-apps/plugin-upload";
import { dataDir, join } from "@tauri-apps/api/path";
import { Container, Progress, Stack } from "@mantine/core";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function DownloadDataPage() {
  const { state } = useLocation();
  const {
    data: { dataFile },
  } = useQuery({
    queryKey: ["product-data"],
    initialData: state,
    queryFn: ({ client, queryKey }) => client.getQueryData(queryKey),
  });
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const dir = await dataDir();
      const dataDownloadFile = await join(dir, "mamu.json");
      console.log("Download started", `http://localhost:3000/${dataFile}`);
      await download(
        `http://localhost:3000${dataFile}`,
        dataDownloadFile,
        ({ progress, total }) => {
          const downloadProgress = (progress / total) * 100;
          setDownloadProgress(downloadProgress);
          if (downloadProgress == 100) {
            console.log("Download successful");
          }
        }
      );
      console.log("Download successful, promise resolved");
    })();

    return () => {};
  }, [dataFile]);

  return (
    <Container size="sm">
      <Stack align="stretch" justify="center" h="100svh">
        <Stack gap="xl" component="form">
          <Progress value={downloadProgress} animated />
        </Stack>
      </Stack>
    </Container>
  );
}
