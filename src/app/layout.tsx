import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'titik temu — Lost & Found Kampus 2 UIN Antasari Banjarmasin (Banjarbaru)',
  description:
    'Platform gotong royong mahasiswa, dosen, dan tenaga kependidikan Kampus 2 UIN Antasari Banjarmasin di Jl. Pandarapan, Guntung Manggis, Banjarbaru untuk saling mengembalikan barang hilang dengan amanah dan terverifikasi.',
  keywords: [
    'lost and found uin antasari',
    'barang hilang uin antasari kampus 2',
    'uin antasari banjarbaru',
    'kampus 2 pandarapan guntung manggis',
    'titik temu kampus',
    'gedung kuliah terpadu uin antasari',
    'perpustakaan uin antasari kampus 2',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F4F7F9] text-[#334155] antialiased">
        {children}
      </body>
    </html>
  );
}
