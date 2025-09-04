import { z } from "zod";
import { isValidBRPhone, isValidMonthYear } from "@/lib/forms/transform";

// Personal
export const personalSchema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  cidadeUF: z
    .string()
    .min(2, "Cidade/UF deve ter ao menos 2 caracteres")
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  telefone: z
    .string()
    .min(8, "Telefone deve ter ao menos 8 dígitos")
    .refine(isValidBRPhone, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  linkedin: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  objetivo: z
    .string()
    .max(120, "Objetivo deve ter no máximo 120 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});

// Experience
// Accepts either a free-text string (current placeholder input)
// or a structured array of records (future repeater component).
const monthYearField = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || isValidMonthYear(v), {
    message: "Data inválida (MM/AAAA)",
  })
  .transform((v) => (v === "" ? undefined : v));

const experienceItemSchema = z.object({
  cargo: z.string().optional(),
  empresa: z.string().optional(),
  inicio: monthYearField,
  fim: monthYearField,
  atual: z.boolean().optional(),
  descricao: z.string().optional(),
});

export const experienceSchema = z.object({
  experiencias: z
    .union([
      z.string(),
      z.array(experienceItemSchema),
      z.array(z.record(z.string(), z.any())),
    ])
    .optional(),
});

// Education
const educationItemSchema = z.object({
  instituicao: z.string().optional(),
  curso: z.string().optional(),
  inicio: monthYearField,
  fim: monthYearField,
  descricao: z.string().optional(),
});

export const educationSchema = z.object({
  educacao: z
    .union([
      z.string(),
      z.array(educationItemSchema),
      z.array(z.record(z.string(), z.any())),
    ])
    .optional(),
  cursos: z
    .union([
      z.string(),
      z.array(educationItemSchema),
      z.array(z.record(z.string(), z.any())),
    ])
    .optional(),
});

// Skills & Languages
export const skillsSchema = z.object({
  idiomas: z
    .union([
      z.string(),
      z.array(z.string()),
      z.array(z.record(z.string(), z.any())),
    ])
    .optional(),
  skills: z
    .union([
      z.string(),
      z.array(z.string()),
      z.array(z.record(z.string(), z.any())),
    ])
    .optional(),
});

// Summary
export const summarySchema = z.object({
  resumo: z
    .string()
    .min(10, "Escreva um resumo com ao menos 10 caracteres")
    .max(2000, "Resumo muito longo"),
});

// Types inferred from schemas
export type PersonalData = z.infer<typeof personalSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type SkillsData = z.infer<typeof skillsSchema>;
export type SummaryData = z.infer<typeof summarySchema>;

// Map step IDs to schemas
export const schemaByStepId: Record<string, z.ZodTypeAny> = {
  personal: personalSchema,
  experience: experienceSchema,
  education: educationSchema,
  skills: skillsSchema,
  summary: summarySchema,
};
