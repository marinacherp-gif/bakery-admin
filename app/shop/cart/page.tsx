import { supabase } from '@/lib/supabase'
import { CartView } from '@/components/shop/CartView'

export default async function CartPage() {
  const { data: contact } = await supabase.from('contact_info').select('phone').single()
  return <CartView phone={contact?.phone ?? null} />
}
