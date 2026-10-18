export const instant = false;

export default async function SalonPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-20">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Бронирование онлайн: {slug}
        </h1>
        <p className="text-lg text-muted-foreground">
          Выберите услугу, мастера и время для записи.
        </p>

        {/* Placeholder for booking widget */}
        <div className="w-full p-12 border rounded-xl bg-card text-card-foreground shadow-sm">
           <p className="text-muted-foreground">Здесь будет виджет онлайн-записи</p>
        </div>
      </div>
    </div>
  );
}
