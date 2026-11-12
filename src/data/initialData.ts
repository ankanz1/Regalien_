import { CompanyConfig, Project } from '../types';

// Verified business contact information retained as static site configuration.
export const INITIAL_COMPANY_CONFIG: CompanyConfig = {
  name: 'Regalien Infrastructure Pvt Ltd',
  tagline: 'Architectural Interiors & Bespoke Turnkey Living',
  phone: '+91 8981441040',
  whatsappNumber: '918981441040',
  email: 'regalieninteriors@gmail.com',
  address: 'ASR 026, ground floor, Astra Towers, Newtown, Action Area IIC, kolkata - 700161',
  googleMapsUrl: 'https://maps.app.goo.gl/1hzEZGmSfmzfCoAq7?g_st=aw',
  instagramUrl: 'https://www.instagram.com/regalieninteriors',
  facebookUrl: 'https://www.facebook.com/share/1CWYE9opuw/',
  youtubeUrl: 'https://youtube.com/@regalieninterior?si=4ZrXDHItPCkTMBgB',
  officeHours: 'Monday – Saturday: 10:00 AM – 7:30 PM (Sunday by Prior Appointment)',
};

const asset = (...parts: string[]) => `/${parts.map((part) => encodeURIComponent(part)).join('/')}`;
const numbered = (folder: string, count: number) =>
  Array.from({ length: count }, (_, index) => asset(folder, `${index + 1}.jpg`));

const rishiImages = [
  ['Living area', 'DSC08587.JPG'], ['Living area', 'DSC08606.JPG'], ['Living area', 'DSC08608.JPG'],
  ['Living area', 'DSC08618.JPG'], ['Living area', 'DSC08621.JPG'], ['Living area', 'DSC08633.JPG'],
  ['Living area', 'DSC08635.JPG'], ['Living area', 'DSC08643.JPG'],
  ['ceiling & lights', 'DSC08588.JPG'], ['ceiling & lights', 'DSC08597.JPG'],
  ['ceiling & lights', 'DSC08600.JPG'], ['ceiling & lights', 'DSC08627.JPG'],
  ['ceiling & lights', 'DSC08630.JPG'],
  ['Guest bedroom/Bed', 'DSC08648.JPG'], ['Guest bedroom/Bed', 'DSC08652.JPG'],
  ['Guest bedroom/Wardrobe', 'DSC08656.JPG'], ['Guest bedroom/Wardrobe', 'DSC08658.JPG'],
  ['Guest bedroom/Washroom', 'DSC08664.JPG'], ['Guest bedroom/Washroom', 'DSC08666.JPG'],
  ['Kids bedroom/Bed', 'DSC08729.JPG'], ['Kids bedroom/Bed', 'DSC08743.JPG'],
  ['Kids bedroom/Wardrobe', 'DSC08734.JPG'], ['Kids bedroom/Wardrobe', 'DSC08737.JPG'],
  ['Master bedroom/Bed', 'DSC08694.JPG'], ['Master bedroom/Bed', 'DSC08698.JPG'],
  ['Master bedroom/Wardrobe', 'DSC08691.JPG'], ['Master bedroom/Washroom', 'DSC08682.JPG'],
].map(([folder, file]) => asset('Rishi Pranaya', ...folder.split('/'), file));

const project = (
  id: string,
  title: string,
  category: Project['category'],
  coverImage: string,
  gallery: string[],
  videos: string[] = [],
): Project => ({
  id,
  title,
  category,
  location: 'Kolkata',
  year: 2026,
  areaSqFt: 0,
  client: '',
  description: `${title} — Regalien project photography and documentation.`,
  materials: [],
  features: [],
  coverImage,
  gallery,
  videos,
  featured: true,
  published: true,
  completionWeeks: 0,
});

export const REAL_PROJECTS: Project[] = [
  project(
    'local-aa-iiib',
    'AA-IIIB',
    'Luxury Residential',
    asset('AA-IIIB', '1.png'),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => asset('AA-IIIB', `${n}.png`))
      .concat([asset('AA-IIIB', '16.jpg'), asset('AA-IIIB', '17.png'), asset('AA-IIIB', '19.png'), asset('AA-IIIB', '20.jpg'), asset('AA-IIIB', '21.jpg')]),
    [asset('AA-IIIB', 'Media1.mp4'), asset('AA-IIIB', 'Media2.mp4'), asset('AA-IIIB', 'Media3.mp4')],
  ),
  project('local-anandi', 'Anandi Residency', 'Luxury Residential', asset('Anandi Residency', '1.jpg'), numbered('Anandi Residency', 7), [
    asset('Anandi Residency', 'WhatsApp Video 2026-10-27 at 2.43.35 PM.mp4'),
  ]),
  project('local-ca-218', 'CA-218 (Newtown AA-1)', 'Luxury Residential', asset('CA-218 ( NEWTOWN AA-1)', '1.jpg'), numbered('CA-218 ( NEWTOWN AA-1)', 5)),
  project('local-garfa', 'Garfa', 'Luxury Residential', asset('Garfa', '1.jpg'), numbered('Garfa', 10)),
  project('local-hiland', 'Hiland Willows (AA-11)', 'Luxury Residential', asset('Hiland Willows (AA-11)', '1.jpg'), numbered('Hiland Willows (AA-11)', 3)),
  project('local-office', 'Regalien Office', 'Commercial & Corporate', asset('Office', '1.jpg'), numbered('Office', 4), [
    asset('Office', 'WhatsApp Video 2026-11-05 at 6.11.16 PM.mp4'),
  ]),
  project('local-rishi', 'Rishi Pranaya', 'Luxury Residential', rishiImages[0], rishiImages, [
    asset('Rishi Pranaya', 'Videos', '3D.mp4'),
    asset('Rishi Pranaya', 'Videos', 'BEFORE AND AFTER.mp4'),
    asset('Rishi Pranaya', 'Videos', 'Long video (Rishi pranaya).mp4'),
    asset('Rishi Pranaya', 'Videos', 'Rishi (lights video).mp4'),
  ]),
  project('local-sunrise', 'Sunrise Point', 'Luxury Residential', asset('Sunrise point', '1.jpg'), numbered('Sunrise point', 11), [
    asset('Sunrise point', 'WhatsApp Video 2026-10-31 at 4.33.43 PM.mp4'),
  ]),
];
