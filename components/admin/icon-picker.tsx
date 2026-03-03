"use client"

import { LANDING_ICONS } from "@/lib/admin-icons"
import { cn } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (iconId: string) => void
  label?: string
  className?: string
}

export function IconPicker({ value, onChange, label = "Иконка", className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {LANDING_ICONS.map(({ id, name, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all",
              value === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
            title={name}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  )
}
