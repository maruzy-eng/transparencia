"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/transparency/types";

interface DeletePropertyDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePropertyDialog({
  property,
  open,
  onOpenChange,
}: DeletePropertyDialogProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!property) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/properties/${property.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });

        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        if (!response.ok) {
          throw new Error("Não foi possível excluir o imóvel.");
        }

        window.location.href = "/admin/properties";
      } catch {
        window.location.href = `/admin/properties?error=${encodeURIComponent("Erro ao excluir imóvel.")}`;
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir imóvel</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>{property?.name}</strong>? Esta ação remove também fases,
            atualizações e mídia vinculadas. Não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Excluindo..." : "Excluir imóvel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
