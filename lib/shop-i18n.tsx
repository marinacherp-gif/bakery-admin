'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ShopLocale = 'he' | 'en' | 'ru'

export const SHOP_LOCALE_LABELS: Record<ShopLocale, string> = {
  he: 'עב',
  en: 'EN',
  ru: 'РУ',
}

const translations = {
  he: {
    'nav.home': 'בית',
    'nav.breads': 'לחמים',
    'nav.pastries': 'מאפים',
    'nav.hours': 'שעות',
    'nav.cart': 'סל',
    'home.tagline': 'לחם שנאפה באהבה',
    'home.categoryBreads': 'הלחמים שלנו',
    'home.categoryBreadsSub': 'לחם מחמצת, שיפון ועוד',
    'home.categoryPastries': 'המאפים שלנו',
    'home.categoryPastriesSub': 'בבקה, קרואסון ועוד',
    'home.moreDetails': 'פרטים נוספים ←',
    'home.activedays': 'ימי פעילות',
    'items.addToCart': 'הוסף לסל',
    'items.soldOut': 'אזל המלאי',
    'items.vegan': 'טבעוני',
    'items.half': 'ניתן לחצי',
    'items.canCut': 'ניתן לחתוך',
    'cart.title': 'סל הקניות',
    'cart.empty': 'הסל ריק',
    'cart.emptyDesc': 'הוסף פריטים כדי להתחיל',
    'cart.clear': 'נקה סל',
    'cart.total': 'סה״כ',
    'cart.order': 'הזמן בוואטסאפ',
    'cart.half': 'חצי מנה',
    'hours.title': 'שעות פתיחה',
    'hours.closed': 'סגור',
    'hours.today': 'היום',
    'hours.whatsapp': 'צור קשר בוואטסאפ',
    'hours.phone': 'טלפון',
    'day.0': 'ראשון',
    'day.1': 'שני',
    'day.2': 'שלישי',
    'day.3': 'רביעי',
    'day.4': 'חמישי',
    'day.5': 'שישי',
    'day.6': 'שבת',
  },
  en: {
    'nav.home': 'Home',
    'nav.breads': 'Breads',
    'nav.pastries': 'Pastries',
    'nav.hours': 'Hours',
    'nav.cart': 'Cart',
    'home.tagline': 'Bread baked with love',
    'home.categoryBreads': 'Our Breads',
    'home.categoryBreadsSub': 'Sourdough, rye & more',
    'home.categoryPastries': 'Our Pastries',
    'home.categoryPastriesSub': 'Babka, croissant & more',
    'home.moreDetails': 'More details →',
    'home.activedays': 'Open days',
    'items.addToCart': 'Add to cart',
    'items.soldOut': 'Sold out',
    'items.vegan': 'Vegan',
    'items.half': 'Half available',
    'items.canCut': 'Can be sliced',
    'cart.title': 'Your Cart',
    'cart.empty': 'Cart is empty',
    'cart.emptyDesc': 'Add items to get started',
    'cart.clear': 'Clear cart',
    'cart.total': 'Total',
    'cart.order': 'Order via WhatsApp',
    'cart.half': 'Half portion',
    'hours.title': 'Opening Hours',
    'hours.closed': 'Closed',
    'hours.today': 'Today',
    'hours.whatsapp': 'Contact via WhatsApp',
    'hours.phone': 'Phone',
    'day.0': 'Sunday',
    'day.1': 'Monday',
    'day.2': 'Tuesday',
    'day.3': 'Wednesday',
    'day.4': 'Thursday',
    'day.5': 'Friday',
    'day.6': 'Saturday',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.breads': 'Хлеб',
    'nav.pastries': 'Выпечка',
    'nav.hours': 'Часы',
    'nav.cart': 'Корзина',
    'home.tagline': 'Хлеб, испечённый с любовью',
    'home.categoryBreads': 'Наш хлеб',
    'home.categoryBreadsSub': 'Закваска, рожь и другое',
    'home.categoryPastries': 'Наша выпечка',
    'home.categoryPastriesSub': 'Бабка, круассан и другое',
    'home.moreDetails': 'Подробнее →',
    'home.activedays': 'Рабочие дни',
    'items.addToCart': 'В корзину',
    'items.soldOut': 'Нет в наличии',
    'items.vegan': 'Веган',
    'items.half': 'Доступна половина',
    'items.canCut': 'Можно нарезать',
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.emptyDesc': 'Добавьте товары для заказа',
    'cart.clear': 'Очистить',
    'cart.total': 'Итого',
    'cart.order': 'Заказать в WhatsApp',
    'cart.half': 'Половина порции',
    'hours.title': 'Часы работы',
    'hours.closed': 'Закрыто',
    'hours.today': 'Сегодня',
    'hours.whatsapp': 'Связаться в WhatsApp',
    'hours.phone': 'Телефон',
    'day.0': 'Воскресенье',
    'day.1': 'Понедельник',
    'day.2': 'Вторник',
    'day.3': 'Среда',
    'day.4': 'Четверг',
    'day.5': 'Пятница',
    'day.6': 'Суббота',
  },
}

type TranslationKey = keyof typeof translations.he

interface ShopI18nContextType {
  locale: ShopLocale
  setLocale: (l: ShopLocale) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
}

const ShopI18nContext = createContext<ShopI18nContextType | null>(null)

export function ShopI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<ShopLocale>('he')

  useEffect(() => {
    const stored = localStorage.getItem('shop_locale') as ShopLocale | null
    if (stored && ['he', 'en', 'ru'].includes(stored)) setLocaleState(stored)
  }, [])

  const setLocale = (l: ShopLocale) => {
    setLocaleState(l)
    localStorage.setItem('shop_locale', l)
  }

  const t = (key: TranslationKey): string =>
    (translations[locale] as Record<string, string>)[key] ??
    (translations.he as Record<string, string>)[key] ??
    key

  const isRTL = locale === 'he'

  return (
    <ShopI18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </ShopI18nContext.Provider>
  )
}

export function useShopI18n() {
  const ctx = useContext(ShopI18nContext)
  if (!ctx) throw new Error('useShopI18n must be used inside ShopI18nProvider')
  return ctx
}
