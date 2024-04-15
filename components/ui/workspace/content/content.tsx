import styled from "styled-components";
import WorkspaceItem from "../workspace-item/workspace-item";
import { Box, InputBase, Paper } from "@mui/material";
import { AvatarCss } from "../left-bar/left-bar";
import { useWorkspace } from "@/components/services/workspace-services/workspace/workspace-provider";

const Content = () => {
  const { projects } = useWorkspace();

  return (
    <Wrapper>
      <Paper sx={{ opacity: 0, pointerEvents: "none" }}>
        <Box sx={{ display: "flex", gap: "9px", alignItems: "center" }}>
          <AvatarCss style={{ cursor: "pointer" }} />
        </Box>
      </Paper>

      <Box sx={{ width: "100%" }}>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            p: "0px !important",
            maxWidth: "270px",
          }}
        >
          <InputBase
            sx={{
              flex: 1,
              border: "0px solid #e0e0e0",
              borderRadius: "9px",
              height: "33px",
              fontSize: "12px",
              padding: "0 10px",
            }}
            placeholder="Search..."
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>
      </Box>

      <CatalogWrapper>
        {projects.map((project, i) => (
          <WorkspaceItem key={i} data={project} />
        ))}
      </CatalogWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 18px;
`;

const CatalogWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 27px;
`;

export default Content;
