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
    <div dir="rtl" className="flex flex-col bg-[#F0EBE0] min-h-full">

      {/* Hero — logo in circle on cream */}
      <div className="flex flex-col items-center pt-10 pb-8 px-6 text-center bg-[#F0EBE0]">
        <div className="w-44 h-44 rounded-full bg-[#EAE4D8] flex items-center justify-center shadow-inner mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpeg"
            alt="LABREAD"
            className="w-36 h-36 rounded-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#3B2010] tracking-widest mb-1">LABREAD</h1>
        <p className="text-sm text-[#7A5C3E] font-medium leading-relaxed max-w-[260px]">
          אנחנו אופים לחמי מחמצת בעבודת יד בשיטות מסורתיות.
        </p>
        <p className="text-xs text-[#A07850] mt-1">לחם אמיתי, מרכיבים פשוטים, אהבה בכל כיכר.</p>
        <div className="w-10 h-0.5 bg-[#C4A882] rounded-full mt-4" />
      </div>

      {/* Announcements — prominent */}
      {announcements && announcements.length > 0 && (
        <div className="mx-4 mb-4 flex flex-col gap-2">
          {announcements.map(a => (
            <div key={a.id} className="flex gap-3 items-start bg-white/70 border border-[#D9CEBE] rounded-2xl px-4 py-3.5">
              <Megaphone size={15} className="text-[#B07040] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#3B2010] leading-relaxed">{a.text}</p>
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
          bgClass="bg-[#E8D8C4]"
          icon={Wheat}
        />
        <CategoryCard
          href="/shop/pastries"
          label="המאפים שלנו"
          sublabel="בבקה, קרואסון ועוד"
          bgClass="bg-[#EDE7DC]"
          icon={Cookie}
        />
      </div>

      {/* Open days strip */}
      {hours && hours.length > 0 && (
        <div className="mx-4 mb-4 bg-white/60 border border-[#D9CEBE] rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-[#5C3D20]">
            <span className="font-semibold">ימי פעילות: </span>
            {hours.map(h => ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'][h.day_of_week]).join(' · ')}
          </p>
          <Link href="/shop/hours" className="text-xs text-[#9B6B3A] underline whitespace-nowrap mr-3">
            פרטים נוספים
          </Link>
        </div>
      )}
    </div>
  )
}
