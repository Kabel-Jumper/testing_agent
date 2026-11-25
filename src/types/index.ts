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

// Titik Pusat Presisi Kampus 2 UIN Antasari Banjarmasin (Jalan Pandarapan, Guntung Manggis)
export const CAMPUS_CENTER: [number, number] = [-3.4742, 114.7775];
export const CAMPUS_DEFAULT_ZOOM = 17;

// Zona Koordinat Presisi di dalam kompleks Jalan Pandarapan
export const CAMPUS_ZONE_COORDINATES: Record<
  CampusZone,
  { center: [number, number]; zoom: number }
> = {
  'Semua Area Kampus': { center: [-3.4742, 114.7775], zoom: 17 },
  'Gedung Kuliah / Fakultas': { center: [-3.4732, 114.7778], zoom: 17.5 },
  'Perpustakaan Pusat': { center: [-3.4745, 114.7772], zoom: 18 },
  'Masjid Kampus': { center: [-3.4756, 114.7768], zoom: 18 },
  'Kantin & Taman': { center: [-3.474, 114.7774], zoom: 18 },
  'Area Parkir & Gerbang': { center: [-3.4718, 114.7785], zoom: 17.5 },
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
