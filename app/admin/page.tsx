"use client"

import Link from "next/link"
import { UtensilsCrossed, FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-bold tracking-wide text-foreground">
          Панель управления
        </h1>
        <p className="mt-1 text-muted-foreground">
          Редактирование контента сайта кафе JAZZ
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Меню и блюда</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Категории и карточки блюд: добавление, удаление, редактирование, изображения.
            </CardDescription>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/menu">Открыть редактор меню</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Разделы сайта</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Тексты, заголовки, изображения и иконки всех блоков главной страницы.
            </CardDescription>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/sections">Открыть редактор разделов</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть сайт в новой вкладке
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
