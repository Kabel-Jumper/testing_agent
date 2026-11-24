export type ItemCategory =
  | 'KTM & Dokumen'
  | 'Elektronik & Charger'
  | 'Kunci & Kendaraan'
  | 'Buku & Alat Tulis'
  | 'Tas & Botol Minum'
  | 'Lainnya';

export type ItemType = 'hilang' | 'ditemukan';
export type ItemStatus = 'aktif' | 'selesai' | 'dibatalkan';

export type CampusZone =
  | 'Semua Area Kampus'
  | 'Gedung Kuliah / Fakultas'
  | 'Perpustakaan Pusat'
  | 'Masjid Kampus'
  | 'Kantin & Taman'
  | 'Area Parkir & Gerbang';

export const CAMPUS_ZONE_COORDINATES: Record<
  CampusZone,
  { center: [number, number]; zoom: number }
> = {
  'Semua Area Kampus': { center: [-3.4835, 114.8425], zoom: 16.5 },
  'Gedung Kuliah / Fakultas': { center: [-3.4835, 114.8431], zoom: 17.5 },
  'Perpustakaan Pusat': { center: [-3.483, 114.8433], zoom: 18 },
  'Masjid Kampus': { center: [-3.4826, 114.8418], zoom: 18 },
  'Kantin & Taman': { center: [-3.4841, 114.8422], zoom: 18 },
  'Area Parkir & Gerbang': { center: [-3.4845, 114.8415], zoom: 17.5 },
};

export interface Item {
  id: string;
  title: string;
  category: ItemCategory;
  type: ItemType;
  status: ItemStatus;
  description: string;
  location_name: string;
  campus_zone: CampusZone;
  latitude: number;
  longitude: number;
  date_time: string; // ISO string
  photo_url?: string;
  is_photo_blurred: boolean;
  security_question: string;
  security_answer_hint?: string;
  reporter_name: string;
  reporter_role?: string;
  reporter_contact: string;
  reporter_user_id?: string;
  created_at: string;
}

export interface Claim {
  id: string;
  item_id: string;
  claimant_name: string;
  claimant_contact: string;
  claimant_answer: string;
  claimant_user_id?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  email: string;
  nim_or_nip?: string;
  faculty_or_unit?: string;
  role: 'Mahasiswa' | 'Dosen' | 'Staf Tendik' | 'Satpam Kampus';
  avatar_url?: string;
  campus_zone?: CampusZone;
}
