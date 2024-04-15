import styled from "styled-components";
import Bar from "../bar/bar";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const Layout = styled.div`
  width: 100vw;
  height: max-content;

  display: flex;
  flex-direction: column;
`;

export default Wrapper;
