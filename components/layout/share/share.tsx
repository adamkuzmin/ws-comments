import { Box, Button } from "@mui/material";
import styled from "styled-components";
import ShareIcon from "@/components/ui/icons/share-icon";
import { useAuth } from "@/components/services/app-services/auth/auth-provider";
import Avatar from "../avatar/avatar";
import { useProject } from "@/components/services/project-services/project-service/project-provider";

const Share = () => {
  const { userMetadata } = useAuth();
  const { projectUsers } = useProject();

  return (
    <Box sx={{ display: "flex", columnGap: "9px" }}>
      <Box sx={{ display: "flex" }}>
        {projectUsers.map((projectUser, i) => (
          <Box key={i} sx={{ marginLeft: "-6px" }}>
            <Avatar username={projectUser.username} size="large" />
          </Box>
        ))}
      </Box>

      <Button
        sx={{ minWidth: "97px" }}
        color="primary"
        variant="contained"
        startIcon={<ShareIcon />}
      >
        Share
      </Button>
    </Box>
  );
};

export default Share;
