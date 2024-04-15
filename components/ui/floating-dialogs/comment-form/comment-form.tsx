import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import { Paper } from "@mui/material";
import { useMarkup3D } from "@/components/services/project-services/markup-3d-service/markup-3d-provider";
import { useMarkup2D } from "@/components/services/project-services/markup-2d-service/markup-2d-provider";
import { PointXY } from "@/components/services/project-services/active-comment-service/active-comment-service";
import Markup3DService from "@/components/services/project-services/markup-3d-service/markup-3d-service";
import Markup2DService from "@/components/services/project-services/markup-2d-service/markup-2d-service";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import PencilIcon from "../../icons/pencil-icon";
import PlusIcon from "../../icons/plus-icon";

export const FloatingComment = () => {
  const { markupPosition: markupPosition3D, markup3DService } = useMarkup3D();
  const { markupPosition: markupPosition2D, markup2DService } = useMarkup2D();

  if (!markupPosition3D && !markupPosition2D) return <></>;

  if (markupPosition3D)
    return (
      <CommentForm
        markupPosition={markupPosition3D}
        markupService={markup3DService}
      />
    );

  if (markupPosition2D)
    return (
      <CommentForm
        markupPosition={markupPosition2D}
        markupService={markup2DService}
      />
    );

  return <></>;
};

const CommentForm: React.FC<{
  markupPosition: PointXY;
  markupService: Markup3DService | Markup2DService;
}> = ({ markupPosition, markupService }) => {
  const { commentAdding, commentPointSelected } = useGlobalStates();

  if (!(commentAdding && commentPointSelected)) return <></>;

  return (
    <Paper
      sx={{
        position: "absolute",
        minWidth: "250px",
        maxWidth: "250px",
        display: "flex",
        padding: "4px !important",
        left: `${markupPosition.x + 27 + 10}px`,
        top: `${markupPosition.y - 27}px`,
        flexDirection: "column",
        pointerEvents: "all",
      }}
    >
      <CommentMessage markupService={markupService} />
    </Paper>
  );
};

const CommentMessage: React.FC<{
  markupService: Markup3DService | Markup2DService;
}> = ({ markupService }) => {
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { commentAdding, commentPointSelected } = useGlobalStates();

  const { activeComment, isPaperMode, isPenMode, activeCommentService } =
    useActiveComment();

  useEffect(() => {
    if (commentAdding && commentPointSelected) {
      inputRef.current?.focus();
    }
  }, [commentAdding, commentPointSelected]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    markupService.pendingMarkupService?.saveComment(comment);
    setComment("");
  };

  if (!(commentAdding && commentPointSelected)) return <></>;

  return (
    <Wrapper>
      <Box
        component="form"
        sx={{
          margin: `0px !important`,
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <TextField
            placeholder="Write a comment..."
            multiline
            fullWidth
            autoFocus
            minRows={1}
            maxRows={4}
            size="small"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="standard"
            required
            margin="normal"
            inputRef={inputRef}
          />

          {activeComment?.view_state && isPaperMode && (
            <IconButton
              data-active={isPenMode ? "true" : "false"}
              onClick={() => activeCommentService.togglePenMode(true)}
            >
              <PencilIcon />
            </IconButton>
          )}
        </Box>

        <IconButton
          sx={{ backgroundColor: "#FAE57E" }}
          type="submit"
          data-type="exception"
          data-add="comment"
        >
          <PlusIcon />
        </IconButton>
      </Box>
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  &&&& {
    &,
    & * {
      font-size: 12px;
    }
  }

  z-index: 4;

  & form.MuiBox-root {
    padding: 0px;
    border-color: rgba(0, 0, 0, 0);

    & .MuiFormControl-root {
      margin-top: 0px;
      margin-bottom: 0px;

      & .MuiInputBase-root {
        &::before {
          display: none;
        }

        &::after {
          display: none;
        }
      }
    }
  }
`;

export default FloatingComment;
