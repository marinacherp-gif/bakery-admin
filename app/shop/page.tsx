import { supabase } from '@/lib/supabase'
import { Wheat, Cookie, Megaphone } from 'lucide-react'
import { CategoryCard } from '@/components/shop/CategoryCard'
import Link from 'next/link'

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
    <div dir="rtl" style={{ backgroundColor: '#F0EBE0', minHeight: '100%' }}>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-10 pb-8">
        {/* Logo circle */}
        <div
          className="rounded-full flex items-center justify-center mb-5 shadow-md overflow-hidden"
          style={{ width: 160, height: 160, backgroundColor: '#E4DACC' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpeg"
            alt="LABREAD"
            style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>

        <p className="text-sm font-medium leading-relaxed max-w-[260px]" style={{ color: '#5C3820' }}>
          אנחנו אופים לחמי מחמצת בעבודת יד בשיטות מסורתיות.
        </p>
        <p className="text-xs mt-1" style={{ color: '#A07850' }}>
          לחם אמיתי, מרכיבים פשוטים, אהבה בכל כיכר.
        </p>
        <div className="w-10 h-0.5 rounded-full mt-4" style={{ backgroundColor: '#C4A882' }} />
      </div>

      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <div className="mx-4 mb-4 flex flex-col gap-2">
          {announcements.map(a => (
            <div
              key={a.id}
              className="flex gap-3 items-start rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid #D9CEBE' }}
            >
              <Megaphone size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#B07040' }} />
              <p className="text-sm leading-relaxed" style={{ color: '#3B2010' }}>{a.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Category cards */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-3">
        <CategoryCard
          href="/shop/breads"
          label="הלחמים שלנו"
          sublabel="לחם מחמצת ועוד"
          bg="#E2D0BA"
          icon={Wheat}
        />
        <CategoryCard
          href="/shop/pastries"
          label="המאפים שלנו"
          sublabel="בבקה, קרואסון ועוד"
          bg="#EDE6DC"
          icon={Cookie}
        />
      </div>

      {/* Open days strip */}
      {hours && hours.length > 0 && (
        <div
          className="mx-4 mb-4 rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid #D9CEBE' }}
        >
          <p className="text-sm" style={{ color: '#5C3D20' }}>
            <span className="font-semibold">ימי פעילות: </span>
            {hours.map(h => ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'][h.day_of_week]).join(' · ')}
          </p>
          <Link href="/shop/hours" className="text-xs underline whitespace-nowrap mr-3" style={{ color: '#9B6B3A' }}>
            פרטים נוספים
          </Link>
        </div>
      )}
    </div>
  )
}
