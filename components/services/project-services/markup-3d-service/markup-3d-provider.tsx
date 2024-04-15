import { createContext, use, useContext, useEffect, useState } from "react";
import Markup3DService from "./markup-3d-service";
import { useProject } from "../project-service/project-provider";
import { useActiveComment } from "../active-comment-service/active-comment-provider";
import hotkeys from "hotkeys-js";
import { PointXY } from "../active-comment-service/active-comment-service";

interface Markup3DContentProps {
  markup3DService: Markup3DService;
  markupPosition: PointXY | null;
  measureEnabled: boolean;
}

const Markup3DContext = createContext<Markup3DContentProps | undefined>(
  undefined
);

export function Markup3DProvider({ children }: any) {
  const { activeCommentService } = useActiveComment();
  const { projectService } = useProject();

  const markup3DService = projectService.markup3DService;

  const [markupPosition, setMarkupPosition] = useState<null | PointXY>(null);
  const [measureEnabled, setMeasureEnabled] = useState(false);

  useEffect(() => {
    markup3DService.provideStates({
      setMarkupPosition,
      setMeasureEnabled,
    });
  }, []);

  useEffect(() => {
    const hotKeyString = "esc";
    const hotKeyCallback = (event: KeyboardEvent, handler: any) => {
      event.preventDefault();
      switch (handler.key) {
        case "esc":
          markup3DService.toggleAddComment(false);
          activeCommentService.togglePaperMode(false);
          break;
        default:
          break;
      }
    };

    hotkeys(hotKeyString, hotKeyCallback);
    return () => hotkeys.unbind(hotKeyString, hotKeyCallback);
  }, []);

  return (
    <Markup3DContext.Provider
      value={{
        markup3DService,
        markupPosition,
        measureEnabled,
      }}
    >
      {children}
    </Markup3DContext.Provider>
  );
}

export function useMarkup3D() {
  const context = useContext(Markup3DContext);
  if (!context) {
    throw new Error("useMarkup3D must be used within a Markup3DProvider");
  }
  return context;
}
