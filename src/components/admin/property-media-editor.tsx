"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  MEDIA_TYPES,
  VISIBILITY_OPTIONS,
  visibilityLabel,
} from "@/lib/admin/property-constants";
import type { PropertyMedia } from "@/lib/transparency/types";

interface PropertyMediaEditorProps {
  propertyId: string;
  media: PropertyMedia[];
}

export function PropertyMediaEditor({
  propertyId,
  media,
}: PropertyMediaEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const saveAction = `/api/admin/properties/${propertyId}/media`;

  async function handleDelete(item: PropertyMedia) {
    if (!confirm("Remover esta mídia?")) return;

    setDeletingId(item.id);
    try {
      const deleteUrl = new URL(
        `/api/admin/properties/${propertyId}/media/${item.id}`,
        window.location.origin,
      );
      if (item.url.includes("/storage/v1/object/public/property-media/")) {
        deleteUrl.searchParams.set("url", item.url);
      }

      const response = await fetch(deleteUrl.toString(), {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (!response.ok) {
        throw new Error("Não foi possível remover a mídia.");
      }

      window.location.reload();
    } catch {
      window.location.href = `/admin/properties/${propertyId}/edit?tab=media&error=${encodeURIComponent("Erro ao remover mídia.")}`;
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {media.length === 0 ? (
          <p className="text-sm text-[#64748B] sm:col-span-2">
            Nenhuma mídia cadastrada.
          </p>
        ) : (
          media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
            >
              {item.media_type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.caption ?? "Mídia do imóvel"}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">
                  Vídeo
                </div>
              )}
              <div className="space-y-3 p-4">
                {editingId === item.id ? (
                  <MediaUrlForm
                    action={saveAction}
                    item={item}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-[#0F172A]">
                      {item.caption || item.url}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {item.media_type} · {visibilityLabel(item.visibility)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(item.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-dashed border-[#E2E8F0] p-4">
          <p className="mb-3 text-sm font-medium text-[#0F172A]">Upload de arquivo</p>
          <form
            action={saveAction}
            method="POST"
            encType="multipart/form-data"
            className="space-y-3"
          >
            <Field label="Arquivo">
              <Input name="file" type="file" accept="image/*,video/*" required />
            </Field>
            <Field label="Tipo">
              <Select name="media_type" defaultValue="photo">
                {MEDIA_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "photo" ? "Foto" : "Vídeo"}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Visibilidade">
              <Select name="visibility" defaultValue="public">
                {VISIBILITY_OPTIONS.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibilityLabel(visibility)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Legenda">
              <Input name="caption" placeholder="Opcional" />
            </Field>
            <Button type="submit" size="sm">
              Fazer upload
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-dashed border-[#E2E8F0] p-4">
          <p className="mb-3 text-sm font-medium text-[#0F172A]">Adicionar por URL</p>
          <MediaUrlForm action={saveAction} submitLabel="Adicionar URL" />
        </div>
      </div>
    </div>
  );
}

function MediaUrlForm({
  action,
  item,
  submitLabel,
  onCancel,
}: {
  action: string;
  item?: PropertyMedia;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  return (
    <form action={action} method="POST" className="space-y-3">
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <Field label="URL">
        <Input name="url" type="url" defaultValue={item?.url ?? ""} required />
      </Field>
      <Field label="Tipo">
        <Select name="media_type" defaultValue={item?.media_type ?? "photo"}>
          {MEDIA_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === "photo" ? "Foto" : "Vídeo"}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Visibilidade">
        <Select name="visibility" defaultValue={item?.visibility ?? "public"}>
          {VISIBILITY_OPTIONS.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibilityLabel(visibility)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Legenda">
        <Input name="caption" defaultValue={item?.caption ?? ""} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          {submitLabel ?? (item ? "Atualizar mídia" : "Adicionar URL")}
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
