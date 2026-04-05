'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Item } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { ItemForm } from '@/components/ItemForm'
import { Plus, Pencil, Trash2, ShoppingBasket, Leaf } from 'lucide-react'
import clsx from 'clsx'

type ItemDraft = Omit<Item, 'id' | 'created_at'>

export default function ItemsPage() {
  const { t } = useI18n()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'new' | Item | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  const handleSave = async (data: ItemDraft) => {
    if (modal === 'new') {
      const { data: created } = await supabase
        .from('items')
        .insert(data)
        .select()
        .single()
      if (created) setItems(prev => [created, ...prev])
    } else if (modal && typeof modal === 'object') {
      const { data: updated } = await supabase
        .from('items')
        .update(data)
        .eq('id', modal.id)
        .select()
        .single()
      if (updated) setItems(prev => prev.map(it => it.id === modal.id ? updated : it))
    }
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('items').delete().eq('id', id)
    setItems(prev => prev.filter(it => it.id !== id))
    setDeletingId(null)
  }

  const DAY_SHORTS = Array.from({ length: 7 }, (_, i) => t(`day.short.${i}` as any))

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center">
            <ShoppingBasket className="text-brown-500" size={20} />
          </div>
          <div>
            <h1 className="page-title">{t('items.title')}</h1>
            <p className="text-sm text-brown-400 mt-0.5">
              {items.length === 1
                ? t('items.subtitle', { n: 1 })
                : t('items.subtitlePlural', { n: items.length })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-brown-600 hover:bg-brown-700 text-cream-100 text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          {t('items.addItem')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-6 h-6 border-2 border-brown-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="card p-16 text-center">
          <ShoppingBasket className="mx-auto text-brown-200 mb-3" size={40} />
          <p className="text-brown-400 text-sm">{t('items.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex flex-col group hover:shadow-md transition-shadow">
              <div className="aspect-video rounded-lg bg-cream-100 mb-3 overflow-hidden flex items-center justify-center">
                {item.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBasket className="text-brown-200" size={32} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-brown-800 leading-tight">{item.name}</h3>
                  <span className="text-sm font-semibold text-brown-600 flex-shrink-0">₪{item.price}</span>
                </div>

                {item.description && (
                  <p className="text-xs text-brown-400 leading-relaxed mb-2 line-clamp-2">{item.description}</p>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {item.category && (
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-medium border',
                      item.category === 'bread'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-pink-50 text-pink-700 border-pink-100'
                    )}>
                      {item.category === 'bread' ? '🍞 Bread' : '🥐 Pastry'}
                    </span>
                  )}
                  {item.is_vegan && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-100">
                      <Leaf size={10} /> {t('items.vegan')}
                    </span>
                  )}
                  {item.can_be_cut && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-100">
                      {t('items.canCut')}
                    </span>
                  )}
                  {item.can_buy_half && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-600 border border-amber-100">
                      {t('items.halfPortion')}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-0.5">
                  {DAY_SHORTS.map((d, i) => (
                    <span
                      key={i}
                      className={clsx(
                        'text-xs px-1.5 py-0.5 rounded',
                        item.available_days.includes(i)
                          ? 'bg-brown-100 text-brown-600 font-medium'
                          : 'bg-cream-50 text-brown-200'
                      )}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-warm-border">
                <button
                  onClick={() => setModal(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                    text-xs font-medium text-brown-600 hover:bg-cream-100 border border-warm-border"
                >
                  <Pencil size={13} /> {t('items.edit')}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                    text-xs font-medium text-red-500 hover:bg-red-50 border border-warm-border"
                >
                  {deletingId === item.id
                    ? <span className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                    : <Trash2 size={13} />
                  }
                  {t('items.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <ItemForm
          initial={modal === 'new' ? undefined : modal}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
