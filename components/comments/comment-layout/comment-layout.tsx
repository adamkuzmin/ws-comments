import React from "react";

import { useComment } from "../../services/project-services/comment-service/comment-provider";
import { Box, IconButton, Paper } from "@mui/material";
import PlusIcon from "@/components/ui/icons/plus-icon";
import CommentsIcon from "@/components/ui/icons/comments-icon";
import MessageItem from "./blocks/comment/comment";
import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import { CommentList, Header, List } from "./comment-layout.styled";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { useMarkup3D } from "@/components/services/project-services/markup-3d-service/markup-3d-provider";

const CommentsBlock: React.FC = () => {
  const { comments } = useComment();
  const { activeCommentService } = useActiveComment();
  const { markup3DService } = useMarkup3D();
  const { isCommentsPanelOpen } = useGlobalStates();

  if (!isCommentsPanelOpen) return null;

  return (
    <Paper sx={{ flexDirection: "column" }}>
      {/* Header */}
      <Header>
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <IconButton>
            <CommentsIcon />
          </IconButton>

          <div>Comments</div>
        </Box>

        <Box>
          <IconButton
            data-type="exception"
            data-add="comment"
            onClick={() => markup3DService.toggleAddComment()}
          >
            <PlusIcon />
          </IconButton>
        </Box>
      </Header>

      <CommentList>
        <List>
          {comments
            .filter((comment) => !comment.parent_id)
            .map((comment, i) => (
              <MessageItem
                {...comment}
                selectComment={() =>
                  activeCommentService.selectComment(comment.id)
                }
                key={comment.id}
              />
            ))}
        </List>
      </CommentList>
    </Paper>
  );
};

export default CommentsBlock;
