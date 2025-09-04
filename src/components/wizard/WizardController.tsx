"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { wizardSteps } from "@/lib/config/wizard/steps";
import { schemaByStepId } from "@/lib/forms/schemas";
import StepView from "@/components/wizard/StepView";
import NavButtons from "@/components/wizard/NavButtons";
import SlideTransition from "@/components/wizard/animations/SlideTransition";

type FormData = Record<string, unknown>;

// Map of step schemas from forms/schemas
const stepSchemas: Record<string, z.ZodTypeAny> = schemaByStepId;

const LS_KEY = "wizardFormData";

function loadSavedFormData(): FormData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveFormData(data: FormData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // noop
  }
}

export default function WizardController() {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({});
  const [error, setError] = React.useState<string | null>(null);
  const [direction, setDirection] = React.useState<"forward" | "backward">(
    "forward"
  );
  const {
    setError: setFieldError,
    clearErrors,
    formState: { errors },
  } = useForm<Record<string, any>>({ mode: "onSubmit" });

  // Load from localStorage on mount
  React.useEffect(() => {
    const initial = loadSavedFormData();
    if (Object.keys(initial).length > 0) {
      setFormData(initial);
    }
  }, []);

  // Debounced autosave
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      saveFormData(formData);
    }, 500);
    return () => window.clearTimeout(id);
  }, [formData]);

  const step = wizardSteps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === wizardSteps.length - 1;

  // Wrap setFormData to clear errors when user edits a field
  const setFormDataWithClear = React.useCallback(
    (next: FormData) => {
      // detect changed fields limited to current step
      const changed: string[] = [];
      for (const f of step.fields) {
        if (next[f] !== formData[f]) changed.push(f);
      }
      if (changed.length) clearErrors(changed as any);
      setFormData(next);
    },
    // depends on current step and formData snapshot
    [step.fields, formData, clearErrors]
  );

  function handleBack() {
    setError(null);
    if (!isFirst) {
      setDirection("backward");
      setCurrentStepIndex((i) => i - 1);
    }
  }

  function handleContinue() {
    setError(null);

    const schema = stepSchemas[step.id];
    if (schema) {
      const pick: Record<string, unknown> = {};
      for (const f of step.fields) pick[f] = formData[f];
      const result = schema.safeParse(pick);
      if (!result.success) {
        // Map Zod issues to RHF field errors
        for (const issue of result.error.issues) {
          const field = String(issue.path?.[0] ?? "");
          if (field && step.fields.includes(field)) {
            setFieldError(field, { type: "zod", message: issue.message });
          }
        }
        return; // block advancing
      }
      // Optionally merge parsed data (coercions) back
      setFormData((prev) => ({
        ...prev,
        ...(result.data as any),
      }));
      // Clear previous errors for this step
      clearErrors(step.fields as any);
    }

    if (!isLast) {
      setDirection("forward");
      setCurrentStepIndex((i) => i + 1);
    }
    // If it's the last step, you could trigger a submit later.
  }

  return (
    <main className="w-full bg-gray-50 h-screen items-center flex justify-center py-10">
      <div className="w-full max-w-2xl px-4">
        <h2 className="text-xl font-semibold mb-3">{step.title}</h2>
        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <SlideTransition direction={direction} keyProp={step.id}>
          <StepView
            stepId={step.id}
            fields={step.fields}
            formData={formData}
            setFormData={setFormDataWithClear}
            errors={Object.fromEntries(
              step.fields.map((f) => [f, (errors as any)?.[f]?.message as string | undefined])
            )}
          />
        </SlideTransition>
        <div className="mt-6">
          <NavButtons
            onBack={isFirst ? undefined : handleBack}
            onContinue={handleContinue}
            disableContinue={false}
            isLastStep={isLast}
          />
        </div>
      </div>
    </main>
  );
}
