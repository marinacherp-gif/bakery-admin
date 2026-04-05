'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { useShopI18n } from '@/lib/shop-i18n'
import type { Item } from '@/lib/supabase'
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight, Leaf } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

interface Props {
  item: Item
  onClose: () => void
}

export function AddToCartSheet({ item, onClose }: Props) {
  const { t } = useShopI18n()
  const { addItem, items: cartItems } = useCart()
  const router = useRouter()

  const [qty, setQty] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)
  const [isHalf, setIsHalf] = useState(false)
  const [step, setStep] = useState<'select' | 'added'>('select')
  const [maxError, setMaxError] = useState(false)

  const images = item.images.filter(Boolean)
  const hasMultiple = images.length > 1
  const unitPrice = isHalf ? item.price * 0.5 : item.price
  const totalPrice = (unitPrice * qty).toFixed(0)

  // How many already in cart
  const inCart = cartItems
    .filter(i => i.id === item.id)
    .reduce((sum, i) => sum + i.quantity, 0)
  const remaining = item.quantity - inCart
  const maxQty = Math.max(0, remaining)

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleInc = () => {
    if (qty >= maxQty) {
      setMaxError(true)
      setTimeout(() => setMaxError(false), 2500)
      return
    }
    setMaxError(false)
    setQty(q => q + 1)
  }

  const handleDec = () => {
    setMaxError(false)
    setQty(q => Math.max(1, q - 1))
  }

  const handleAdd = () => {
    if (qty > maxQty) return
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      maxQuantity: item.quantity,
      image: images[0] ?? null,
      canBuyHalf: item.can_buy_half,
      isHalf,
    }, qty)
    setStep('added')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        dir="rtl"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 rounded-t-3xl overflow-hidden"
        style={{ backgroundColor: '#FAF7F2' }}
      >
        {step === 'select' ? (
          <>
            {/* Image */}
            <div className="relative w-full aspect-[16/9] bg-cream-100 overflow-hidden">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[imgIndex]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#EDE6DC]">
                  <ShoppingCart size={40} className="text-brown-200" />
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/60" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>

              {/* Arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIndex(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={clsx('w-1.5 h-1.5 rounded-full transition-colors', i === imgIndex ? 'bg-white' : 'bg-white/40')}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="px-5 pt-4 pb-6">
              {/* Name + badges */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {item.is_vegan && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                      <Leaf size={8} /> {t('items.vegan')}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#3B2010] text-right">{item.name}</h2>
              </div>

              {item.description && (
                <p className="text-sm text-[#8B6B4E] text-right mb-3 leading-relaxed">{item.description}</p>
              )}

              {/* Half toggle */}
              {item.can_buy_half && (
                <button
                  onClick={() => setIsHalf(v => !v)}
                  className={clsx(
                    'w-full text-sm font-medium rounded-xl px-4 py-2 border mb-4 transition-colors',
                    isHalf
                      ? 'bg-[#3B2010] text-white border-[#3B2010]'
                      : 'bg-white text-[#8B6B4E] border-[#DDD4C4]'
                  )}
                >
                  {t('cart.half')} {isHalf ? '✓' : ''}
                </button>
              )}

              {/* Price + Qty + Total */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-[#3B2010]">₪{unitPrice}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#8B6B4E]">כמות</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleInc}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: '#3B2010' }}
                    >
                      <Plus size={16} />
                    </button>
                    <span className="text-lg font-bold text-[#3B2010] w-5 text-center">{qty}</span>
                    <button
                      onClick={handleDec}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#EDE6DC', color: '#3B2010' }}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total line */}
              <div className="flex justify-between items-center mb-2 border-t border-[#DDD4C4] pt-3">
                <span className="text-base font-bold text-[#3B2010]">₪{totalPrice}</span>
                <span className="text-sm text-[#8B6B4E]">סה״כ</span>
              </div>

              {/* Max error */}
              {maxError && (
                <p className="text-center text-sm text-red-500 mb-2 font-medium">
                  לא ניתן להוסיף יותר מ-{item.quantity} יחידות
                </p>
              )}

              {/* Add button */}
              <button
                onClick={handleAdd}
                disabled={maxQty === 0}
                className="w-full py-4 rounded-2xl text-base font-semibold text-white transition-colors"
                style={{ backgroundColor: maxQty === 0 ? '#C4B8AA' : '#3B2010' }}
              >
                {maxQty === 0 ? t('items.soldOut') : t('items.addToCart')}
              </button>
            </div>
          </>
        ) : (
          /* After-add prompt */
          <div className="px-5 pt-8 pb-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-1">
              <ShoppingCart size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-[#3B2010]">
              {qty} × {item.name} {isHalf ? '(חצי)' : ''} נוסף לסל!
            </h2>
            <p className="text-sm text-[#8B6B4E]">סה״כ פריט: ₪{totalPrice}</p>

            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={() => { router.push('/shop/cart'); onClose() }}
                className="w-full py-3.5 rounded-2xl text-base font-semibold text-white"
                style={{ backgroundColor: '#3B2010' }}
              >
                לסל הקניות ←
              </button>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-base font-semibold border"
                style={{ color: '#3B2010', borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
              >
                המשך בקנייה
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
