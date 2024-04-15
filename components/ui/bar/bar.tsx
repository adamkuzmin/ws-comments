import { AddOutlined, Settings } from "@mui/icons-material";
import { Box, IconButton, Paper } from "@mui/material";
import styled from "styled-components";
import SettingsIcon from "../icons/settings-icon";
import CommentsIcon from "../icons/comments-icon";
import SettingsPanel from "./blocks/settings-panel/settings-panel";
import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import DynamicTitle from "./blocks/dynamic-title/dynamic-title";

const Bar = () => {
  const { globalStatesService, isSettingsPanelOpen, isCommentsPanelOpen } =
    useGlobalStates();

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <SettingsPanel />

        <Paper sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              columnGap: "9px",
              height: "100%",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <Logo
              onClick={() => {
                window.location.href = "/";
              }}
            />

            <TitleWrapper style={{ width: "100%", display: "flex" }}>
              <DynamicTitle />
            </TitleWrapper>
          </Box>

          <Box sx={{ display: "flex", columnGap: "6px" }}>
            <IconButton
              onClick={() => globalStatesService.toggleCommentsPanel()}
              data-active={isCommentsPanelOpen ? "true" : "false"}
            >
              <CommentsIcon />
            </IconButton>

            <IconButton
              onClick={() => globalStatesService.toggleSettingsPanel()}
              data-active={isSettingsPanelOpen ? "true" : "false"}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

const Logo = styled.div`
  position: relative;
  min-width: 27px;
  width: 27px;
  height: 27px;

  border-radius: 50%;
  background-color: #f00;

  cursor: pointer;
`;

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  font-weight: 500;
  font-size: 15px;
`;

const TitleWrapper = styled.div`
  border: 1px solid transparent;
  display: flex;
  overflow: hidden;

  &:hover {
    border-color: #333333;
  }
`;

export default Bar;
