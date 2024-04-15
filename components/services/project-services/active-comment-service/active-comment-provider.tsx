import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/components/supabase-client";
import ActiveCommentService, { PointXY } from "./active-comment-service";
import { useGlobalStates } from "../global-states-service/global-states-provider";
import { useComment } from "../comment-service/comment-provider";
import { Comment } from "../comment-service/comment-service";
import hotkeys from "hotkeys-js";
import { useViewer } from "@/components/forge/viewer-provider";
import { useProject } from "../project-service/project-provider";

interface ActiveCommentContentProps {
  activeCommentService: ActiveCommentService;
  activeComment: Comment | null;
  activeCommentPosition: PointXY | null;
  isPaperMode: boolean;
  isPaperEditing: boolean;
  isPenMode: boolean;
  childComments: Comment[];
  annotation: any[];
  viewType: "assembled" | "exploded";
  markup2d: PointXY | null;
}

const ActiveCommentContext = createContext<
  ActiveCommentContentProps | undefined
>(undefined);

export function ActiveCommentProvider({ children }: any) {
  const { projectService } = useProject();
  const { commentLogId } = useComment();
  const { viewer } = useViewer();

  const [activeCommentService] = useState(
    () => projectService.activeCommentService
  );

  // Comment-related States
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const [activeCommentPosition, setActiveCommentPosition] =
    useState<PointXY | null>(null);

  const [isPaperMode, setIsPaperMode] = useState(false);
  const [isPaperEditing, setIsPaperEditing] = useState(false);

  const [childComments, setChildComments] = useState<Comment[]>([]);

  const [isPenMode, setIsPenMode] = useState(false);
  const [annotation, setAnnotation] = useState<any[]>([]);
  const [markup2d, setMarkup2d] = useState<PointXY | null>(null);

  const [viewType, setViewType] = useState<"assembled" | "exploded">(
    "assembled"
  );

  useEffect(() => {
    if (!viewer) return;

    activeCommentService.provideStates({
      setActiveComment,
      setActiveCommentPosition,
      setIsPaperMode,
      setIsPaperEditing,
      setIsPenMode,
      setChildComments,
      setAnnotation,
      viewer,
      setViewType,
      setMarkup2d,
    });
    activeCommentService.init();

    return () => {
      activeCommentService.dispose();
    };
  }, [viewer]);

  useEffect(() => {
    activeCommentService.checkActiveComment();
  }, [commentLogId]);

  useEffect(() => {
    if (isPenMode) {
      const hotKeyString = "esc, enter, p"; // Added 'p' to the hotkey string
      const hotKeyCallback = (event: KeyboardEvent, handler: any) => {
        event.preventDefault();
        switch (handler.key) {
          case "esc":
            activeCommentService.togglePenMode(false);
            break;
          case "enter":
            activeCommentService.togglePenMode(false);
            break;
          case "p": // Added case for 'p' key
            activeCommentService.togglePenMode(false);
            break;
          default:
            break;
        }
      };

      hotkeys(hotKeyString, hotKeyCallback);
      return () => hotkeys.unbind(hotKeyString, hotKeyCallback);
    } else {
      const hotkeyString = "p";

      const hotkeyCallback = (event: KeyboardEvent, handler: any) => {
        event.preventDefault();
        switch (handler.key) {
          case "p":
            activeCommentService.togglePenMode(true);
            break;
          default:
            break;
        }
      };

      hotkeys(hotkeyString, hotkeyCallback);
      return () => hotkeys.unbind(hotkeyString, hotkeyCallback);
    }
  }, [isPenMode]);

  return (
    <ActiveCommentContext.Provider
      value={{
        activeCommentService,
        activeComment,
        activeCommentPosition,
        isPaperMode,
        isPaperEditing,
        isPenMode,
        childComments,
        annotation,
        viewType,
        markup2d,
      }}
    >
      {children}
    </ActiveCommentContext.Provider>
  );
}

export function useActiveComment() {
  const context = useContext(ActiveCommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
}
