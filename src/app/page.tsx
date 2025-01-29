import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Tomarigi Quest</h1>
          <h1 className="text-3xl font-bold mb-4">大人に最高の学びを</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/auth/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              こちらからログイン
            </Link>
            <Link
              href="/quiz"
              className="bg-emerald-700 text-white px-4 py-2 rounded-md"
            >
              書籍を選択し、クイズに挑戦
            </Link>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
