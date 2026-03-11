"use client";

import React from "react";
import { Studio } from "@/components/puck-editor/Studio";
import { Config, Data } from "@measured/puck";

// ─── Demo Puck config ──────────────────────────────────────────────────────
const demoConfig: Config = {
  components: {
    Hero: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        variant: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
          ],
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Centre", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        paddingY: { type: "number", min: 0, max: 200, step: 4 },
      },
      defaultProps: {
        title: "Hello World",
        subtitle: "Welcome to the Shadcn-powered Puck editor.",
        variant: "default",
        alignment: "center",
        paddingY: 64,
      },
      render: ({ title, subtitle, variant, alignment, paddingY }) => (
        <section
          className={`w-full px-8 ${
            variant === "dark"
              ? "bg-zinc-900 text-white"
              : variant === "light"
              ? "bg-zinc-50 text-zinc-900"
              : "bg-white text-zinc-900"
          }`}
          style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        >
          <div
            className={`mx-auto max-w-3xl ${
              alignment === "left"
                ? "text-left"
                : alignment === "right"
                ? "text-right"
                : "text-center"
            }`}
          >
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="mt-4 text-lg text-inherit opacity-70">{subtitle}</p>
          </div>
        </section>
      ),
    },

    TextBlock: {
      fields: {
        content: { type: "textarea" },
        columns: {
          type: "select",
          options: [
            { label: "1 column", value: "1" },
            { label: "2 columns", value: "2" },
            { label: "3 columns", value: "3" },
          ],
        },
      },
      defaultProps: {
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        columns: "1",
      },
      render: ({ content, columns }) => (
        <div className="w-full px-8 py-12">
          <div
            className={`mx-auto max-w-3xl ${
              columns === "2"
                ? "columns-2"
                : columns === "3"
                ? "columns-3"
                : ""
            }`}
          >
            <p className="text-base leading-7 text-zinc-700">{content}</p>
          </div>
        </div>
      ),
    },

    Card: {
      fields: {
        heading: { type: "text" },
        body: { type: "textarea" },
        badge: { type: "text" },
        columns: {
          type: "radio",
          options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
          ],
        },
        items: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            description: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        heading: "Feature Card",
        body: "Description goes here.",
        badge: "New",
        columns: "1",
        items: [],
      },
      render: ({ heading, body, badge, items }) => (
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          {badge && (
            <span className="inline-block mb-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {badge}
            </span>
          )}
          <h2 className="text-xl font-semibold">{heading}</h2>
          <p className="mt-2 text-sm text-zinc-600">{body}</p>
          {items && items.length > 0 && (
            <ul className="mt-4 space-y-2">
              {(items as Array<{ label: string; description: string }>).map(
                (item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{item.label}</span>
                    {item.description && (
                      <span className="text-zinc-500 ml-1">
                        — {item.description}
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ),
    },
  },
};

const initialData: Data = {
  content: [
    {
      type: "Hero",
      props: {
        id: "hero-1",
        title: "Build with Puck + Shadcn UI",
        subtitle:
          "This editor uses the full Puck override API to replace every UI surface with Shadcn UI components.",
        variant: "default",
        alignment: "center",
        paddingY: 80,
      },
    },
    {
      type: "TextBlock",
      props: {
        id: "text-1",
        content:
          "Try dragging new components from the left drawer, editing their props in the right panel, and using the header toolbar to undo, redo, or switch viewports.",
        columns: "1",
      },
    },
  ],
  root: { props: {} },
};

export default function EditorDemoPage() {
  return (
    <Studio
      config={demoConfig}
      initialData={initialData}
      onPublish={(data) => {
        console.log("Published data:", JSON.stringify(data, null, 2));
        alert("Published! Check the browser console for the page data.");
      }}
    />
  );
}
