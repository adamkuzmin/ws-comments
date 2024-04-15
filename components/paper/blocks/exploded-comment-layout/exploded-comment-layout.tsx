import MiniComment from "@/components/comments/comment-layout/blocks/comment/mini-comment";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { Box } from "@mui/material";
import paper from "paper";

interface ExplodedCommentLayoutProps {
  commentBBoxes: Map<string, paper.Rectangle>;
}

const ExplodedCommentLayout: React.FC<ExplodedCommentLayoutProps> = ({
  commentBBoxes,
}) => {
  const { activeCommentService, viewType } = useActiveComment();

  if (viewType !== "exploded") return null;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "fixed",
        overflow: "hidden",
        pointerEvents: "none",
        top: 0,
        left: 0,
        zIndex: 21,
      }}
    >
      {Array.from(commentBBoxes.entries()).map(([key, bbox], i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            left: `${bbox.x}px`,
            top: `${bbox.y}px`,
            width: `${bbox.width}px`,
            height: `${bbox.height}px`,
            //backgroundColor: "rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              transform: "translateX(-100%)",
              pointerEvents: "all",
              width: "max-content",
              maxWidth: "max-content",
            }}
          >
            {activeCommentService.childComments.get(key) && (
              <MiniComment
                {...(activeCommentService.childComments.get(key) as any)}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ExplodedCommentLayout;
