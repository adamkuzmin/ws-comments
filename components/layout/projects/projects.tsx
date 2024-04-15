import styled from "styled-components";
import LeftPanel from "../left-panel/left-panel";

interface ProjectsLayoutProps {
  children?: React.ReactNode;
}

const ProjectsLayout: React.FC<ProjectsLayoutProps> = ({ children }) => {
  return (
    <Wrapper>
      <LeftPanel />

      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  position: relative;

  display: flex;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  row-gap: 16px;
`;

export default ProjectsLayout;
