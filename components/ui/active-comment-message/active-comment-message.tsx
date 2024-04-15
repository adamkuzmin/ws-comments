import { useAuth } from "@/components/services/app-services/auth/auth-provider";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { useProject } from "@/components/services/project-services/project-service/project-provider";
import { supabase } from "@/components/supabase-client";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import PencilIcon from "../icons/pencil-icon";
import styled from "styled-components";

const ActiveCommentMessage = () => {
  const [comment, setComment] = useState("");
  const {
    activeComment,
    activeCommentService,
    isPenMode,
    isPaperMode,
    markup2d,
  } = useActiveComment();

  const { userMetadata } = useAuth();
  const { projectService } = useProject();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const annotation = activeCommentService.annotation;

    try {
      const { data, error } = await supabase.from("comments").insert([
        {
          content: comment,
          markup_position: null,
          project_id: projectService!.id,
          author_id: userMetadata!.id,
          parent_id: activeComment!.id,
          annotation: annotation.length ? annotation : null,
          markup_position_2d: markup2d,
        }, // Assuming 'content' is the column name
      ]);

      if (error) throw error;

      console.log("Comment added:", data);
      setComment(""); // Reset the input field after successful submission
    } catch (error) {
      console.error("Error inserting comment:", error);
    }

    activeCommentService.saveAnnotation([]); // Clear the annotation after submission
    activeCommentService.togglePenMode(false); // Disable pen mode after submission
    setComment("");
  };

  return (
    <Wrapper style={{ backgroundColor: "white", borderRadius: "9px" }}>
      <Box
        component="form"
        sx={{ p: 2, borderTop: 1, borderColor: "divider", flexShrink: 0 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          placeholder="Write a comment..."
          multiline
          fullWidth
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          required
          margin="normal"
        />

        <Box sx={{ display: "flex", gap: "9px" }}>
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>

          {activeComment?.view_state && isPaperMode && (
            <IconButton
              data-active={isPenMode ? "true" : "false"}
              onClick={() => activeCommentService.togglePenMode(true)}
            >
              <PencilIcon />
            </IconButton>
          )}
        </Box>
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

export default ActiveCommentMessage;
