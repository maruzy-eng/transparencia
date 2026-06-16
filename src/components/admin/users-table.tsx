"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Pencil, Shield, UserCheck, UserX } from "lucide-react";

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
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  createAdminUserAction,
  resetAdminUserPasswordAction,
  setAdminUserStatusAction,
  updateAdminUserAction,
} from "@/lib/admin/user-actions";
import { formatDate } from "@/lib/transparency/labels";
import type { AdminUser } from "@/lib/admin/types";

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

function roleLabel(role: AdminUser["role"]) {
  return role === "admin" ? "Administrador" : "Editor";
}

export function UsersTable({
  users,
  currentUserId,
  createOpen,
  onCreateOpenChange,
}: UsersTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);

  function handleStatusToggle(user: AdminUser) {
    const nextStatus = user.status === "active" ? "inactive" : "active";

    if (user.id === currentUserId && nextStatus === "inactive") {
      setError("Você não pode desativar sua própria conta.");
      return;
    }

    const message =
      nextStatus === "inactive"
        ? `Desativar o usuário ${user.name}?`
        : `Reativar o usuário ${user.name}?`;

    if (!confirm(message)) return;

    setError(null);
    startTransition(async () => {
      const result = await setAdminUserStatusAction(user.id, nextStatus);
      if (!result.success) {
        setError(result.error ?? "Erro ao alterar status.");
        return;
      }
      router.refresh();
    });
  }

  if (users.length === 0) {
    return (
      <>
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white/80 px-6 py-12 text-center">
          <p className="text-base font-medium text-[#0F172A]">
            Nenhum usuário cadastrado
          </p>
          <p className="mt-2 text-sm text-[#64748B]">
            Crie o primeiro usuário administrativo ou editor.
          </p>
        </div>

        <UserFormDialog
          open={createOpen}
          onOpenChange={onCreateOpenChange}
          mode="create"
          onSuccess={() => {
            onCreateOpenChange(false);
            router.refresh();
          }}
        />
      </>
    );
  }

  return (
    <>
      {error ? (
        <p className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#FAFBFC]">
              <tr className="text-left text-[#64748B]">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Último login</th>
                <th className="px-4 py-3 font-medium">Criado em</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#F1F5F9] last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0F172A]">
                          {user.name}
                        </span>
                        {isSelf ? (
                          <Badge
                            variant="outline"
                            className="border-[#DDF0FF] bg-[#F0F9FF] text-[#0284C7]"
                          >
                            Você
                          </Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#64748B]">{user.email}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className="border-[#E2E8F0] bg-[#FAFBFC] text-[#64748B]"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {roleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
                            : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                        }
                      >
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-[#64748B]">
                      {formatDate(user.last_login_at)}
                    </td>
                    <td className="px-4 py-4 text-[#64748B]">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => setEditUser(user)}
                          aria-label="Editar usuário"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => setResetUser(user)}
                          aria-label="Redefinir senha"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          disabled={pending || (isSelf && user.status === "active")}
                          onClick={() => handleStatusToggle(user)}
                          aria-label={
                            user.status === "active"
                              ? "Desativar usuário"
                              : "Reativar usuário"
                          }
                          title={
                            isSelf && user.status === "active"
                              ? "Você não pode desativar sua própria conta"
                              : undefined
                          }
                        >
                          {user.status === "active" ? (
                            <UserX className="h-4 w-4 text-[#DC2626]" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-[#16A34A]" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormDialog
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        mode="create"
        onSuccess={() => {
          onCreateOpenChange(false);
          router.refresh();
        }}
      />

      <UserFormDialog
        open={Boolean(editUser)}
        onOpenChange={(open) => {
          if (!open) setEditUser(null);
        }}
        mode="edit"
        user={editUser ?? undefined}
        currentUserId={currentUserId}
        onSuccess={() => {
          setEditUser(null);
          router.refresh();
        }}
      />

      <ResetPasswordDialog
        user={resetUser}
        open={Boolean(resetUser)}
        onOpenChange={(open) => {
          if (!open) setResetUser(null);
        }}
        onSuccess={() => {
          setResetUser(null);
          router.refresh();
        }}
      />
    </>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  currentUserId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: AdminUser;
  currentUserId?: string;
  onSuccess: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isSelf = user?.id === currentUserId;

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createAdminUserAction(formData)
          : await updateAdminUserAction(user!.id, formData);

      if (!result.success) {
        setError(result.error ?? "Erro ao salvar usuário.");
        return;
      }

      onSuccess();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo usuário" : "Editar usuário"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Crie um usuário administrativo ou editor."
              : "Atualize os dados do usuário selecionado."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="mt-4 space-y-4">
          <Field label="Nome">
            <Input name="name" defaultValue={user?.name ?? ""} required />
          </Field>
          <Field label="E-mail">
            <Input
              name="email"
              type="email"
              defaultValue={user?.email ?? ""}
              required
            />
          </Field>
          <Field label="Role">
            <Select name="role" defaultValue={user?.role ?? "editor"}>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              name="status"
              defaultValue={user?.status ?? "active"}
              disabled={isSelf}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </Select>
            {isSelf ? (
              <p className="text-xs text-[#94A3B8]">
                Você não pode desativar sua própria conta.
              </p>
            ) : null}
          </Field>
          {mode === "create" ? (
            <Field label="Senha inicial">
              <Input
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </Field>
          ) : null}

          {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    if (!user) return;
    setError(null);

    startTransition(async () => {
      const result = await resetAdminUserPasswordAction(user.id, formData);
      if (!result.success) {
        setError(result.error ?? "Erro ao redefinir senha.");
        return;
      }
      onSuccess();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>
            Defina uma nova senha para <strong>{user?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="mt-4 space-y-4">
          <Field label="Nova senha">
            <Input
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </Field>

          {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Redefinir senha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
