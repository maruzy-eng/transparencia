"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  UPDATE_TYPES,
  VISIBILITY_OPTIONS,
  updateTypeLabel,
  visibilityLabel,
} from "@/lib/admin/property-constants";
import { formatDate } from "@/lib/transparency/labels";
import type { PropertyUpdate } from "@/lib/transparency/types";

interface PropertyUpdatesEditorProps {
  propertyId: string;
  updates: PropertyUpdate[];
}

export function PropertyUpdatesEditor({
  propertyId,
  updates,
}: PropertyUpdatesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const saveAction = `/api/admin/properties/${propertyId}/updates`;

  async function handleDelete(updateId: string) {
    if (!confirm("Remover esta atualização?")) return;

    setDeletingId(updateId);
    try {
      const response = await fetch(
        `/api/admin/properties/${propertyId}/updates/${updateId}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        },
      );

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (!response.ok) {
        throw new Error("Não foi possível remover a atualização.");
      }

      window.location.reload();
    } catch {
      window.location.href = `/admin/properties/${propertyId}/edit?tab=updates&error=${encodeURIComponent("Erro ao remover atualização.")}`;
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {updates.length === 0 ? (
          <p className="text-sm text-[#64748B]">Nenhuma atualização cadastrada.</p>
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-4"
            >
              {editingId === update.id ? (
                <UpdateForm
                  action={saveAction}
                  update={update}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#0F172A]">{update.title}</p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {updateTypeLabel(update.update_type)} ·{" "}
                      {visibilityLabel(update.visibility)} ·{" "}
                      {formatDate(update.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(update.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={deletingId === update.id}
                      onClick={() => handleDelete(update.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border border-dashed border-[#E2E8F0] p-4">
        <p className="mb-3 text-sm font-medium text-[#0F172A]">Nova atualização</p>
        <UpdateForm action={saveAction} submitLabel="Adicionar atualização" />
      </div>
    </div>
  );
}

function UpdateForm({
  action,
  update,
  submitLabel,
  onCancel,
}: {
  action: string;
  update?: PropertyUpdate;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  return (
    <form action={action} method="POST" className="grid gap-3 md:grid-cols-2">
      {update?.id ? <input type="hidden" name="id" value={update.id} /> : null}
      <Field label="Título">
        <Input name="title" defaultValue={update?.title ?? ""} required />
      </Field>
      <Field label="Tipo">
        <Select name="update_type" defaultValue={update?.update_type ?? "general"}>
          {UPDATE_TYPES.map((type) => (
            <option key={type} value={type}>
              {updateTypeLabel(type)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Visibilidade">
        <Select name="visibility" defaultValue={update?.visibility ?? "public"}>
          {VISIBILITY_OPTIONS.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibilityLabel(visibility)}
            </option>
          ))}
        </Select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Descrição">
          <Textarea
            name="description"
            defaultValue={update?.description ?? ""}
            rows={3}
          />
        </Field>
      </div>
      <div className="flex gap-2 md:col-span-2">
        <Button type="submit" size="sm">
          {submitLabel ?? (update ? "Atualizar" : "Adicionar atualização")}
        </Button>
        {onCancel ? (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
