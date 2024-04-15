import ProjectService from "../project-service/project-service";
import hotkeys from "hotkeys-js";
import { v4 as uuidv4 } from "uuid";

class HotkeyService {
  private _uuid: string;

  constructor(private _projectService: ProjectService) {
    this._uuid = uuidv4();

    this.updateCommentBindings = this.updateCommentBindings.bind(this);
    this._add3DComment = this._add3DComment.bind(this);
    this._add2DComment = this._add2DComment.bind(this);

    this.updateCommentBindings();
  }

  public updateCommentBindings() {
    const activeCommentService = this._projectService.activeCommentService;
    const isPaperMode = activeCommentService.isPaperMode;
    const isPaperEditing = activeCommentService.isPaperEditing;

    if (isPaperMode && isPaperEditing) {
      this._unbind2DCommentAdding();
      this._unbind3DCommentAdding();
    } else if (isPaperMode && !isPaperEditing) {
      this._unbind3DCommentAdding();
      this._bind2DCommentAdding();
    } else {
      this._unbind2DCommentAdding();
      this._bind3DCommentAdding();
    }
  }

  private _bind3DCommentAdding() {
    console.log("Binding 3D comment adding hotkeys", this._uuid);

    hotkeys("c, C", this._add3DComment);
  }

  private _unbind3DCommentAdding() {
    console.log("Unbinding 3D comment adding hotkeys", this._uuid);

    hotkeys.unbind("c, C", this._add3DComment);
  }

  private _bind2DCommentAdding() {
    hotkeys("c, C", this._add2DComment);
  }

  private _unbind2DCommentAdding() {
    hotkeys.unbind("c, C", this._add2DComment);
  }

  private _add3DComment(event: KeyboardEvent, handler: any) {
    event.preventDefault();

    console.log("sdfsdf");

    const markup3DService = this._projectService.markup3DService;
    markup3DService.toggleAddComment(true);
  }

  private _add2DComment(event: KeyboardEvent, handler: any) {
    event.preventDefault();

    const markup2DService = this._projectService.markup2DService;
    markup2DService.toggleAddComment(true);
  }

  public dispose() {
    console.log("dispose hotkey service");

    this._unbind2DCommentAdding();
    this._unbind3DCommentAdding();
  }
}

export default HotkeyService;
