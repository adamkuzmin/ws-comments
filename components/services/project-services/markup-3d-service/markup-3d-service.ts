import { Comment } from "../comment-service/comment-service";
import PendingMarkup3DService from "../pending-markup-3d-service/pending-markup-3d-service";
import ProjectService from "../project-service/project-service";
import { createMarkupSvg } from "./utils/create-markup-svg";
import { toScreenXY } from "./utils/to-screen-xy";
import { v4 as uuidv4 } from "uuid";

class Markup3DService {
  private _svgCanvas: HTMLElement | null = null;
  private _viewer: any;
  private _camera: any;

  private _uuid: string;

  private _commentMarkups: Map<string, Markup3D>;

  private _isAddingComment: boolean;
  private _pendingMarkupService: PendingMarkup3DService | null;

  private $states: any;

  private _enabled: boolean;

  private _measureEnabled: boolean;

  private $setMeasureEnabled: any;

  constructor(private _projectService: ProjectService) {
    this._enabled = false;

    this._uuid = uuidv4();

    this._svgCanvas = document.getElementById("markup_3d_layer");

    this._commentMarkups = new Map();

    this._isAddingComment = false;
    this._pendingMarkupService = null;

    this._measureEnabled = false;

    this.updateMarkups = this.updateMarkups.bind(this);
    this._addMarkup = this._addMarkup.bind(this);
    this._updateMarkup = this._updateMarkup.bind(this);
    this._deleteMarkup = this._deleteMarkup.bind(this);
    this._onCameraChange = this._onCameraChange.bind(this);

    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.toggleTransparentMarkup = this.toggleTransparentMarkup.bind(this);
    this.toggleAddComment = this.toggleAddComment.bind(this);
    this.toggleMeasure = this.toggleMeasure.bind(this);
  }

  /**
   * Updates the positions and existence of markups based on the current state of comments.
   */
  public updateMarkups() {
    if (!this._viewer || !this._svgCanvas) return;

    const comments = this._projectService.commentService.comments;

    // Filter comments
    const filteredComments = Array.from(comments.values()).filter(
      (comment) => !comment.parent_id && comment.markup_position
    );

    // Determine actions for each comment
    const toAdd: Comment[] = [];
    const toUpdate: Comment[] = [];
    const toDelete = new Map(this._commentMarkups);

    filteredComments.forEach((comment) => {
      const existingMarkup = this._commentMarkups.get(comment.id);
      if (existingMarkup) {
        // If the comment already has a markup, check if it needs to be updated
        if (
          JSON.stringify(existingMarkup.position) !==
          JSON.stringify(comment.markup_position)
        ) {
          toUpdate.push(comment);
        }
        toDelete.delete(comment.id);
      } else {
        // If the comment does not have a markup, it needs to be added
        toAdd.push(comment);
      }
    });

    // Add new markups
    toAdd.forEach((comment) => {
      this._addMarkup(comment);
    });

    // Update existing markups
    toUpdate.forEach((comment) => {
      this._updateMarkup(comment);
    });

    // Delete removed markups
    toDelete.forEach((markup, id) => {
      this._deleteMarkup(id);
    });

    this._onCameraChange();
  }

  /**
   * Adds a new markup to the canvas based on a given comment.
   * @param comment - The comment to add a markup for.
   */
  private _addMarkup(comment: Comment) {
    const newMarkup = {
      id: comment.id,
      index: 2,
      position: comment.markup_position!,
      svg: createMarkupSvg(comment.author_username, "default"),
    };
    this._commentMarkups.set(comment.id, newMarkup);

    const activeCommentService = this._projectService.activeCommentService;
    newMarkup.svg.addEventListener("click", () =>
      activeCommentService.selectComment(comment.id)
    );

    this._svgCanvas?.appendChild(newMarkup.svg);
  }

  /**
   * Updates the position of an existing markup based on its corresponding comment.
   * @param comment - The comment whose markup needs to be updated.
   */
  private _updateMarkup(comment: Comment) {
    const markupToUpdate = this._commentMarkups.get(comment.id);
    if (markupToUpdate) {
      markupToUpdate.position = comment.markup_position!;
    }
  }

  /**
   * Removes a markup from the canvas.
   * @param commentId - The ID of the comment whose markup needs to be removed.
   */
  private _deleteMarkup(commentId: string) {
    const markupToDelete = this._commentMarkups.get(commentId);
    if (markupToDelete) {
      markupToDelete.svg.remove(); // Assuming the markup has an 'svg' property that is an SVGElement
      this._commentMarkups.delete(commentId);
    }
  }

  /**
   * Adjusts markup positions based on the current camera view.
   */
  private _onCameraChange() {
    if (!this._viewer) return;

    this._commentMarkups.forEach((markup) => {
      const { x, y } = toScreenXY(
        markup.position,
        this._camera,
        this._viewer.canvas
      );

      markup.svg.setAttribute("transform", `translate(${x}, ${y - 27})`);
    });
  }

  /**
   * Clears all markups from the canvas.
   */
  private _clearMarkups() {
    this._commentMarkups.forEach((markup) => {
      this._deleteMarkup(markup.id);
    });
  }

  /**
   * Initializes the service with a given viewer.
   * @param viewer - The viewer instance to be used by the service.
   */
  public provideViewer(viewer: any) {
    this._viewer = viewer;
    this._camera = viewer.getCamera();
    this._svgCanvas = document.getElementById("markup_3d_layer");

    this.updateMarkups();

    this._addEventListeners();
  }

  /**
   * Sets up event listeners for camera changes and window resizing.
   */
  private _addEventListeners() {
    const Autodesk = (window as any).Autodesk;

    this._viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this._onCameraChange
    );

    window.addEventListener("resize", this._onCameraChange);

    this._onCameraChange();
  }

  /**
   * Toggles the addition of a new comment and its corresponding markup.
   * @param v - Optional boolean flag to explicitly set the toggle state.
   */
  public toggleAddComment(v?: boolean) {
    this._isAddingComment = v ?? !this._isAddingComment;

    if (this._isAddingComment) {
      this.toggleMeasure(false);

      if (this._pendingMarkupService) return; // Already adding a comment

      this._pendingMarkupService = new PendingMarkup3DService(
        this._projectService
      );

      this._pendingMarkupService.provideStates(this.$states);
    } else {
      this._pendingMarkupService?.dispose();
      this._pendingMarkupService = null;
    }
  }

  public toggleMeasure(v: boolean) {
    if (this._measureEnabled === v) return;

    const viewer = this._viewer;

    if (v) {
      this.toggleAddComment(false);
      viewer.toolController.activateTool("measure");

      this.$setMeasureEnabled(true);
    } else {
      const measureTool = viewer.toolController.getTool("measure");
      measureTool.deleteMeasurements();

      viewer.toolController.deactivateTool("measure");

      this.$setMeasureEnabled(false);
    }

    this._measureEnabled = v;
  }

  public provideStates(states: any) {
    this.$setMeasureEnabled = states.setMeasureEnabled;

    this.$states = states;
  }

  public get pendingMarkupService() {
    return this._pendingMarkupService;
  }

  public toggleEnabled(enabled?: boolean) {
    if (this._enabled === enabled) return;

    if (enabled !== undefined) {
      this._enabled = enabled;
    } else {
      this._enabled = !this._enabled;
    }

    if (this._enabled) {
      this.updateMarkups();
    } else {
      this.dispose();
    }
  }

  public toggleTransparentMarkup(v: boolean) {
    if (v) {
      const activeCommentService = this._projectService.activeCommentService;
      const activeComment = activeCommentService.activeComment;

      this._commentMarkups.forEach((markup) => {
        if (!activeComment || markup.id === activeComment.id) return;

        markup.svg.style.opacity = "0.3";
        markup.svg.style.filter = "grayscale(100%)";
      });
    } else {
      this._commentMarkups.forEach((markup) => {
        markup.svg.style.opacity = "1";
        markup.svg.style.filter = "none";
      });
    }
  }

  public dispose() {
    this._enabled = false;
    this._clearMarkups();

    this._measureEnabled = false;

    const Autodesk = (window as any).Autodesk;

    this._viewer?.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this._onCameraChange
    );

    this._pendingMarkupService?.dispose();
    this._pendingMarkupService = null;
  }
}

interface Markup3D {
  id: string;
  position: { x: number; y: number; z: number };
  svg: SVGElement;
}

export default Markup3DService;
