import { ShopI18nProvider } from '@/lib/shop-i18n'
import { CartProvider } from '@/lib/cart-context'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { BottomNav } from '@/components/shop/BottomNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopI18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#E8E0D0] flex flex-col items-center">
          <div className="w-full max-w-[480px] min-h-screen relative flex flex-col bg-[#F0EBE0]">
            <ShopHeader />
            <main className="flex-1 pb-20 pt-14">
              {children}
            </main>
            <BottomNav />
          </div>
        </div>
      </CartProvider>
    </ShopI18nProvider>
  )
}
