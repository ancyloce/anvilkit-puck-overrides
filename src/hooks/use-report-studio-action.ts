"use client";

import * as React from "react";
import type { StudioHeaderAction } from "@/lib/studio/studio-action.types";
import { usePuckSelector } from "@/lib/use-puck-selector";
import { useStudioActionHandler } from "@/store/studio-actions";

export function useReportStudioAction() {
  const onHeaderAction = useStudioActionHandler();
  const puckData = usePuckSelector((state) => state.appState.data);

  return React.useCallback(
    (type: StudioHeaderAction["type"]) => {
      onHeaderAction?.({ type, data: puckData });
    },
    [onHeaderAction, puckData],
  );
}
