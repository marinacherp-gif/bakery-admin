'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Locale = 'en' | 'he' | 'ru'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
  ru: 'Русский',
}

export const RTL_LOCALES: Locale[] = ['he']

// ─── Translations ──────────────────────────────────────────────────────────────

const translations = {
  en: {
    // Sidebar
    'sidebar.bakery': 'Bakery',
    'sidebar.adminPanel': 'Admin Panel',
    'sidebar.menu': 'Menu',
    'sidebar.signOut': 'Sign out',
    'sidebar.language': 'Language',
    // Nav
    'nav.announcements': 'Announcements',
    'nav.openingHours': 'Opening Hours',
    'nav.items': 'Items',
    'nav.contact': 'Contact Info',
    // Login
    'login.title': 'Bakery Admin',
    'login.subtitle': 'Management Dashboard',
    'login.signIn': 'Sign in',
    'login.signInDesc': 'Access is restricted to authorized staff only.',
    'login.signInWithGoogle': 'Sign in with Google',
    'login.restricted': 'Only authorized email addresses can access this dashboard.',
    // Announcements
    'announcements.title': 'Announcements',
    'announcements.subtitle': 'Manage messages shown to customers',
    'announcements.new': 'New Announcement',
    'announcements.placeholder': 'Write an announcement for your customers…',
    'announcements.add': 'Add',
    'announcements.empty': 'No announcements yet. Add your first one above.',
    'announcements.deactivate': 'Deactivate',
    'announcements.activate': 'Activate',
    'announcements.delete': 'Delete',
    'announcements.active': 'active',
    'announcements.inactive': 'inactive',
    // Opening Hours
    'hours.title': 'Opening Hours',
    'hours.subtitle': 'Set your weekly schedule',
    'hours.saveChanges': 'Save changes',
    'hours.saved': 'Saved!',
    'hours.day': 'Day',
    'hours.status': 'Status',
    'hours.opens': 'Opens',
    'hours.closes': 'Closes',
    'hours.daysOpen': '{n} days open per week',
    // Days
    'day.0': 'Sunday',
    'day.1': 'Monday',
    'day.2': 'Tuesday',
    'day.3': 'Wednesday',
    'day.4': 'Thursday',
    'day.5': 'Friday',
    'day.6': 'Saturday',
    'day.short.0': 'Sun',
    'day.short.1': 'Mon',
    'day.short.2': 'Tue',
    'day.short.3': 'Wed',
    'day.short.4': 'Thu',
    'day.short.5': 'Fri',
    'day.short.6': 'Sat',
    // Items
    'items.title': 'Items',
    'items.subtitle': '{n} item in your menu',
    'items.subtitlePlural': '{n} items in your menu',
    'items.addItem': 'Add item',
    'items.empty': 'No items yet. Add your first menu item.',
    'items.edit': 'Edit',
    'items.delete': 'Delete',
    'items.vegan': 'Vegan',
    'items.canCut': 'Can cut',
    'items.halfPortion': 'Half portion',
    // Item Form
    'itemForm.newItem': 'New Item',
    'itemForm.editItem': 'Edit Item',
    'itemForm.name': 'Name',
    'itemForm.namePlaceholder': 'e.g. Sourdough Loaf',
    'itemForm.description': 'Description',
    'itemForm.images': 'Images',
    'itemForm.price': 'Price',
    'itemForm.canBeCut': 'Can be cut',
    'itemForm.canBeCutDesc': 'Offer cutting option',
    'itemForm.halfPortion': 'Half portion',
    'itemForm.halfPortionDesc': 'Allow buying half',
    'itemForm.optional': 'optional',
    'itemForm.isVegan': 'Vegan',
    'itemForm.isVeganDesc': 'Mark as vegan',
    'itemForm.availableDays': 'Available days',
    'itemForm.cancel': 'Cancel',
    'itemForm.createItem': 'Create item',
    'itemForm.saveChanges': 'Save changes',
    'itemForm.err.name': 'Name is required',
    'itemForm.err.price': 'Price must be greater than 0',
    'itemForm.err.days': 'Select at least one day',
    // Image Uploader
    'uploader.add': 'Add',
    'uploader.hint': 'Up to {max} images · {current}/{max} uploaded',
    // Contact
    'contact.title': 'Contact Info',
    'contact.subtitle': 'Update your public contact details',
    'contact.phone': 'Phone number',
    'contact.phonePlaceholder': '+972 50-000-0000',
    'contact.email': 'Email address',
    'contact.emailPlaceholder': 'hello@yourbakery.com',
    'contact.address': 'Physical address',
    'contact.addressPlaceholder': '14 Baker St, Tel Aviv',
    'contact.social': 'Social Links',
    'contact.instagram': 'Instagram',
    'contact.facebook': 'Facebook',
    'contact.saveChanges': 'Save changes',
    'contact.saved': 'Saved!',
    'contact.optional': 'optional',
  },

  he: {
    'sidebar.bakery': 'המאפייה',
    'sidebar.adminPanel': 'פאנל ניהול',
    'sidebar.menu': 'תפריט',
    'sidebar.signOut': 'התנתק',
    'sidebar.language': 'שפה',
    'nav.announcements': 'הודעות',
    'nav.openingHours': 'שעות פתיחה',
    'nav.items': 'מוצרים',
    'nav.contact': 'פרטי קשר',
    'login.title': 'ניהול מאפייה',
    'login.subtitle': 'לוח בקרה',
    'login.signIn': 'התחברות',
    'login.signInDesc': 'הגישה מוגבלת לצוות מורשה בלבד.',
    'login.signInWithGoogle': 'כניסה עם Google',
    'login.restricted': 'רק כתובות אימייל מורשות יכולות לגשת ללוח הבקרה.',
    'announcements.title': 'הודעות',
    'announcements.subtitle': 'ניהול הודעות המוצגות ללקוחות',
    'announcements.new': 'הודעה חדשה',
    'announcements.placeholder': 'כתוב הודעה ללקוחות שלך…',
    'announcements.add': 'הוסף',
    'announcements.empty': 'אין הודעות עדיין. הוסף את הראשונה למעלה.',
    'announcements.deactivate': 'השבת',
    'announcements.activate': 'הפעל',
    'announcements.delete': 'מחק',
    'announcements.active': 'פעיל',
    'announcements.inactive': 'לא פעיל',
    'hours.title': 'שעות פתיחה',
    'hours.subtitle': 'הגדר את לוח הזמנים השבועי',
    'hours.saveChanges': 'שמור שינויים',
    'hours.saved': 'נשמר!',
    'hours.day': 'יום',
    'hours.status': 'סטטוס',
    'hours.opens': 'פתיחה',
    'hours.closes': 'סגירה',
    'hours.daysOpen': '{n} ימי פתיחה בשבוע',
    'day.0': 'ראשון',
    'day.1': 'שני',
    'day.2': 'שלישי',
    'day.3': 'רביעי',
    'day.4': 'חמישי',
    'day.5': 'שישי',
    'day.6': 'שבת',
    'day.short.0': 'א׳',
    'day.short.1': 'ב׳',
    'day.short.2': 'ג׳',
    'day.short.3': 'ד׳',
    'day.short.4': 'ה׳',
    'day.short.5': 'ו׳',
    'day.short.6': 'ש׳',
    'items.title': 'מוצרים',
    'items.subtitle': 'מוצר אחד בתפריט',
    'items.subtitlePlural': '{n} מוצרים בתפריט',
    'items.addItem': 'הוסף מוצר',
    'items.empty': 'אין מוצרים עדיין. הוסף את המוצר הראשון.',
    'items.edit': 'עריכה',
    'items.delete': 'מחיקה',
    'items.vegan': 'טבעוני',
    'items.canCut': 'ניתן לחתוך',
    'items.halfPortion': 'חצי מנה',
    'itemForm.newItem': 'מוצר חדש',
    'itemForm.editItem': 'עריכת מוצר',
    'itemForm.name': 'שם',
    'itemForm.namePlaceholder': 'לדוגמה: לחם מחמצת',
    'itemForm.description': 'תיאור',
    'itemForm.images': 'תמונות',
    'itemForm.price': 'מחיר',
    'itemForm.canBeCut': 'ניתן לחתוך',
    'itemForm.canBeCutDesc': 'הצע אפשרות חיתוך',
    'itemForm.halfPortion': 'חצי מנה',
    'itemForm.halfPortionDesc': 'אפשר קנייה של חצי',
    'itemForm.optional': 'אופציונלי',
    'itemForm.isVegan': 'טבעוני',
    'itemForm.isVeganDesc': 'סמן כטבעוני',
    'itemForm.availableDays': 'ימי זמינות',
    'itemForm.cancel': 'ביטול',
    'itemForm.createItem': 'צור מוצר',
    'itemForm.saveChanges': 'שמור שינויים',
    'itemForm.err.name': 'שם הוא שדה חובה',
    'itemForm.err.price': 'המחיר חייב להיות גדול מ-0',
    'itemForm.err.days': 'יש לבחור לפחות יום אחד',
    'uploader.add': 'הוסף',
    'uploader.hint': 'עד {max} תמונות · {current}/{max} הועלו',
    'contact.title': 'פרטי קשר',
    'contact.subtitle': 'עדכן את פרטי הקשר הציבוריים שלך',
    'contact.phone': 'מספר טלפון',
    'contact.phonePlaceholder': '050-000-0000',
    'contact.email': 'כתובת אימייל',
    'contact.emailPlaceholder': 'hello@hamafiya.co.il',
    'contact.address': 'כתובת פיזית',
    'contact.addressPlaceholder': 'רחוב הבייקר 14, תל אביב',
    'contact.social': 'רשתות חברתיות',
    'contact.instagram': 'אינסטגרם',
    'contact.facebook': 'פייסבוק',
    'contact.saveChanges': 'שמור שינויים',
    'contact.saved': 'נשמר!',
    'contact.optional': 'אופציונלי',
  },

  ru: {
    'sidebar.bakery': 'Пекарня',
    'sidebar.adminPanel': 'Панель управления',
    'sidebar.menu': 'Меню',
    'sidebar.signOut': 'Выйти',
    'sidebar.language': 'Язык',
    'nav.announcements': 'Объявления',
    'nav.openingHours': 'Часы работы',
    'nav.items': 'Товары',
    'nav.contact': 'Контакты',
    'login.title': 'Управление пекарней',
    'login.subtitle': 'Панель администратора',
    'login.signIn': 'Войти',
    'login.signInDesc': 'Доступ разрешён только авторизованным сотрудникам.',
    'login.signInWithGoogle': 'Войти через Google',
    'login.restricted': 'Только авторизованные адреса могут получить доступ.',
    'announcements.title': 'Объявления',
    'announcements.subtitle': 'Управление сообщениями для клиентов',
    'announcements.new': 'Новое объявление',
    'announcements.placeholder': 'Напишите объявление для клиентов…',
    'announcements.add': 'Добавить',
    'announcements.empty': 'Объявлений пока нет. Добавьте первое выше.',
    'announcements.deactivate': 'Деактивировать',
    'announcements.activate': 'Активировать',
    'announcements.delete': 'Удалить',
    'announcements.active': 'активно',
    'announcements.inactive': 'неактивно',
    'hours.title': 'Часы работы',
    'hours.subtitle': 'Настройте расписание на неделю',
    'hours.saveChanges': 'Сохранить',
    'hours.saved': 'Сохранено!',
    'hours.day': 'День',
    'hours.status': 'Статус',
    'hours.opens': 'Открытие',
    'hours.closes': 'Закрытие',
    'hours.daysOpen': '{n} рабочих дней в неделю',
    'day.0': 'Воскресенье',
    'day.1': 'Понедельник',
    'day.2': 'Вторник',
    'day.3': 'Среда',
    'day.4': 'Четверг',
    'day.5': 'Пятница',
    'day.6': 'Суббота',
    'day.short.0': 'Вс',
    'day.short.1': 'Пн',
    'day.short.2': 'Вт',
    'day.short.3': 'Ср',
    'day.short.4': 'Чт',
    'day.short.5': 'Пт',
    'day.short.6': 'Сб',
    'items.title': 'Товары',
    'items.subtitle': '{n} товар в меню',
    'items.subtitlePlural': '{n} товаров в меню',
    'items.addItem': 'Добавить товар',
    'items.empty': 'Товаров пока нет. Добавьте первый.',
    'items.edit': 'Изменить',
    'items.delete': 'Удалить',
    'items.vegan': 'Веган',
    'items.canCut': 'Можно нарезать',
    'items.halfPortion': 'Полпорции',
    'itemForm.newItem': 'Новый товар',
    'itemForm.editItem': 'Редактировать товар',
    'itemForm.name': 'Название',
    'itemForm.namePlaceholder': 'Например: Хлеб на закваске',
    'itemForm.description': 'Описание',
    'itemForm.images': 'Фотографии',
    'itemForm.price': 'Цена',
    'itemForm.canBeCut': 'Можно нарезать',
    'itemForm.canBeCutDesc': 'Предложить нарезку',
    'itemForm.halfPortion': 'Полпорции',
    'itemForm.halfPortionDesc': 'Разрешить покупку половины',
    'itemForm.optional': 'необязательно',
    'itemForm.isVegan': 'Веган',
    'itemForm.isVeganDesc': 'Пометить как веганское',
    'itemForm.availableDays': 'Дни продажи',
    'itemForm.cancel': 'Отмена',
    'itemForm.createItem': 'Создать товар',
    'itemForm.saveChanges': 'Сохранить',
    'itemForm.err.name': 'Название обязательно',
    'itemForm.err.price': 'Цена должна быть больше 0',
    'itemForm.err.days': 'Выберите хотя бы один день',
    'uploader.add': 'Добавить',
    'uploader.hint': 'До {max} фото · загружено {current}/{max}',
    'contact.title': 'Контактная информация',
    'contact.subtitle': 'Обновите публичные контактные данные',
    'contact.phone': 'Номер телефона',
    'contact.phonePlaceholder': '+972 50-000-0000',
    'contact.email': 'Электронная почта',
    'contact.emailPlaceholder': 'hello@bakery.com',
    'contact.address': 'Физический адрес',
    'contact.addressPlaceholder': 'ул. Пекарская 14, Тель-Авив',
    'contact.social': 'Социальные сети',
    'contact.instagram': 'Instagram',
    'contact.facebook': 'Facebook',
    'contact.saveChanges': 'Сохранить',
    'contact.saved': 'Сохранено!',
    'contact.optional': 'необязательно',
  },
} as const

type TranslationKey = keyof typeof translations.en

// ─── Context ───────────────────────────────────────────────────────────────────

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('admin_locale') as Locale | null
    if (stored && stored in translations) setLocaleState(stored)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('admin_locale', l)
    document.documentElement.lang = l
    document.documentElement.dir = RTL_LOCALES.includes(l) ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
  }, [locale])

  const isRTL = RTL_LOCALES.includes(locale)

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    const dict = translations[locale] as Record<string, string>
    let str = dict[key] ?? (translations.en as Record<string, string>)[key] ?? key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v))
      })
    }
    return str
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
