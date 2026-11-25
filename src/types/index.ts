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

// Titik Koordinat Presisi Kampus 2 UIN Antasari Banjarmasin (Jl. Pandarapan, Guntung Manggis, Banjarbaru)
export const CAMPUS_CENTER: [number, number] = [-3.4675, 114.8195];
export const CAMPUS_DEFAULT_ZOOM = 17;

// Batas wilayah maksimum agar peta tidak bergeser terlalu jauh dari area kampus
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [-3.476, 114.81], // Sudut barat daya
  [-3.459, 114.829], // Sudut timur laut
];

export const CAMPUS_ZONE_COORDINATES: Record<
  CampusZone,
  { center: [number, number]; zoom: number }
> = {
  'Semua Area Kampus': { center: [-3.4675, 114.8195], zoom: 17 },
  'Gedung Kuliah / Fakultas': { center: [-3.4672, 114.8193], zoom: 17.5 },
  'Perpustakaan Pusat': { center: [-3.4678, 114.8201], zoom: 18 },
  'Masjid Kampus': { center: [-3.4683, 114.8189], zoom: 18 },
  'Kantin & Taman': { center: [-3.4676, 114.8197], zoom: 18 },
  'Area Parkir & Gerbang': { center: [-3.4658, 114.8188], zoom: 17.5 },
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
