interface PageProps {
  params: {
    slug: string;
  };
}

export default function CurriculoPorAreaPage({ params }: PageProps) {
  return (
    <div>
      <h1>Currículo por Área: {params.slug}</h1>
    </div>
  );
}
