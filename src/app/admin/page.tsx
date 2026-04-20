import type { Metadata } from "next";
import { PaginaDashboardAdmin } from "@/modulos/admin";

export const metadata: Metadata = {
  title: "Resumen",
};

export default function PaginaAdmin() {
  return <PaginaDashboardAdmin />;
}
