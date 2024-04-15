import { Box, Button, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import styled from "styled-components";
import { useAuth } from "@/components/services/app-services/auth/auth-provider";
import WorkspaceIcon from "../../icons/workspace-icon";
import stc from "string-to-color";
import Avatar from "@/components/layout/avatar/avatar";
import { useState } from "react";

const LeftBar = () => {
  const menuItems = ["Personal", "Favourites", "Shared", "Recent", "Trash"];
  const workspaceIcons = ["Workspace #1", "Workspace #2", "Workspace #3"];

  const { userMetadata, authService } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    authService.logOut();
  };

  return (
    <>
      <Paper
        sx={{ backgroundColor: "transparent", cursor: "pointer" }}
        data-type="user-profile"
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", gap: "9px", alignItems: "center" }}>
          <Avatar username={userMetadata?.username!} size="large" />

          <Box>{userMetadata?.username}</Box>
        </Box>
      </Paper>

      <Menu
        id="user-profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem sx={{ minWidth: "215px" }} onClick={handleSignOut}>
          Sign Out
        </MenuItem>
      </Menu>

      <Paper
        title="Workspaces"
        sx={{ flexDirection: "column", gap: "3px !important" }}
      >
        <MenuWrapper>
          {menuItems.map((item, i) => (
            <Box sx={{ width: "100%" }} key={i}>
              <Button
                color="secondary"
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
                startIcon={<MailIcon />}
              >
                {item}
              </Button>
            </Box>
          ))}
        </MenuWrapper>
      </Paper>

      <Paper title="Workspaces" sx={{ flexDirection: "column" }}>
        <WidgetHeader>
          <IconButton>
            <WorkspaceIcon />
          </IconButton>

          <Box style={{ fontWeight: "500" }}>Workspaces</Box>
        </WidgetHeader>

        <MenuWrapper>
          {workspaceIcons.map((item, i) => (
            <Box sx={{ width: "100%", paddingLeft: "16px" }} key={i}>
              <Button
                color="secondary"
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
                startIcon={<CircleIcon color={stc(i)} />}
              >
                {item}
              </Button>
            </Box>
          ))}
        </MenuWrapper>

        <Button variant="contained" color="primary" size="large">
          + New workspace
        </Button>
      </Paper>
    </>
  );
};

const CircleIcon = styled.div<{ color: string }>`
  min-width: 6px;
  width: 6px;
  height: 6px;
  min-height: 6px;

  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 3px;

  &&&&& {
    &,
    & * {
      font-size: 12px;
      color: #333333;
    }
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;

  column-gap: 10px;
`;

export const AvatarCss = styled.div`
  min-width: 36px;
  width: 36px;
  height: 100%;
  position: relative;
  border-radius: 13.5px;
  background-color: #333333;
  height: 36px;
`;

export default LeftBar;
