import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ExplorerService, {
  ExplorerItem,
  FileItem,
  FolderItem,
  ProjectItem,
} from "../explorer-service/explorer-service";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import ProjectsLayout from "@/components/layout/projects/projects";

import FolderIcon from "@mui/icons-material/Folder";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

const ExplorerCore = () => {
  const router = useRouter();
  const { project_id, folder_id } = router.query;

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [data, setData] = useState<ExplorerItem[]>([]);

  const [explorerService] = useState<ExplorerService>(
    () => new ExplorerService()
  );

  useEffect(() => {
    if (!router?.isReady) return;

    explorerService.provideStates({
      project_id,
      folder_id,
      setStatus,
      setData,
    });

    explorerService.init();
  }, [router?.isReady, project_id, folder_id]);

  return (
    <>
      <ProjectsLayout>
        {/* Mui Button */}
        <Button
          style={{ maxWidth: "max-content" }}
          variant="text"
          onClick={() => router.push("/projects")}
        >
          {"To Projects"}
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    if (item.disabled) return;

                    if (item.type === "items") {
                      const link = await explorerService.getViewerLink(item);
                      router.push(link);
                    } else {
                      router.push(item.link);
                    }
                  }}
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "16px",
                        opacity: item.disabled ? 0.5 : 1,
                        cursor: item.disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      {item.type === "folders" ? (
                        <FolderIcon />
                      ) : item.type === "items" ? (
                        <ViewInArIcon />
                      ) : (
                        ""
                      )}

                      <div>{item.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  {/* Add more table cells for other properties */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ProjectsLayout>
    </>
  );
};

export default ExplorerCore;
