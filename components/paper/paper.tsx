import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { useActiveComment } from "../services/project-services/active-comment-service/active-comment-provider";
import useAnnotationDrawing from "./hooks/use-annotation-drawing";
import useCanvasSetup from "./hooks/use-canvas-setup";
import ExplodedCommentLayout from "./blocks/exploded-comment-layout/exploded-comment-layout";

const PaperCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { isPaperMode } = useActiveComment();

  const [commentBBoxes, setCommentBBoxes] = useState<
    Map<string, paper.Rectangle>
  >(new Map());

  /**
   * Sets up and resizes the canvas based on its parent container.
   * Initializes Paper.js on the canvas and adjusts its size on window resize.
   */
  useCanvasSetup(canvasRef, parentRef, setCommentBBoxes);

  /**
   * Manages drawing annotations on a Paper.js canvas in pen mode.
   * Handles mouse events for creating and modifying paths.
   */
  useAnnotationDrawing(canvasRef);

  if (!isPaperMode) return null;

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          position: "fixed",
          overflow: "hidden",
          top: 0,
          left: 0,
          zIndex: 20,
        }}
        ref={parentRef}
      >
        <canvas className="paper-canvas" ref={canvasRef} />
      </Box>

      <ExplodedCommentLayout {...{ commentBBoxes }} />
    </>
  );
};

// Create a new Paper.js tool for drawing
/* const tool = new Tool();

    tool.onMouseDown = (event: paper.ToolEvent) => {
      const hitResult = paper.project.hitTest(event.point, {
        stroke: true,
        segments: true,
        tolerance: 20,
      });

      if (hitResult && hitResult.item) {
        hitResult.item.selected = !hitResult.item.selected;
        path = null;
      } else {
        path = new Path({
          segments: [event.point],
          strokeColor: "red",
          strokeWidth: 4,
          fullySelected: false,
        });
      }
    };

    tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (path) {
        path.add(event.point);
      }
    };

    tool.onMouseUp = () => {
      if (path && viewer) {
        path.simplify(10);
      }
    }; */

export default PaperCanvas;
