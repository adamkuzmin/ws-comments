import PaperCanvas from "@/components/paper/paper";
import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { useGlobalStates } from "@/components/services/project-services/global-states-service/global-states-provider";
import { Box } from "@mui/material";
import styled from "styled-components";

const ViewStateMode = () => {
  const { isPaperMode, isPaperEditing } = useActiveComment();

  if (!isPaperMode) return null;

  return (
    <>
      <FloatingWrapper
        data-mode={isPaperMode && isPaperEditing ? "edit" : "workspace"}
      >
        <Darkarea />
        <Darkarea />
        <Darkarea />
        <Darkarea />
        <Box sx={{ border: "2px solid black" }}></Box>
        <Darkarea />
        <Darkarea />
        <Darkarea />
        <Darkarea />
      </FloatingWrapper>

      {isPaperMode && !isPaperEditing && (
        <FloatingWrapper data-type="draw">
          <PaperCanvas />
        </FloatingWrapper>
      )}
    </>
  );
};

const FloatingWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;

  &&[data-mode="edit"] {
    pointer-events: none;
  }

  &&[data-mode="edit"],
  &&[data-mode="workspace"] {
    display: grid;

    grid-template-columns: 5px auto 5px;
    grid-template-rows: 58px auto 5px;
  }

  &&[data-mode="draw"] {
    display: flex;
  }
`;

const Darkarea = styled.div`
  background: rgba(0, 0, 0, 0.5);
`;

export default ViewStateMode;
