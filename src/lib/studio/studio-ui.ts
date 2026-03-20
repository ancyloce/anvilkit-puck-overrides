import type { UiState, Viewports } from "@puckeditor/core";

export const fullWidthPreviewViewports: Viewports = [
  {
    width: "100%",
    height: "auto",
  },
];

const defaultStudioViewportCurrent: UiState["viewports"]["current"] = {
  width: "100%",
  height: "auto",
};

const defaultStudioViewports: UiState["viewports"] = {
  controlsVisible: false,
  current: defaultStudioViewportCurrent,
  options: [],
};

const defaultStudioUi: Partial<UiState> = {
  viewports: defaultStudioViewports,
};

export function mergeStudioUi(ui?: Partial<UiState>): Partial<UiState> {
  const viewports = ui?.viewports;
  const currentViewport: UiState["viewports"]["current"] = {
    width: viewports?.current?.width ?? defaultStudioViewportCurrent.width,
    height: viewports?.current?.height ?? defaultStudioViewportCurrent.height,
  };
  const mergedViewports: UiState["viewports"] = {
    ...defaultStudioViewports,
    ...viewports,
    current: currentViewport,
    options: viewports?.options ?? defaultStudioViewports.options,
  };

  return {
    ...defaultStudioUi,
    ...ui,
    viewports: mergedViewports,
  };
}
