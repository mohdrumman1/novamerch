import type { Metadata } from "next";
import { MockupBuilderClient } from "./client";

export const metadata: Metadata = {
  title: "Nova Merch Mockup Builder",
};

export default function MockupBuilderPage() {
  return <MockupBuilderClient />;
}
