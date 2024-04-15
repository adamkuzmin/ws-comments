import styled from "styled-components";
import Bar from "./bar/bar";
import CommentsBlock from "../comments/comment-layout/comment-layout";
import Share from "../layout/share/share";
import ToolPanel from "./tool-panel/tool-panel";
import ActiveCommentDialog from "./active-comment-dialog/active-comment-dialog";
import ViewStateMode from "./view-state-mode/view-state-mode";
import CommentForm from "./floating-dialogs/comment-form/comment-form";

const UIGrid = () => {
  return (
    <>
      <ViewStateMode />

      <FloatingWrapper>
        <CommentForm />
        <ActiveCommentDialog />
      </FloatingWrapper>

      <Wrapper>
        <Grid>
          <BarWrapper>
            <Bar />
            <Share />
          </BarWrapper>

          <ContentWrapper>
            <CommentsBlock />
          </ContentWrapper>

          <FooterWrapper>
            <ToolPanel />
          </FooterWrapper>
        </Grid>
      </Wrapper>
    </>
  );
};

// create wrapper where all inner children have position:absolute
const FloatingWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 4;
  top: 0;
  left: 0;

  pointer-events: none;
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  position: fixed;

  z-index: 5;

  display: flex;
  pointer-events: none;
`;

const Grid = styled.div`
  margin: 9px;
  width: 100%;

  display: grid;
  grid-template-rows: 45px auto 45px;
  grid-row-gap: 6px;

  & > * > * {
    pointer-events: all;
  }

  & > * > * {
    height: 100%;
  }
`;

const BarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  & > *:first-child {
    width: 100%;
    max-width: 250px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  & > *:first-child {
    width: 100%;
    max-width: 250px;
  }

  height: 100%;
  position: relative;
  overflow: hidden;
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default UIGrid;
