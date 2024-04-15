import { transformPointToNormalizedCoords } from "../active-comment-service/utils/point-2-normalized-coord";
import { createMarkupSvg } from "../markup-3d-service/utils/create-markup-svg";
import ProjectService from "../project-service/project-service";

class PendingMarkup2DService {
  private _id: string;

  private _svgCanvas: HTMLElement | null = null;
  private _enabled: boolean;

  private _canvas: HTMLElement | null;

  private _pendingMarkup: SVGElement | null = null;

  private _position: any;

  private _is2DPlacing: boolean; // status of the markup placement

  private $setMarkupPosition: any;

  constructor(private _projectService: ProjectService) {
    this._id = this._projectService.activeCommentService.activeComment!.id;

    this._enabled = true;

    this._canvas = document.getElementsByClassName(
      "paper-canvas"
    )[0] as HTMLElement;

    this._svgCanvas = document.getElementById("markup_2d_layer");
    this._pendingMarkup = null;

    this._is2DPlacing = false;

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

    this._enabled = flag;
    globalStatesService.toggleCommentAdding(flag);

    if (this._enabled) {
      this._is2DPlacing = true;

      this._addPendingMarkup();
      this._setupEventListeners();
    } else {
      this._removePendingMarkup();
      this._removeEventListeners();
    }
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
  private mouseMove = (event: MouseEvent) => {
    if (this._is2DPlacing && this._pendingMarkup) {
      const { clientX, clientY } = event;
      const { left, top } = this._svgCanvas!.getBoundingClientRect();

      const offsetX = clientX - left;
      const offsetY = clientY - top;

      this._pendingMarkup.style.transform = `translate(${offsetX}px, ${
        offsetY - 27
      }px)`;
      this._pendingMarkup.style.pointerEvents = "none";
    }
  };

  /**
   * Handles mouse down events to finalize the placement of a new markup based on the current pointer location.
   * @param {MouseEvent} event - The mouse event triggered by clicking the mouse button.
   */
  private mouseDown = (event: any) => {
    this.mouseMove(event);

    const { clientX, clientY } = event;
    this._position = transformPointToNormalizedCoords(
      { x: clientX, y: clientY },
      this._canvas
    );

    this._is2DPlacing = false;

    this._removeEventListeners();

    this.$setMarkupPosition({ x: clientX, y: clientY });

    this._projectService.globalStatesService.toggleCommentPointSelected(true);
  };

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

  public provideStates(states: any) {
    this.$setMarkupPosition = states.setMarkupPosition;
  }

  /**
   * Saves the currently placed markup as a comment with associated metadata.
   * @param {string} comment - The text content of the comment to be saved.
   */
  public saveComment = async (comment: string) => {
    const authService = this._projectService.authService;
    const projectService = this._projectService;
    const activeCommentService = projectService.activeCommentService;
    const supabase = this._projectService.supabase;

    const position = this._position;
    const annotation = activeCommentService.annotation;
    const userMetadata = authService.userMetadata;
    const activeComment = activeCommentService.activeComment;

    try {
      const { data, error } = await supabase.from("comments").insert([
        {
          content: comment,
          markup_position: null,
          project_id: projectService!.id,
          author_id: userMetadata!.id,
          parent_id: activeComment!.id,
          annotation: annotation.length ? annotation : null,
          markup_position_2d: position,
        },
      ]);

      if (error) throw error;

      console.log("Comment added:", data);
    } catch (error) {
      console.error("Error inserting comment:", error);
    }

    activeCommentService.saveAnnotation([]); // Clear the annotation after submission
    activeCommentService.togglePenMode(false); // Disable pen mode after submission

    this._projectService.markup2DService.toggleAddComment(false);
  };

  public get id() {
    return this._id;
  }

  public dispose() {
    this.$setMarkupPosition(null);

    this._enable(false);

    this._removeEventListeners();
  }
}

export default PendingMarkup2DService;
