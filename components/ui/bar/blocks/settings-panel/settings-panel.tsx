import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import { Box, Button, Paper } from "@mui/material";
import Thumbnail from "../thumbnail/thumbnail";

const SettingsPanel = () => {
  const { globalStatesService, isSettingsPanelOpen } = useGlobalStates();

  if (!isSettingsPanelOpen) return null;

  return (
    <Paper
      sx={{
        position: "absolute",
        right: "-5px",
        transform: "translateX(100%)",
        display: "flex",
        flexDirection: "column",
        minWidth: "200px",
      }}
    >
      <Thumbnail />

      <Box
        sx={{
          display: "flex",
          gap: "27px",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => globalStatesService.toggleSettingsPanel(false)}
          size={"small"}
          color={"secondary"}
        >
          Cancel
        </Button>

        <Button
          onClick={() => globalStatesService.toggleSettingsPanel(false)}
          size={"small"}
          variant="contained"
          color={"primary"}
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsPanel;
