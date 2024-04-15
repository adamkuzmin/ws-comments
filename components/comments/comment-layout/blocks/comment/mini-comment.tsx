import { Comment } from "@/components/services/project-services/comment-service/comment-service";
import { Paper } from "@mui/material";

const MiniComment: React.FC<Comment> = ({ content, id }) => {
  return (
    <Paper sx={{ width: "max-content", maxWidth: "max-content" }}>
      {content}
    </Paper>
  );
};

export default MiniComment;
