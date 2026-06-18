import type { Metadata } from "next";
import { MockupBuilderAdminClient } from "./client";

export const metadata: Metadata = {
  title: "Nova Merch Mockup Builder (Admin)",
};

export default function MockupBuilderAdminPage() {
  return <MockupBuilderAdminClient />;
}
