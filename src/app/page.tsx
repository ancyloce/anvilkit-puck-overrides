import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-6 font-sans dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AnvilKit Puck Overrides
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          A complete Puck Editor UI override system built on{" "}
          <strong>Shadcn UI</strong> and <strong>Tailwind CSS</strong>. Every
          editor surface — header, drawer, canvas, fields — is replaced with
          accessible, themeable components.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/editor"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Open Editor Demo →
        </Link>
        <a
          href="https://github.com/ancyloce/anvilkit-puck-overrides"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          View on GitHub
        </a>
      </div>

      <section className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Layout Overrides",
            items: ["EditorHeader", "EditorDrawer", "DrawerItem", "EditorOutline"],
          },
          {
            title: "Canvas Overrides",
            items: ["CanvasIframe", "CanvasPreview", "ComponentOverlay", "ActionBar"],
          },
          {
            title: "Field Overrides",
            items: [
              "FieldWrapper (fieldLabel)",
              "TextInput",
              "NumberInput",
              "SelectInput",
              "RadioInput",
              "ArrayInput",
              "RichtextInput",
            ],
          },
        ].map((section) => (
          <div
            key={section.title}
            className="rounded-lg border bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
