import { createMarkupSvg } from "../markup-3d-service/utils/create-markup-svg";
import { toScreenXY } from "../markup-3d-service/utils/to-screen-xy";
import ProjectService from "../project-service/project-service";
import { getPointer } from "./utils/get-pointer";

class PendingMarkup3DService {
  private _svgCanvas: HTMLElement | null = null;
  private _enabled: boolean;

  private _viewer: any;
  private _canvas: HTMLCanvasElement | null;

  private _pendingMarkup: SVGElement | null = null;

  private _position: any;

  private _is3DPlacing: boolean; // status of the markup placement

  private $setMarkupPosition: any;

  constructor(private _projectService: ProjectService) {
    this._enabled = true;
    this._viewer = null;
    this._canvas = null;

    this._svgCanvas = document.getElementById("markup_3d_layer");
    this._pendingMarkup = null;

    this._is3DPlacing = false;

    this._enable(true);
  }

  /**
   * Enables or disables the pending markup functionality, including event listeners and markup visualization.
   * @param {boolean} flag - Indicates whether to enable (true) or disable (false) the service.
   */
  private _enable(flag: boolean) {
    const projectService = this._projectService;
    const globalStatesService = projectService.globalStatesService;
    const activeCommentService = projectService.activeCommentService;

    const viewer = projectService.viewerServiceAggr.viewer;
    if (!viewer) return;
    this._viewer = viewer;
    this._canvas = viewer.canvas;

    this._enabled = flag;
    globalStatesService.toggleCommentAdding(flag);

    if (this._enabled) {
      this._is3DPlacing = true;

      activeCommentService.deselectComment();

      this._addPendingMarkup();
      this._setupEventListeners();

      viewer.toolController.activateTool("measure");
    } else {
      this._removePendingMarkup();
      this._removeCameraChangedListener();
      this._removeEventListeners();

      viewer.toolController.deactivateTool("measure");
    }

    viewer.impl.invalidate(true);
  }

  /**
   * Adds an SVG element to the DOM to represent the pending markup.
   */
  private _addPendingMarkup() {
    if (!this._pendingMarkup) {
      this._pendingMarkup = createMarkupSvg(1, "pending");
      this._svgCanvas!.appendChild(this._pendingMarkup);
    }
  }

  /**
   * Removes the SVG element used as the pending markup from the DOM.
   */
  private _removePendingMarkup() {
    if (this._pendingMarkup) {
      this._svgCanvas!.removeChild(this._pendingMarkup);
      this._pendingMarkup = null;
    }
  }

  /**
   * Handles mouse move events to update the position of the pending markup based on the current pointer location.
   * @param {MouseEvent} event - The mouse event triggered by moving the mouse.
   */
  private mouseMove = (event: any) => {
    const THREE = (window as any).THREE;

    if (!this._enabled) return;

    const pointer = getPointer(event, this._canvas);
    const ray = new THREE.Ray();
    this._viewer.impl.viewportToRay(pointer, ray);
    const rayIntersect = this._viewer.impl.rayIntersect(ray, true, null);

    const measureTool = this._viewer.loadedExtensions["Autodesk.Measure"];
    const snapper = measureTool.measureTool.getSnapper();
    const snapResult = snapper.getSnapResult();

    const geomVertex = snapResult.geomVertex;

    if (geomVertex) {
      const { intersectPoint } = snapResult;
      const screenPos = this._viewer.worldToClient(intersectPoint);

      // Show and position the HTML circle
      const pendingMarkup = this._pendingMarkup;
      if (pendingMarkup) {
        pendingMarkup.style.transform = `translate(${screenPos.x}px, ${
          screenPos.y - 27
        }px)`;
        pendingMarkup.style.pointerEvents = "none";
        pendingMarkup.style.display = "block";
      }
    } else {
      const pendingMarkup = this._pendingMarkup;
      if (pendingMarkup) {
        pendingMarkup.style.display = "none";
      }
    }
  };

  /**
   * Handles mouse down events to finalize the placement of a new markup based on the current pointer location.
   * @param {MouseEvent} event - The mouse event triggered by clicking the mouse button.
   */
  private mouseDown = (event: any) => {
    this._viewer.toolController.deactivateTool("measure");

    const THREE = (window as any).THREE;

    const pointer = getPointer(event, this._canvas);
    const ray = new THREE.Ray();
    this._viewer.impl.viewportToRay(pointer, ray);
    const rayIntersect = this._viewer.impl.rayIntersect(ray, true, null);

    if (rayIntersect) {
      const { intersectPoint } = rayIntersect;

      const { x, y, z } = intersectPoint;
      this._position = { x, y, z };

      this._is3DPlacing = false;

      this._removeEventListeners();
      this._addCameraChangedListener();
      this._rerenderMarkupPosition();

      this._projectService.globalStatesService.toggleCommentPointSelected(true);
    } else {
      this.dispose();
    }
  };

  /**
   * Updates the visual position of the pending markup based on the latest 3D intersection point.
   */
  private _rerenderMarkupPosition = () => {
    const pendingMarkup = this._pendingMarkup;
    const position = this._position;

    const { x, y } = toScreenXY(
      position,
      this._viewer.getCamera(),
      this._canvas!
    );

    this.$setMarkupPosition({ x, y });

    pendingMarkup!.style.transform = `translate(${x}px, ${y - 27}px)`;
  };

  /**
   * Registers camera change event listeners to ensure the pending markup's position updates correctly.
   */
  private _addCameraChangedListener() {
    const Autodesk = (window as any).Autodesk;

    this._viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this._rerenderMarkupPosition
    );
  }

  /**
   * Removes camera change event listeners to prevent unnecessary updates when the service is disabled.
   */
  private _removeCameraChangedListener() {
    const Autodesk = (window as any).Autodesk;

    this._viewer.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this._rerenderMarkupPosition
    );
  }

  /*
   * Sets up necessary event listeners for interactive behavior during the markup placement process.
   */
  private _setupEventListeners() {
    this._canvas!.addEventListener("mousemove", this.mouseMove);
    this._canvas!.addEventListener("mousedown", this.mouseDown);
  }

  /**
   * Removes event listeners previously set up for interactive markup behavior.
   */
  private _removeEventListeners() {
    this._canvas!.removeEventListener("mousemove", this.mouseMove);
    this._canvas!.removeEventListener("mousedown", this.mouseDown);
  }

  /**
   * Saves the currently placed markup as a comment with associated metadata.
   * @param {string} comment - The text content of the comment to be saved.
   */
  public saveComment = async (comment: string) => {
    const position = this._position;
    const projectService = this._projectService;
    const supabase = this._projectService.supabase;

    const authService = projectService.authService;
    const userMetadata = authService.userMetadata;

    if (!position) {
      console.error("Cannot add comment without a markup position.");

      return;
    }

    try {
      const { data, error } = await supabase.from("comments").insert([
        {
          content: comment,
          markup_position: position,
          project_id: projectService!.id,
          author_id: userMetadata!.id,
        },
      ]);

      if (error) throw error;

      console.log("Comment added:", data);
    } catch (error) {
      console.error("Error inserting comment:", error);
    }

    this._projectService.markup3DService.toggleAddComment(false);
  };

  public get is3DPlacing() {
    return this._is3DPlacing;
  }

  public provideStates(states: any) {
    this.$setMarkupPosition = states.setMarkupPosition;
  }

  public dispose() {
    this.$setMarkupPosition(null);

    this._enable(false);
  }
}

export default PendingMarkup3DService;
