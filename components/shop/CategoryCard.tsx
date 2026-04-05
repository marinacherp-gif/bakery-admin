import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  href: string
  label: string
  sublabel: string
  bg: string   // inline style color
  icon: LucideIcon
}

export function CategoryCard({ href, label, sublabel, bg, icon: Icon }: CategoryCardProps) {
  return (
    <Link
      href={href}
      style={{ backgroundColor: bg }}
      className="rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden"
    >
      <Icon size={56} className="absolute -top-1 -left-1 opacity-10 text-[#3B2010]" strokeWidth={1} />
      <div />
      <div>
        <p className="text-xs text-[#9B7050] mb-0.5">{sublabel}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#3B2010]">{label}</span>
          <span className="text-[#9B7050] text-base">←</span>
        </div>
      </div>
    </Link>
  )
}
