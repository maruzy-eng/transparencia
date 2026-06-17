"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  formatIntegerDigits,
  formatIntegerInput,
} from "@/lib/admin/number-format";

interface FormattedIntegerInputProps {
  name: string;
  defaultValue?: number | null;
  placeholder?: string;
  required?: boolean;
}

export function FormattedIntegerInput({
  name,
  defaultValue,
  placeholder,
  required,
}: FormattedIntegerInputProps) {
  const [display, setDisplay] = useState(() =>
    formatIntegerInput(defaultValue),
  );
  const rawValue = display.replace(/\D/g, "");

  return (
    <>
      <Input
        inputMode="numeric"
        autoComplete="off"
        value={display}
        placeholder={placeholder}
        required={required}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "");
          setDisplay(formatIntegerDigits(digits));
        }}
      />
      <input type="hidden" name={name} value={rawValue} />
    </>
  );
}
