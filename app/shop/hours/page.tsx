export const revalidate = 0

import { supabase } from '@/lib/supabase'
import { Clock, MessageCircle, Phone } from 'lucide-react'
import { AnnouncementStrip } from '@/components/shop/AnnouncementStrip'
import { HoursTable } from '@/components/shop/HoursTable'

export default async function HoursPage() {
  const todayDow = new Date().getDay()

  const [{ data: hours }, { data: announcements }, { data: contact }] = await Promise.all([
    supabase.from('opening_hours').select('*').order('day_of_week'),
    supabase.from('announcements').select('*').eq('is_active', true).limit(2),
    supabase.from('contact_info').select('*').single(),
  ])

  const whatsappPhone = contact?.phone?.replace(/[^0-9]/g, '') ?? ''

  return (
    <div dir="rtl" className="pb-6">
      {/* Title */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <div className="w-9 h-9 rounded-xl bg-brown-100 flex items-center justify-center">
          <Clock size={18} className="text-brown-500" />
        </div>
        <h1 className="text-lg font-bold text-brown-800">שעות פתיחה</h1>
      </div>

      {/* Announcements */}
      <AnnouncementStrip announcements={announcements ?? []} />

      {/* Hours table */}
      {hours && hours.length > 0 ? (
        <HoursTable hours={hours} todayDow={todayDow} />
      ) : (
        <div className="mx-4 text-center py-8 text-brown-300 text-sm">אין מידע זמין</div>
      )}

      {/* WhatsApp CTA */}
      {whatsappPhone && (
        <div className="mx-4 mt-6 space-y-3">
          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 px-5 font-semibold text-base transition-colors w-full"
          >
            <MessageCircle size={20} />
            צור קשר בוואטסאפ
          </a>
          {contact?.phone && (
            <div className="flex items-center justify-center gap-2 text-sm text-brown-500">
              <Phone size={14} />
              <span dir="ltr">{contact.phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
