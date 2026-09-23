import fs from 'node:fs';
import path from 'node:path';
import 'server-only';

export type GalleryGroup = { id: string; title: string; images: { src: string; alt: string }[] };

const GROUPS: { id: string; title: string; dir: string; limit?: number }[] = [
  { id: 'campus', title: 'Campus & events', dir: 'images/events', limit: 16 },
  { id: 'press', title: 'Press', dir: 'press', limit: 24 },
  { id: 'sih', title: 'Smart India Hackathon', dir: 'departments/sih-2022', limit: 24 },
  { id: 'library', title: 'Central Library', dir: 'library/gallery', limit: 16 },
  { id: 'sports', title: 'Sports & fire-safety drills', dir: 'facilities/fire_safety', limit: 12 },
];

function list(dir: string, limit = 24) {
  const abs = path.join(process.cwd(), 'public', 'images', dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .slice(0, limit)
    .map((f) => ({ src: `/images/${dir}/${f}`.replace(/ /g, '%20'), alt: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') }));
}

export function getGalleries(): GalleryGroup[] {
  const campusExtras = ['images/office.jpg', 'images/qiscetgal_1.jpg', 'images/qiscetgal_2.jpg', 'images/qiscetgal_3.jpg', 'images/s4.jpg', 'images/s6.jpg', 'images/s7.jpg', 'images/hostel1.jpg', 'images/physical_education_header.jpg']
    .map((src) => ({ src: `/images/${src}`, alt: 'QISCET campus' }));
  return [
    { id: 'campus', title: 'Campus & events', images: [...campusExtras, ...list('images/events', 12)] },
    ...GROUPS.filter((g) => g.id !== 'campus').map((g) => ({ id: g.id, title: g.title, images: list(g.dir, g.limit) })),
  ].filter((g) => g.images.length);
}
