"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { DeletePropertyDialog } from "@/components/admin/delete-property-dialog";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/transparency/types";

interface DeletePropertyDialogTriggerProps {
  property: Property;
}

export function DeletePropertyDialogTrigger({
  property,
}: DeletePropertyDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-[#DC2626] hover:bg-[#FEF2F2]"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Excluir imóvel
      </Button>
      <DeletePropertyDialog
        property={property}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
