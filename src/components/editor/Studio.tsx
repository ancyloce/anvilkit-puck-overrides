"use client";
import * as React from "react";
import { Puck, Drawer } from "@puckeditor/core";
import type { Config, Data, Overrides,  } from "@puckeditor/core";
import { puckOverrides } from "../overrides/index";
import "@puckeditor/core/puck.css";

export interface StudioProps {
  // Required Puck props
  config: Config;
  data: Data;
  onPublish: (data: Data) => void;

  // Optional Puck pass-through props
  onChange?: (data: Data) => void;
  ui?: Record<string, unknown>;
  onAction?: (action: unknown, appState: unknown) => void;

  // Override escape hatches — consumer-provided keys win over defaults
  overrideExtensions?: Partial<Overrides>;

  // Studio shell customization
  headerSlot?: React.ReactNode;
  drawerHeaderSlot?: React.ReactNode;
  className?: string;
}

export function Studio({
  config,
  data,
  onPublish,
  onChange,
  ui,
  onAction,
  overrideExtensions,
  className,
}: StudioProps) {
  // Merge: consumer overrideExtensions win over puckOverrides defaults
  const mergedOverrides: Partial<Overrides> = React.useMemo(
    () => ({ ...puckOverrides, ...overrideExtensions }),
    [overrideExtensions]
  );

  return (
    <div className={className}>
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
        onChange={onChange}
        overrides={mergedOverrides}
      >
      </Puck>
    </div>
  );
}
