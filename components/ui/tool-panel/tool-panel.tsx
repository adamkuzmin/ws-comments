import { Box, IconButton, Paper } from "@mui/material";
import CursorIcon from "../icons/cursor-icon";
import CommentIcon from "../icons/comment-icon";
import PencilIcon from "../icons/pencil-icon";
import MeasureIcon from "../icons/measure-icon";
import SecondaryToolPanel from "./blocks/secondary-tool-panel/secondary-tool-panel";
import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { useMarkup3D } from "@/components/services/project-services/markup-3d-service/markup-3d-provider";
import { useMarkup2D } from "@/components/services/project-services/markup-2d-service/markup-2d-provider";

const ToolPanel = () => {
  const { commentAdding, globalStatesService } = useGlobalStates();
  const { markup3DService, measureEnabled } = useMarkup3D();
  const { markup2DService } = useMarkup2D();

  const { isPaperMode, isPaperEditing, viewType, activeCommentService } =
    useActiveComment();

  return (
    <Box sx={{ position: "relative" }}>
      <SecondaryToolPanel />

      <Paper sx={{ display: "flex", gap: "6px", minWidth: "max-content" }}>
        {!isPaperMode && (
          <>
            <IconButton data-active="true">
              <CursorIcon />
            </IconButton>

            <IconButton
              data-active={commentAdding ? "true" : "false"}
              onClick={() => {
                markup3DService.toggleAddComment();
              }}
            >
              <CommentIcon />
            </IconButton>

            <IconButton
              data-active={measureEnabled ? "true" : "false"}
              onClick={() => {
                markup3DService.toggleMeasure(true);
              }}
            >
              <MeasureIcon />
            </IconButton>
          </>
        )}

        {isPaperMode && !isPaperEditing && (
          <>
            <IconButton data-active="true">
              <CursorIcon />
            </IconButton>

            {/* <IconButton
              data-active={viewType === "assembled" ? "true" : "false"}
              onClick={() => activeCommentService.toggleViewType("assembled")}
            >
              <FormatListBulletedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <IconButton
              data-active={viewType === "exploded" ? "true" : "false"}
              onClick={() => activeCommentService.toggleViewType("exploded")}
            >
              <AutoAwesomeMotionOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton> */}

            <IconButton
              data-active={commentAdding ? "true" : "false"}
              onClick={() => {
                markup2DService.toggleAddComment();
              }}
            >
              <CommentIcon />
            </IconButton>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ToolPanel;
