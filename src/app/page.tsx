import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
      <h1 className="text-3xl font-bold mb-6">
        Construa seu currículo em minutos
      </h1>
      <Link
        href="/wizard"
        className="rounded bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Começar agora
      </Link>
    </main>
  );
}
