"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onBack?: () => void;
  onContinue?: () => void;
  disableContinue?: boolean;
  isLastStep?: boolean;
};

export default function NavButtons({ onBack, onContinue, disableContinue, isLastStep }: Props) {
  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="outline" type="button" onClick={onBack} disabled={!onBack}>
        Voltar
      </Button>
      <Button type="button" onClick={onContinue} disabled={disableContinue}>
        {isLastStep ? "Concluir" : "Continuar"}
      </Button>
    </div>
  );
}
