'use client'

import { useState } from 'react'
import type { Item } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { ImageUploader } from './ImageUploader'
import { X } from 'lucide-react'
import clsx from 'clsx'

type ItemDraft = Omit<Item, 'id' | 'created_at'>

const EMPTY_DRAFT: ItemDraft = {
  name: '',
  description: '',
  images: [],
  price: 0,
  can_be_cut: false,
  can_buy_half: null,
  is_vegan: false,
  available_days: [],
}

interface ItemFormProps {
  initial?: Item
  onSave: (data: ItemDraft) => Promise<void>
  onCancel: () => void
}

function Toggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={clsx(
        'relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-400',
        value ? 'bg-brown-500' : 'bg-brown-200'
      )}
      role="switch"
      aria-checked={value ?? false}
    >
      <span className={clsx(
        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
        value ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  )
}

export function ItemForm({ initial, onSave, onCancel }: ItemFormProps) {
  const { t } = useI18n()
  const [draft, setDraft] = useState<ItemDraft>(() =>
    initial
      ? { name: initial.name, description: initial.description, images: initial.images,
          price: initial.price, can_be_cut: initial.can_be_cut, can_buy_half: initial.can_buy_half,
          is_vegan: initial.is_vegan, available_days: initial.available_days }
      : { ...EMPTY_DRAFT, available_days: [] }
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ItemDraft, string>>>({})

  const set = <K extends keyof ItemDraft>(key: K, value: ItemDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }))
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  const toggleDay = (day: number) => {
    set('available_days', draft.available_days.includes(day)
      ? draft.available_days.filter(d => d !== day)
      : [...draft.available_days, day].sort((a, b) => a - b)
    )
  }

  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!draft.name.trim()) e.name = t('itemForm.err.name')
    if (draft.price <= 0) e.price = t('itemForm.err.price')
    if (draft.available_days.length === 0) e.available_days = t('itemForm.err.days')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await onSave(draft)
    setSaving(false)
  }

  const DAY_SHORTS = Array.from({ length: 7 }, (_, i) => t(`day.short.${i}` as any))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border">
          <h2 className="text-lg font-semibold text-brown-800">
            {initial ? t('itemForm.editItem') : t('itemForm.newItem')}
          </h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-cream-100 text-brown-400 hover:text-brown-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              {t('itemForm.name')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={e => set('name', e.target.value)}
              placeholder={t('itemForm.namePlaceholder')}
              className={clsx('input-base', errors.name && 'border-red-300 focus:ring-red-200')}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              {t('itemForm.description')}
              <span className="text-brown-300 font-normal ml-1">({draft.description.length}/100)</span>
            </label>
            <textarea
              value={draft.description}
              onChange={e => set('description', e.target.value.slice(0, 100))}
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('itemForm.images')}</label>
            <ImageUploader images={draft.images} onChange={imgs => set('images', imgs)} maxImages={3} />
          </div>

          {/* Price */}
          <div className="w-48">
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              {t('itemForm.price')} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 text-sm">₪</span>
              <input
                type="number"
                min={0}
                step={0.5}
                value={draft.price || ''}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={clsx('input-base pl-7', errors.price && 'border-red-300 focus:ring-red-200')}
              />
            </div>
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brown-700">{t('itemForm.canBeCut')}</p>
                  <p className="text-xs text-brown-400">{t('itemForm.canBeCutDesc')}</p>
                </div>
                <Toggle value={draft.can_be_cut} onChange={v => set('can_be_cut', v)} />
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brown-700">
                    {t('itemForm.halfPortion')}
                    <span className="ml-1 text-xs text-brown-300 font-normal">({t('itemForm.optional')})</span>
                  </p>
                  <p className="text-xs text-brown-400">{t('itemForm.halfPortionDesc')}</p>
                </div>
                <Toggle value={draft.can_buy_half} onChange={v => set('can_buy_half', v)} />
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brown-700">{t('itemForm.isVegan')}</p>
                  <p className="text-xs text-brown-400">{t('itemForm.isVeganDesc')}</p>
                </div>
                <Toggle value={draft.is_vegan} onChange={v => set('is_vegan', v)} />
              </div>
            </div>
          </div>

          {/* Available days */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              {t('itemForm.availableDays')} <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DAY_SHORTS.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={clsx(
                    'w-12 h-10 rounded-lg text-sm font-medium transition-colors',
                    draft.available_days.includes(i)
                      ? 'bg-brown-600 text-cream-100'
                      : 'bg-cream-100 text-brown-500 hover:bg-brown-100 border border-warm-border'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.available_days && (
              <p className="text-xs text-red-500 mt-1">{errors.available_days}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-warm-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-brown-600 hover:bg-cream-100"
            >
              {t('itemForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                bg-brown-600 hover:bg-brown-700 text-cream-100 disabled:opacity-50"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
              )}
              {initial ? t('itemForm.saveChanges') : t('itemForm.createItem')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
