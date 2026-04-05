'use client'

import { useShopI18n } from '@/lib/shop-i18n'

export function ShopHomeCopy() {
  const { t } = useShopI18n()
  return <p className="text-cream-300 text-sm font-light tracking-wide">{t('home.tagline')}</p>
}
