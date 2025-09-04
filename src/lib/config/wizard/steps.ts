export const wizardSteps = [
  {
    id: "personal",
    title: "Dados pessoais",
    description:
      "Por favor, preencha os campos abaixo com seus dados pessoais.",
    fields: ["nome", "cidadeUF", "telefone", "email", "linkedin", "objetivo"],
  },
  {
    id: "experience",
    title: "Experiência",
    description:
      "Por favor, preencha os campos abaixo com suas experiências profissionais.",
    fields: ["experiencias"],
  },
  {
    id: "education",
    title: "Formação",
    description:
      "Por favor, preencha os campos abaixo com suas formações acadêmicas.",
    fields: ["educacao", "cursos"],
  },
  {
    id: "skills",
    title: "Idiomas & Habilidades",
    description:
      "Por favor, preencha os campos abaixo com seus idiomas e habilidades.",
    fields: ["idiomas", "skills"],
  },
  {
    id: "summary",
    title: "Resumo",
    description:
      "Por favor, preencha o campo abaixo com um resumo de suas experiências e habilidades.",
    fields: ["resumo"],
  },
];
