import * as React from "react";
import type { StudioHeaderAction } from "@/lib/studio/studio-action.types";

const StudioActionContext = React.createContext<
  ((action: StudioHeaderAction) => void) | undefined
>(undefined);

interface StudioActionProviderProps {
  children: React.ReactNode;
  onHeaderAction?: (action: StudioHeaderAction) => void;
}

export function StudioActionProvider({
  children,
  onHeaderAction,
}: StudioActionProviderProps) {
  return (
    <StudioActionContext.Provider value={onHeaderAction}>
      {children}
    </StudioActionContext.Provider>
  );
}

export function useStudioActionHandler() {
  return React.useContext(StudioActionContext);
}
