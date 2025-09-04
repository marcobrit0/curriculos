"use client";

import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  stepId: string;
  fields: string[];
  formData: Record<string, unknown>;
  setFormData: (data: Record<string, unknown>) => void;
  errors?: Record<string, string | undefined>;
};

function labelize(name: string) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferType(field: string): React.ComponentProps<typeof Input>["type"] {
  if (field.toLowerCase().includes("email")) return "email";
  if (field.toLowerCase().includes("telefone") || field.toLowerCase().includes("phone")) return "tel";
  if (field.toLowerCase().includes("linkedin") || field.toLowerCase().includes("url")) return "url";
  return "text";
}

export default function StepView({ stepId, fields, formData, setFormData, errors }: Props) {
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {fields.map((field) => {
        const value = (formData?.[field] as string | number | undefined) ?? "";
        const error = errors?.[field];
        return (
          <div key={`${stepId}-${field}`} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">{labelize(field)}</label>
            <Input
              type={inferType(field)}
              value={String(value)}
              placeholder={labelize(field)}
              onChange={(e) => handleChange(field, e.target.value)}
              aria-invalid={!!error}
            />
            {error ? (
              <span className="mt-1 text-sm text-red-600">{error}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
