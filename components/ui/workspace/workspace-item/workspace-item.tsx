import { Box, Paper } from "@mui/material";
import styled from "styled-components";
import Link from "next/link";
import React from "react";
import { Project } from "@/components/types/supabase-data.types";
import Avatar from "@/components/layout/avatar/avatar";

interface WorkspaceItemProps {
  data: Project;
}

const CatalogItem: React.FC<WorkspaceItemProps> = ({ data }) => {
  const handleNavigate = (e: any) => {
    e.preventDefault(); // Prevent default link behavior
    window.location.href = `/viewer/${data.bim_urn}`; // Navigate with a full page reload
  };

  const userprojects = data.userprojects;

  return (
    <Wrapper onClick={handleNavigate}>
      <Paper
        sx={{ padding: "0px", overflow: "hidden", border: "1px solid grey" }}
      >
        <Thumb style={{ backgroundImage: `url(${data.thumbnail})` }}></Thumb>
      </Paper>

      <Box
        sx={{
          display: "flex",
          columnGap: "18px",
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 18px 4px 18px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <Box>{data.title}</Box>
          <Box>Modified 12 hours ago</Box>
        </Box>

        <Box sx={{ display: "flex" }} data-type="users">
          {userprojects.map((userproject, i) => (
            <Avatar
              key={i}
              username={userproject?.username || ""}
              size={"small"}
            />
          ))}
        </Box>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 9px;
  position: relative;
  height: max-content;

  cursor: pointer;

  border: 1px solid transparent;
  border-radius: 8px;

  &:hover {
    & {
      background-color: #e4e2df;
      border: 1px solid #999999;
    }
  }

  & [data-type="users"] {
    & > * {
      margin-left: -8px;
    }
  }
`;

const Thumb = styled.div`
  width: 100%;
  padding-bottom: 50%;
  background: white;
  position: relative;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const Ava = styled.div<{
  color: string;
}>`
  min-width: 27px;
  max-width: 27px;
  min-height: 27px;
  max-height: 27px;

  border-radius: 50%;

  background-color: ${({ color }) => color};
  margin-left: -8px;
`;

export default CatalogItem;
