import type { Data } from "@puckeditor/core";

export type StudioActionHandler = (data: Data) => void | Promise<void>;

export interface StudioHeaderAction {
  type:
    | "undo"
    | "redo"
    | "save-draft"
    | "publish"
    | "open-share"
    | "open-collaborators"
    | "export-json"
    | "toggle-theme";
  data: Data;
}
