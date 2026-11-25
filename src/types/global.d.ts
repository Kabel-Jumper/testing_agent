// Global type declarations for Titik Temu - UIN Antasari Kampus 2
// Memungkinkan import file CSS (seperti 'leaflet/dist/leaflet.css') tanpa error TypeScript

declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}
