import { useActiveComment } from "@/components/services/project-services/active-comment-service/active-comment-provider";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Path, Tool } from "paper";
import { transformPointToNormalizedCoords } from "@/components/services/project-services/active-comment-service/utils/point-2-normalized-coord";

/**
 * Manages drawing annotations on a Paper.js canvas in pen mode.
 * Handles mouse events for creating and modifying paths.
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef Reference to the canvas element.
 */
const useAnnotationDrawing = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const { isPenMode, activeCommentService } = useActiveComment();
  const [line, setLine] = useState<paper.Path | null>(null);

  useEffect(() => {
    if (!isPenMode) return;

    const tool = new Tool();

    tool.onMouseDown = (event: paper.ToolEvent) => {
      const path = new Path({
        segments: [event.point],
        strokeColor: "red",
        strokeWidth: 2,
        fullySelected: false,
        data: {
          drawnBy: "user2",
        },
      });

      setLine(path);
    };

    tool.onMouseDrag = (event: paper.ToolEvent) => line?.add(event.point);

    tool.onMouseUp = () => {
      if (line) {
        line.simplify(10);

        const formattedPoints: any[] = [];
        line.segments.forEach((segment) => {
          formattedPoints.push(
            transformPointToNormalizedCoords(segment.point, canvasRef.current!)
          );
        });

        activeCommentService.addAnnotationLine(formattedPoints);

        line.remove();
        setLine(null);
      }
    };

    return () => {
      tool.remove();
    };
  }, [isPenMode, line]);
};

export default useAnnotationDrawing;
