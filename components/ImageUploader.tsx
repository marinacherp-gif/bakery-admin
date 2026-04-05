'use client'

import { useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { ImagePlus, X } from 'lucide-react'
import clsx from 'clsx'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 3 }: ImageUploaderProps) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const remaining = maxImages - images.length
    const toProcess = Array.from(files).slice(0, remaining)
    toProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result as string
        onChange([...images, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => onChange(images.filter((_, i) => i !== index))
  const canAdd = images.length < maxImages

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-warm-border bg-cream-100 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={20} className="text-white" />
            </button>
            <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">{i + 1}</span>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={clsx(
              'w-24 h-24 rounded-lg border-2 border-dashed border-brown-200',
              'flex flex-col items-center justify-center gap-1',
              'text-brown-300 hover:border-brown-400 hover:text-brown-500 hover:bg-cream-100',
              'transition-colors flex-shrink-0'
            )}
          >
            <ImagePlus size={20} />
            <span className="text-xs">{t('uploader.add')}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
        onClick={e => { (e.target as HTMLInputElement).value = '' }}
      />

      <p className="text-xs text-brown-300 mt-2">
        {t('uploader.hint', { max: maxImages, current: images.length })}
      </p>
    </div>
  )
}
