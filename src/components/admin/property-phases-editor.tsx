"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PHASE_STATUSES,
  VISIBILITY_OPTIONS,
  phaseStatusLabel,
  visibilityLabel,
} from "@/lib/admin/property-constants";
import type { PropertyPhase } from "@/lib/transparency/types";

interface PropertyPhasesEditorProps {
  propertyId: string;
  phases: PropertyPhase[];
}

const emptyPhase = {
  title: "",
  description: "",
  status: "pending",
  sort_order: "0",
  planned_date: "",
  completed_date: "",
  visibility: "public",
};

export function PropertyPhasesEditor({
  propertyId,
  phases,
}: PropertyPhasesEditorProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const saveAction = `/api/admin/properties/${propertyId}/phases`;

  async function handleDelete(phaseId: string) {
    if (!confirm("Remover esta fase?")) return;

    setDeletingId(phaseId);
    try {
      const response = await fetch(
        `/api/admin/properties/${propertyId}/phases/${phaseId}`,
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
        throw new Error("Não foi possível remover a fase.");
      }

      router.refresh();
    } catch {
      window.location.href = `/admin/properties/${propertyId}/edit?tab=phases&error=${encodeURIComponent("Erro ao remover fase.")}`;
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {phases.length === 0 ? (
          <p className="text-sm text-[#64748B]">Nenhuma fase cadastrada.</p>
        ) : (
          phases.map((phase) => (
            <div
              key={phase.id}
              className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-4"
            >
              {editingId === phase.id ? (
                <PhaseForm
                  action={saveAction}
                  phase={phase}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#0F172A]">{phase.title}</p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {phaseStatusLabel(phase.status)} · Ordem {phase.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(phase.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={deletingId === phase.id}
                      onClick={() => handleDelete(phase.id)}
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
        <p className="mb-3 text-sm font-medium text-[#0F172A]">Nova fase</p>
        <PhaseForm action={saveAction} submitLabel="Adicionar fase" />
      </div>
    </div>
  );
}

function PhaseForm({
  action,
  phase,
  submitLabel,
  onCancel,
}: {
  action: string;
  phase?: PropertyPhase;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const defaults = phase ?? emptyPhase;

  return (
    <form action={action} method="POST" className="grid gap-3 md:grid-cols-2">
      {phase?.id ? <input type="hidden" name="id" value={phase.id} /> : null}
      <Field label="Título">
        <Input name="title" defaultValue={defaults.title} required />
      </Field>
      <Field label="Ordem">
        <Input
          name="sort_order"
          type="number"
          defaultValue={String(phase?.sort_order ?? defaults.sort_order)}
        />
      </Field>
      <Field label="Status">
        <Select name="status" defaultValue={phase?.status ?? defaults.status}>
          {PHASE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {phaseStatusLabel(status)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Visibilidade">
        <Select
          name="visibility"
          defaultValue={phase?.visibility ?? defaults.visibility}
        >
          {VISIBILITY_OPTIONS.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibilityLabel(visibility)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Data planejada">
        <Input
          name="planned_date"
          type="date"
          defaultValue={phase?.planned_date?.slice(0, 10) ?? ""}
        />
      </Field>
      <Field label="Data concluída">
        <Input
          name="completed_date"
          type="date"
          defaultValue={phase?.completed_date?.slice(0, 10) ?? ""}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Descrição">
          <Textarea
            name="description"
            defaultValue={phase?.description ?? defaults.description ?? ""}
            rows={3}
          />
        </Field>
      </div>
      <div className="flex gap-2 md:col-span-2">
        <Button type="submit" size="sm">
          {submitLabel ?? (phase ? "Atualizar fase" : "Adicionar fase")}
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
