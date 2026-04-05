import { supabase } from '@/lib/supabase'
import { ItemCard } from '@/components/shop/ItemCard'
import { Cookie } from 'lucide-react'

export default async function PastriesPage() {
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('category', 'pastry')
    .order('created_at', { ascending: false })

  return (
    <div dir="rtl" className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center">
          <Cookie size={18} className="text-brown-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-brown-800">המאפים שלנו</h1>
          <p className="text-xs text-brown-400">{items?.length ?? 0} פריטים</p>
        </div>
      </div>

      {!items?.length ? (
        <div className="text-center py-16 text-brown-300">
          <Cookie size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">אין מאפים כרגע</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
