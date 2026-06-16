"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginActionState } from "@/lib/admin/actions";

interface LoginFormProps {
  nextPath?: string;
  disabled?: boolean;
}

const initialState: LoginActionState = {};

export function LoginForm({
  nextPath = "/admin/dashboard",
  disabled = false,
}: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          required
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          disabled={disabled}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending || disabled}
        className="checkmate-gradient h-11 w-full border-0 text-white hover:brightness-[1.03]"
      >
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
