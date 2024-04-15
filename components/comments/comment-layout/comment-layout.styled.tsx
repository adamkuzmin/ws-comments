import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .MuiIconButton-root[data-add="comment"] {
    background-color: #fae57e;
    border-radius: 50% !important;

    &:hover {
      background-color: #f9e05e;
    }
  }
`;

export const CommentList = styled.div`
  justify-content: flex-end;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;

  overflow-y: scroll;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: max-content;
`;
