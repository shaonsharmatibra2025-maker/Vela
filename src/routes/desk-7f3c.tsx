import { createFileRoute } from "@tanstack/react-router";
import { DeskApp } from "@/components/desk-panel";

export const Route = createFileRoute("/desk-7f3c")({
  head: () => ({
    meta: [
      { title: "Vela" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DeskApp,
});
