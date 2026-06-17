"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SITE_CONTENT_FALLBACKS } from "@/lib/transparency/content-types";
import type { SiteContentRecord } from "@/lib/transparency/content-types";

const GROUP_LABELS: Record<string, string> = {
  hero: "Hero",
  trust: "Itens de confiança",
  projects: "Seção de projetos",
  footer: "Rodapé",
};

const OPTIONAL_EMPTY_KEYS = new Set(["transparency.hero.secondary_cta"]);

interface ContentEditorProps {
  items: SiteContentRecord[];
}

export function ContentEditor({ items }: ContentEditorProps) {
  const grouped = useMemo(() => {
    const groups = new Map<string, SiteContentRecord[]>();

    for (const item of items) {
      const list = groups.get(item.group) ?? [];
      list.push(item);
      groups.set(item.group, list);
    }

    return Array.from(groups.entries());
  }, [items]);

  const [editing, setEditing] = useState<SiteContentRecord | null>(null);

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-[#E2E8F0] bg-white/80 p-8 text-center shadow-none">
        <p className="text-sm text-[#64748B]">
          Nenhum conteúdo encontrado. Execute a migration do banco para popular
          os textos iniciais.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {grouped.map(([group, groupItems]) => (
          <Card
            key={group}
            className="border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6"
          >
            <h2 className="text-base font-semibold text-[#0F172A]">
              {GROUP_LABELS[group] ?? group}
            </h2>
            <ul className="mt-4 divide-y divide-[#E2E8F0]">
              {groupItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0F172A]">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm text-[#64748B]">
                      {item.value || (
                        <span className="italic text-[#94A3B8]">Vazio</span>
                      )}
                    </p>
                    <p className="mt-2 line-clamp-2 rounded-lg bg-[#FAFBFC] px-3 py-2 text-xs text-[#94A3B8]">
                      Preview:{" "}
                      {item.value ||
                        SITE_CONTENT_FALLBACKS[
                          item.key as keyof typeof SITE_CONTENT_FALLBACKS
                        ] ||
                        "—"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(item)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <EditContentDialog
        item={editing}
        onClose={() => setEditing(null)}
      />
    </>
  );
}

function EditContentDialog({
  item,
  onClose,
}: {
  item: SiteContentRecord | null;
  onClose: () => void;
}) {
  const fallback =
    SITE_CONTENT_FALLBACKS[item?.key as keyof typeof SITE_CONTENT_FALLBACKS];

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar texto</DialogTitle>
          <DialogDescription>{item?.label}</DialogDescription>
        </DialogHeader>

        {item ? (
          <form
            action="/api/admin/content"
            method="POST"
            className="mt-4 space-y-4"
          >
            <input type="hidden" name="key" value={item.key} />
            <div className="space-y-2">
              <Label htmlFor="content-value">Conteúdo</Label>
              {item.type === "textarea" ? (
                <Textarea
                  id="content-value"
                  name="value"
                  defaultValue={item.value}
                  rows={5}
                  required={!OPTIONAL_EMPTY_KEYS.has(item.key)}
                />
              ) : (
                <Input
                  id="content-value"
                  name="value"
                  defaultValue={item.value}
                  required={!OPTIONAL_EMPTY_KEYS.has(item.key)}
                />
              )}
              {fallback ? (
                <p className="text-xs text-[#94A3B8]">
                  Fallback no código: {fallback}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
