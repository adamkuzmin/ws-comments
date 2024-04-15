import { useViewer } from "@/components/forge/viewer-provider";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import { supabase } from "@/components/supabase-client";
import CommentIcon from "@/components/ui/icons/comment-icon";
import FitIcon from "@/components/ui/icons/fir-icon";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { useEffect, useMemo } from "react";

const SecondaryToolPanel = () => {
  const { commentAdding, commentPointSelected, globalStatesService } =
    useGlobalStates();

  const { activeCommentService, activeComment, isPaperMode, isPaperEditing } =
    useActiveComment();
  const { viewer } = useViewer();

  const isCommentPointAdding = useMemo(
    () => commentAdding && !commentPointSelected,
    [commentAdding, commentPointSelected]
  );

  const isCommentNeedsViewAdjustment = useMemo(
    () => activeComment && !activeComment.view_state && !isPaperEditing,
    [activeComment, isPaperEditing]
  );

  const saveView = async () => {
    if (!activeComment) return;

    const viewState = viewer.getState({ viewport: true });

    try {
      await supabase
        .from("comments")
        .update({ view_state: viewState })
        .eq("id", activeComment.id);
    } catch (error) {
      console.error("Error updating comment:", error);
    }

    activeCommentService.togglePaperMode(false);
  };

  if (!isCommentPointAdding && !isCommentNeedsViewAdjustment && !isPaperEditing)
    return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "-6px",
        left: "50%",
        transform: "translate(-50%, -100%)",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          gap: "18px",
          minWidth: "max-content",
          alignItems: "center",
        }}
      >
        {isCommentPointAdding && (
          <>
            <IconButton data-active="true">
              <CommentIcon />
            </IconButton>

            <Box>
              Tap a model surface, or edge to add <b>Comment</b>
            </Box>
          </>
        )}

        {isCommentNeedsViewAdjustment && (
          <>
            <IconButton data-active="true">
              <FitIcon />
            </IconButton>

            <Box>
              <b>Adjust View</b> for Comment, then add <b>replies</b> and{" "}
              <b>annotations.</b>
            </Box>

            <Button
              onClick={() => activeCommentService.togglePaperMode(true)}
              size={"small"}
              variant="contained"
              color="primary"
            >
              Adjust View
            </Button>
          </>
        )}

        {isPaperEditing && (
          <>
            <IconButton data-active="true">
              <FitIcon />
            </IconButton>

            <Box>
              Once you finish, click <b>Save View</b>
            </Box>

            <Button
              onClick={() => saveView()}
              size={"small"}
              variant="contained"
              color="primary"
            >
              Save View
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SecondaryToolPanel;
