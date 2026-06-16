"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import {
  deleteUpdateAction,
  saveUpdateAction,
} from "@/lib/admin/property-actions";
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSave(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await saveUpdateAction(propertyId, formData);
      if (!result.success) {
        setError(result.error ?? "Erro ao salvar atualização.");
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(updateId: string) {
    if (!confirm("Remover esta atualização?")) return;
    startTransition(async () => {
      const result = await deleteUpdateAction(propertyId, updateId);
      if (!result.success) {
        setError(result.error ?? "Erro ao remover atualização.");
        return;
      }
      router.refresh();
    });
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
                  update={update}
                  pending={pending}
                  onSubmit={handleSave}
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
        <UpdateForm pending={pending} onSubmit={handleSave} />
      </div>

      {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}
    </div>
  );
}

function UpdateForm({
  update,
  pending,
  onSubmit,
  onCancel,
}: {
  update?: PropertyUpdate;
  pending: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
}) {
  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
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
        <Button type="submit" size="sm" disabled={pending}>
          {pending
            ? "Salvando..."
            : update
              ? "Atualizar"
              : "Adicionar atualização"}
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
