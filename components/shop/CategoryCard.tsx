import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  href: string
  label: string
  sublabel: string
  bgClass: string
  icon: LucideIcon
}

export function CategoryCard({ href, label, sublabel, bgClass, icon: Icon }: CategoryCardProps) {
  return (
    <Link href={href} className={`${bgClass} rounded-2xl p-5 flex flex-col justify-between h-36 relative overflow-hidden block`}>
      <Icon size={64} className="absolute -top-2 -left-2 opacity-10 text-brown-800" strokeWidth={1} />
      <div />
      <div>
        <p className="text-xs text-brown-500 mb-0.5">{sublabel}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brown-800">{label}</span>
          <span className="text-brown-500 text-lg">←</span>
        </div>
      </div>
    </Link>
  )
}
