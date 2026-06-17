"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormattedIntegerInput } from "@/components/admin/formatted-integer-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PROJECT_TYPES,
  PROPERTY_STATUSES,
  VISIBILITY_OPTIONS,
  slugify,
  visibilityLabel,
} from "@/lib/admin/property-constants";
import { projectTypeLabel, statusLabel } from "@/lib/transparency/labels";
import type { Property } from "@/lib/transparency/types";

interface PropertyFormProps {
  property?: Property;
  mode: "create" | "edit";
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

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [coverUrl, setCoverUrl] = useState(property?.cover_image_url ?? "");
  const saveAction =
    mode === "create"
      ? "/api/admin/properties"
      : `/api/admin/properties/${property?.id}`;
  const coverAction =
    mode === "edit" && property
      ? `/api/admin/properties/${property.id}/cover`
      : null;

  return (
    <div className="space-y-8">
      <form action={saveAction} method="POST" className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <Input
              name="name"
              defaultValue={property?.name ?? ""}
              required
              onChange={(event) => {
                if (mode === "create" && !slug) {
                  setSlug(slugify(event.target.value));
                }
              }}
            />
          </Field>
          <Field label="Slug">
            <Input
              name="slug"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              required
            />
          </Field>
          <Field label="Endereço">
            <Input name="address" defaultValue={property?.address ?? ""} />
          </Field>
          <Field label="Cidade">
            <Input name="city" defaultValue={property?.city ?? ""} />
          </Field>
          <Field label="Estado">
            <Input name="state" defaultValue={property?.state ?? ""} />
          </Field>
          <Field label="CEP">
            <Input name="zip_code" defaultValue={property?.zip_code ?? ""} />
          </Field>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Tipo de projeto">
            <Select
              name="project_type"
              defaultValue={property?.project_type ?? ""}
            >
              <option value="">Selecione</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {projectTypeLabel(type)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={property?.status ?? "analysis"}>
              {PROPERTY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Andamento (%)">
            <Input
              name="progress"
              type="number"
              min={0}
              max={100}
              step={0.1}
              defaultValue={property?.progress ?? ""}
            />
          </Field>
          <Field label="Visibilidade">
            <Select
              name="visibility"
              defaultValue={property?.visibility ?? "public"}
            >
              {VISIBILITY_OPTIONS.map((visibility) => (
                <option key={visibility} value={visibility}>
                  {visibilityLabel(visibility)}
                </option>
              ))}
            </Select>
          </Field>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["purchase_price", "Preço de compra"],
            ["estimated_rehab_budget", "Orçamento reforma"],
            ["current_spent", "Gasto atual"],
            ["estimated_sale_price", "Venda projetada"],
            ["actual_sale_price", "Venda real"],
            ["estimated_profit", "Lucro estimado"],
            ["actual_profit", "Lucro real"],
          ].map(([name, label]) => (
            <Field key={name} label={label}>
              <FormattedIntegerInput
                name={name}
                defaultValue={
                  property?.[name as keyof Property] != null
                    ? Number(property[name as keyof Property])
                    : null
                }
              />
            </Field>
          ))}
        </section>

        <section className="space-y-4">
          <Field label="URL da imagem de capa">
            <Input
              name="cover_image_url"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Descrição">
            <Textarea
              name="description"
              defaultValue={property?.description ?? ""}
              rows={5}
            />
          </Field>
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] px-4 py-3">
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            defaultChecked={property?.is_published ?? false}
            className="h-4 w-4 rounded border-[#CBD5E1]"
          />
          <Label htmlFor="is_published" className="cursor-pointer">
            Publicar imóvel no portal
          </Label>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            className="checkmate-gradient border-0 text-white hover:brightness-[1.03]"
          >
            {mode === "create" ? "Criar imóvel" : "Salvar alterações"}
          </Button>
        </div>
      </form>

      {coverAction ? (
        <form
          action={coverAction}
          method="POST"
          encType="multipart/form-data"
          className="space-y-3 rounded-xl border border-dashed border-[#E2E8F0] p-4"
        >
          <Field label="Upload da capa">
            <Input name="file" type="file" accept="image/*" required />
          </Field>
          <Button type="submit" size="sm" variant="outline">
            Enviar capa
          </Button>
        </form>
      ) : null}
    </div>
  );
}
