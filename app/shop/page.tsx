import { supabase } from '@/lib/supabase'
import { Wheat, Cookie } from 'lucide-react'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { AnnouncementStrip } from '@/components/shop/AnnouncementStrip'
import { ShopHomeCopy } from '@/components/shop/ShopHomeCopy'

export default async function ShopHomePage() {
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: hours } = await supabase
    .from('opening_hours')
    .select('day_of_week, is_open')
    .eq('is_open', true)
    .order('day_of_week')

  return (
    <div dir="rtl">
      {/* Hero */}
      <div className="bg-brown-800 text-center px-6 pt-8 pb-10">
        <div className="w-20 h-20 rounded-full bg-brown-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-cream-100 text-3xl font-bold">L</span>
        </div>
        <h1 className="text-cream-100 text-2xl font-bold tracking-widest mb-1">LABREAD</h1>
        <ShopHomeCopy />
      </div>

      {/* Category cards */}
      <div className="px-4 pt-5 pb-2 grid grid-cols-2 gap-3">
        <CategoryCard
          href="/shop/breads"
          label="הלחמים שלנו"
          sublabel="לחם מחמצת ועוד"
          bgClass="bg-amber-100"
          icon={Wheat}
        />
        <CategoryCard
          href="/shop/pastries"
          label="המאפים שלנו"
          sublabel="בבקה, קרואסון ועוד"
          bgClass="bg-cream-100"
          icon={Cookie}
        />
      </div>

      {/* Announcements */}
      <AnnouncementStrip announcements={announcements ?? []} />

      {/* Open days strip */}
      {hours && hours.length > 0 && (
        <div className="mx-4 mb-4 bg-brown-50 border border-warm-border rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-brown-600">
            <span className="font-medium">ימי פעילות: </span>
            {hours.map(h => ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'][h.day_of_week]).join(', ')}
          </p>
          <a href="/shop/hours" className="text-xs text-brown-500 underline whitespace-nowrap mr-3">פרטים נוספים</a>
        </div>
      )}
    </div>
  )
}
