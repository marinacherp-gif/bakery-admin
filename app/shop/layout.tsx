import { ShopI18nProvider } from '@/lib/shop-i18n'
import { CartProvider } from '@/lib/cart-context'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { BottomNav } from '@/components/shop/BottomNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopI18nProvider>
      <CartProvider>
        <div dir="rtl" style={{ backgroundColor: '#DDD4C4', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F0EBE0' }}>
            <ShopHeader />
            <main style={{ flex: 1, paddingBottom: 64 }}>
              {children}
            </main>
            <BottomNav />
          </div>
        </div>
      </CartProvider>
    </ShopI18nProvider>
  )
}
