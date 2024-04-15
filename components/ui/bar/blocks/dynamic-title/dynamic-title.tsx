import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { InputBase } from "@mui/material";
import { useProject } from "@/components/services/project-services/project-service/project-provider";

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;

  font-weight: 500;
  font-size: 15px;

  &:hover {
    border-color: #333333;
  }

  &.editing .MuiInputBase-root {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    font-weight: 500;
    font-size: 15px;
    max-height: 20px;
  }
`;

const DynamicTitle = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [_title, setTitle] = useState("Default title");
  const inputRef = useRef<HTMLInputElement>(null);

  const { projectService, title } = useProject();
  useEffect(() => {
    setTitle(title);
  }, [title]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleInputBlur = () => {
    projectService.updateMetadata({ title: _title });
    setIsEditing(false);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      projectService.updateMetadata({ title: _title });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Title className={isEditing ? "editing" : ""} onClick={handleTitleClick}>
      {isEditing ? (
        <InputBase
          inputRef={inputRef}
          value={_title}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      ) : (
        title
      )}
    </Title>
  );
};

export default DynamicTitle;
