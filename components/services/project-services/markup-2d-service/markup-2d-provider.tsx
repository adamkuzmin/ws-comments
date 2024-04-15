import { createContext, use, useContext, useEffect, useState } from "react";
import Markup2DService from "./markup-2d-service";
import { useProject } from "../project-service/project-provider";
import { useActiveComment } from "../active-comment-service/active-comment-provider";
import hotkeys from "hotkeys-js";
import { PointXY } from "../active-comment-service/active-comment-service";

interface Markup2DContentProps {
  markup2DService: Markup2DService;
  markupPosition: PointXY | null;
}

const Markup2DContext = createContext<Markup2DContentProps | undefined>(
  undefined
);

export function Markup2DProvider({ children }: any) {
  const { activeCommentService } = useActiveComment();
  const { projectService } = useProject();

  const markup2DService = projectService.markup2DService;

  const [markupPosition, setMarkupPosition] = useState<null | PointXY>(null);
  useEffect(() => {
    markup2DService.provideStates({
      setMarkupPosition,
    });
  }, []);

  useEffect(() => {
    const hotKeyString = "esc";
    const hotKeyCallback = (event: KeyboardEvent, handler: any) => {
      event.preventDefault();
      switch (handler.key) {
        case "esc":
          markup2DService.toggleAddComment(false);
          break;
        default:
          break;
      }
    };

    hotkeys(hotKeyString, hotKeyCallback);
    return () => hotkeys.unbind(hotKeyString, hotKeyCallback);
  }, []);

  return (
    <Markup2DContext.Provider
      value={{
        markup2DService,
        markupPosition,
      }}
    >
      {children}
    </Markup2DContext.Provider>
  );
}

export function useMarkup2D() {
  const context = useContext(Markup2DContext);
  if (!context) {
    throw new Error("useMarkup2D must be used within a Markup2DProvider");
  }
  return context;
}
