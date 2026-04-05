import type { Announcement, OpeningHour, Item, ContactInfo } from './supabase'

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    text: 'We will be closed on April 15th for Passover preparations. Orders placed before April 13th will be fulfilled.',
    is_active: true,
    created_at: '2026-03-20T10:00:00Z',
  },
  {
    id: '2',
    text: 'New seasonal item: Rosewater Babka! Available Thursday–Saturday only.',
    is_active: true,
    created_at: '2026-03-18T09:00:00Z',
  },
  {
    id: '3',
    text: 'Holiday pre-orders are now open. Contact us via WhatsApp to reserve your cake.',
    is_active: false,
    created_at: '2026-03-01T08:00:00Z',
  },
]

export const mockOpeningHours: OpeningHour[] = [
  { id: '1', day_of_week: 0, is_open: false, open_time: '09:00', close_time: '14:00' }, // Sun
  { id: '2', day_of_week: 1, is_open: true,  open_time: '08:00', close_time: '18:00' }, // Mon
  { id: '3', day_of_week: 2, is_open: true,  open_time: '08:00', close_time: '18:00' }, // Tue
  { id: '4', day_of_week: 3, is_open: true,  open_time: '08:00', close_time: '18:00' }, // Wed
  { id: '5', day_of_week: 4, is_open: true,  open_time: '08:00', close_time: '19:00' }, // Thu
  { id: '6', day_of_week: 5, is_open: true,  open_time: '08:00', close_time: '19:00' }, // Fri
  { id: '7', day_of_week: 6, is_open: true,  open_time: '09:00', close_time: '15:00' }, // Sat
]

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Sourdough Loaf',
    description: 'Classic country sourdough with a crispy crust and chewy crumb. Made with 72-hour cold fermentation.',
    images: [],
    price: 32,
    can_be_cut: true,
    can_buy_half: true,
    is_vegan: true,
    available_days: [1, 2, 3, 4, 5, 6],
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Chocolate Babka',
    description: 'Buttery brioche swirled with dark chocolate paste and finished with a sugar syrup glaze.',
    images: [],
    price: 58,
    can_be_cut: true,
    can_buy_half: false,
    is_vegan: false,
    available_days: [4, 5, 6],
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: '3',
    name: 'Almond Croissant',
    description: 'Flaky, laminated dough filled with almond cream and topped with sliced almonds.',
    images: [],
    price: 18,
    can_be_cut: false,
    can_buy_half: null,
    is_vegan: false,
    available_days: [1, 2, 3, 4, 5, 6],
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: '4',
    name: 'Tahini Cookies (6 pcs)',
    description: 'Melt-in-your-mouth sesame cookies with a hint of vanilla. Vegan and nut-free.',
    images: [],
    price: 24,
    can_be_cut: false,
    can_buy_half: null,
    is_vegan: true,
    available_days: [0, 1, 2, 3, 4, 5, 6],
    created_at: '2026-02-10T08:00:00Z',
  },
]

export const mockContactInfo: ContactInfo = {
  id: '1',
  phone: '+972 50-123-4567',
  email: 'hello@ourbakery.co.il',
  address: '14 HaRav Kook St, Tel Aviv',
  instagram: 'https://instagram.com/ourbakery',
  facebook: 'https://facebook.com/ourbakery',
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
