import type { OpeningHour } from '@/lib/supabase'

const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export function HoursTable({ hours, todayDow }: { hours: OpeningHour[], todayDow: number }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-border overflow-hidden mx-4">
      {hours.map((h, i) => (
        <div
          key={h.day_of_week}
          className={`flex items-center justify-between px-5 py-3.5 ${i < hours.length - 1 ? 'border-b border-warm-border' : ''}
            ${h.day_of_week === todayDow ? 'bg-brown-50' : ''}`}
        >
          <div className="flex items-center gap-2">
            {h.day_of_week === todayDow && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            )}
            <span className={`text-sm ${h.day_of_week === todayDow ? 'font-bold text-brown-800' : 'text-brown-600'}`}>
              {HE_DAYS[h.day_of_week]}
              {h.day_of_week === todayDow && <span className="text-xs text-green-600 font-normal mr-1.5"> • היום</span>}
            </span>
          </div>
          <span className={`text-sm ${h.is_open ? 'text-brown-700 font-medium' : 'text-brown-300'}`}>
            {h.is_open ? `${h.open_time} – ${h.close_time}` : 'סגור'}
          </span>
        </div>
      ))}
    </div>
  )
}
