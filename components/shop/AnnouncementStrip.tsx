import type { Announcement } from '@/lib/supabase'
import { Megaphone } from 'lucide-react'

export function AnnouncementStrip({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) return null

  return (
    <div className="mx-4 my-4 flex flex-col gap-2">
      {announcements.map(a => (
        <div key={a.id} className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Megaphone size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">{a.text}</p>
        </div>
      ))}
    </div>
  )
}
