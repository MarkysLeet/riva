import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl font-bold tracking-tight">Салон не найден</h2>
        <p className="text-muted-foreground">
          К сожалению, запрашиваемая страница салона или мастера не существует или была удалена.
        </p>
        <Link href="/">
          <Button className="mt-4">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  )
}
