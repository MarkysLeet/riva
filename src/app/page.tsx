export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-20">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Добро пожаловать в Riva
        </h1>
        <p className="text-lg text-muted-foreground">
          Платформа для управления салонами красоты.
        </p>

        <div className="w-full p-8 border rounded-xl bg-card text-card-foreground shadow-sm mt-8">
           <p className="text-sm">
             Чтобы перейти на страницу конкретного салона, добавьте его имя в URL.
             Например: <code className="bg-muted px-1.5 py-0.5 rounded">/mysalon</code>
           </p>
        </div>
      </div>
    </div>
  );
}
