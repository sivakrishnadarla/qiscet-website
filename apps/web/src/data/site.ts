/**
 * Single source of truth for NAP (Name-Address-Phone), brand & institutional facts.
 * Keep NAP identical everywhere (footer, contact page, JSON-LD) for local SEO consistency.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qiscet.edu.in').replace(/\/$/, '');
export const LEGACY_BASE = 'https://qiscet.edu.in/qiscet/';

export const site = {
  name: 'QIS College of Engineering & Technology',
  shortName: 'QISCET',
  legalName: 'QIS College of Engineering and Technology (Autonomous)',
  tagline: 'Quality is Strength',
  established: 1998,
  sponsor: 'Sri Nidamanuri Educational Society (SNES)',
  affiliation: 'Jawaharlal Nehru Technological University, Kakinada (JNTUK)',
  counsellingCode: 'QISE',
  description:
    'QIS College of Engineering & Technology (QISCET), Ongole is an Autonomous, NAAC A+ accredited, NBA accredited and NIRF ranked engineering college in Prakasam District, Andhra Pradesh, established in 1998 by Sri Nidamanuri Educational Society. Approved by AICTE and permanently affiliated to JNTU Kakinada, QISCET offers B.Tech, M.Tech, MBA, MCA and BCA programmes.',
  address: {
    street: 'Pondur Road, Vengamukkapalem',
    locality: 'Ongole',
    district: 'Prakasam District',
    region: 'Andhra Pradesh',
    postalCode: '523272',
    country: 'IN',
    full: 'Pondur Road, Vengamukkapalem, Ongole, Prakasam District, Andhra Pradesh – 523272',
  },
  geo: { lat: 15.479603, lng: 80.0196414 },
  phone: '+91 92464 19542',
  phoneHref: 'tel:+919246419542',
  admissionsPhone: '+91 92464 19530',
  admissionsPhoneHref: 'tel:+919246419530',
  admissionsPhones: ['+91 92464 19530', '+91 92464 19545', '+91 92464 19547', '+91 92464 19579'],
  whatsappHref: 'https://wa.me/919246419530?text=Hi%20QISCET%2C%20I%20would%20like%20to%20know%20about%20admissions%202026-27.',
  email: 'principal@qiscet.edu.in',
  newsletterEmail: 'newsletter@qiscet.edu.in',
  hrEmail: 'hr.jobs@qiscet.edu.in',
  hours: 'Monday – Saturday: 9:00 AM – 5:00 PM · Sunday: Closed',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.0896699944437!2d80.01745271486891!3d15.47960815908004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4b015caa06676d%3A0x9990b6b9455eda19!2sQIS%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1611649814394!5m2!1sen!2sin',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=QIS+College+of+Engineering+and+Technology+Ongole',
  /** Verified public profiles. Add LinkedIn / X handles here when available – null entries are not rendered. */
  social: {
    facebook: 'https://www.facebook.com/qisgroupofinstitutions/',
    instagram: 'https://www.instagram.com/qis_institutions/',
    youtube: 'https://www.youtube.com/watch?v=dCgEyZbhCog',
    linkedin: null as string | null,
    twitter: null as string | null,
  },
  portals: {
    studentLogin: 'http://qishub.qiscet.edu.in/qiscet',
    staffLogin: 'http://qishub.qiscet.edu.in/qiscet',
    results: 'http://www.qishub.in/QISResults/',
    grievance: '/grievance',
    degreeVerification: 'https://work.icredify.com/degreeverify/qiscet',
    nptel: 'http://nptel.qiscet.edu.in',
    qisFest: 'https://qiscet.edu.in/qisfest2026',
  },
  videos: {
    campusTour: 'https://www.youtube.com/watch?v=dCgEyZbhCog',
    campusTour2: 'https://www.youtube.com/watch?v=8z2qv-_yDLY',
  },
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W4F7HD49',
};

export const accreditations = [
  { code: 'NAAC A+', label: 'NAAC Accredited with A+ Grade', href: '/accreditation/naac' },
  { code: 'NBA', label: 'NBA Accredited Programmes', href: '/accreditation/nba' },
  { code: 'AUTONOMOUS', label: 'Autonomous Institution (UGC)', href: '/accreditation/autonomous' },
  { code: 'NIRF', label: 'NIRF Ranked – Engineering (Rank band 201–300, 2025)', href: '/rankings/nirf' },
  { code: 'AICTE', label: 'Approved by AICTE, New Delhi', href: 'https://www.aicte-india.org/' },
  { code: 'JNTUK', label: 'Permanently affiliated to JNTU Kakinada', href: 'https://www.jntuk.edu.in/' },
  { code: 'ISO 9001', label: 'ISO 9001:2015 Certified', href: '/rankings/iso' },
  { code: 'AAA+', label: 'Career360 AAA+ Rating', href: '/rankings/nirf' },
];

export const stats = [
  { value: 27, suffix: '+', label: 'Years of Excellence' },
  { value: 25, suffix: '+', label: 'UG & PG Programmes' },
  { value: 60, suffix: '+', label: 'Recruiting Companies / Year' },
  { value: 15, prefix: '₹', suffix: ' LPA', label: 'Highest Package' },
  { value: 254, suffix: '', label: 'Research Publications (2024-25)' },
  { value: 80, suffix: '+', label: 'MoUs with Industry & Universities' },
];

export const leadership = [
  {
    name: 'Dr. N. S. Kalyan Chakravarthy',
    qualification: 'M.Tech., Ph.D.',
    role: 'Executive Chairman, QIS Group of Institutions',
    photo: '/images/images/kalyan-chakravarthy.jpg',
    href: '/about/snes',
    message:
      'Trained in the USA in the latest computer technologies and software development, a member of the Engineering Society of Detroit, and founder of SNES – his rich experience with a modern outlook steers QIS to new heights.',
  },
  {
    name: 'Dr. N. Sri Gayatri Devi',
    qualification: 'MBBS, MD (Radiologist)',
    role: 'Executive Vice Chairman, QIS Group of Institutions',
    photo: '/images/images/gayatrimadam.jpg',
    href: '/about/snes',
    message: 'Guiding the QIS family with a vision for holistic, value-based education and student well-being.',
  },
  {
    name: 'Dr. Y. V. Hanumantha Rao',
    qualification: 'M.Tech., Ph.D.',
    role: 'Principal, QIS College of Engineering & Technology',
    photo: '/images/images/cet_principal.jpg',
    href: '/about/principal',
    message:
      'Best Teacher awardee (5 consecutive years), recognised Ph.D. supervisor and researcher in alternate fuels with 45+ Scopus-indexed publications.',
  },
];

export const heroSlides = [
  {
    image: '/images/images/office.jpg',
    eyebrow: 'Admissions Open 2026-27',
    title: 'Engineer Your Future at an Autonomous, NAAC A+ Campus',
    text: 'B.Tech · M.Tech · MBA · MCA · BCA — 27+ years of excellence in Ongole, Andhra Pradesh. EAPCET Counselling Code: QISE.',
    cta: { label: 'Apply Now', href: '/apply' },
    cta2: { label: 'Explore Programmes', href: '/admissions/courses-offered' },
  },
  {
    image: '/images/images/sih_2025_s.jpg',
    eyebrow: 'Smart India Hackathon 2025',
    title: 'Proud Nodal Centre for SIH — Third Time in a Row',
    text: 'QISCET hosted the Smart India Hackathon Grand Finale on 8–9 December 2025, bringing India’s brightest innovators to Ongole.',
    cta: { label: 'See Highlights', href: '/about/sih-2022-gallery' },
    cta2: { label: 'Centre for Innovation', href: '/innovation/idea-lab' },
  },
  {
    image: '/images/images/qiscetgal_3.jpg',
    eyebrow: 'Graduation Day',
    title: 'Placement-Ready Graduates, Industry-Ready Skills',
    text: '60+ companies visit every year. Average package ₹3.6 LPA, highest ₹15 LPA. 560+ hours of structured training.',
    cta: { label: 'Placements', href: '/placements' },
    cta2: { label: 'Our Recruiters', href: '/placements/recruiters' },
  },
  {
    image: '/images/images/s4.jpg',
    eyebrow: 'Learning by Doing',
    title: 'AICTE IDEA Lab, Centres of Excellence & Modern Laboratories',
    text: 'From quantum computing to VLSI design — hands-on learning in state-of-the-art labs backed by DST-FIST and AICTE funding.',
    cta: { label: 'Research & Innovation', href: '/research' },
    cta2: { label: 'Departments', href: '/departments' },
  },
  {
    image: '/images/images/qiscetgal_2.jpg',
    eyebrow: 'QIS FEST 2026',
    title: 'National Level Techno-Cultural Fest · Feb 6–9, 2026',
    text: 'Celebrate talent, technology and culture at the flagship annual fest of QIS Group of Institutions.',
    cta: { label: 'QIS FEST 2026', href: 'https://qiscet.edu.in/qisfest2026' },
    cta2: { label: 'Fest Gallery', href: '/about/qis-fest-gallery' },
  },
];

export const announcements = [
  { text: 'Admissions open for 2026-27 — B.Tech, M.Tech, MBA, MCA & BCA. Counselling Code: QISE', href: '/apply', tag: 'Admissions' },
  { text: 'QISCET hosts Smart India Hackathon 2025 Grand Finale (3rd time) — 08 & 09 December 2025', href: 'https://qiscet.edu.in/qiscet/images/SIH2025.pdf', tag: 'Event' },
  { text: 'International Multi-Conference on Engineering, Science & Technology (IMCEST) — 26 November 2025', href: 'https://qiscet.edu.in/qiscet/pdfs/IMCEST_2025.pdf', tag: 'Conference' },
  { text: 'Def-Space Winter Internship & Workshops — Viksit Bharat Abhiyan @2047', href: 'https://qiscet.edu.in/qiscet/pdfs/Def-Space%20Winter%20Internship%20and%20Workshops%20Viksit%20Bharat%20Abhiyan%20@2047.pdf', tag: 'Internship' },
  { text: 'Register for Viksit Bharat @2047 — MY Bharat portal', href: 'https://qiscet.edu.in/qiscet/images/To%20register%20in%20Viksit%20Bharth@2047.pdf', tag: 'Notice' },
  { text: 'New B.Tech in Quantum Computational Engineering — only 60 seats, first time in the region', href: '/departments/quantum-computational-engineering', tag: 'New Programme' },
];

export const newsItems = [
  {
    date: '2025-12-08',
    title: 'QISCET hosts Smart India Hackathon 2025 Grand Finale',
    text: 'For the third time, QISCET served as a nodal centre for SIH, welcoming teams from across India on 8–9 December 2025.',
    href: 'https://qiscet.edu.in/qiscet/images/SIH2025.pdf',
    image: '/images/images/sih_2025_s.jpg',
    tag: 'Event',
  },
  {
    date: '2025-11-26',
    title: 'IMCEST 2025 – International Multi-Conference on Engineering, Science & Technology',
    text: 'Researchers and industry experts converge at QISCET for the international multi-conference.',
    href: 'https://qiscet.edu.in/qiscet/pdfs/IMCEST_2025.pdf',
    image: '/images/images/qiscetgal_1.jpg',
    tag: 'Conference',
  },
  {
    date: '2025-09-01',
    title: 'NIRF India Rankings 2025 – Engineering Rank Band 201–300',
    text: 'QISCET features in the National Institutional Ranking Framework 2025 (Engineering category).',
    href: '/rankings/nirf',
    image: '/images/images/qiscetgal_4.jpg',
    tag: 'Ranking',
  },
  {
    date: '2025-07-15',
    title: 'Def-Space Winter Internship & Workshops – Viksit Bharat Abhiyan @2047',
    text: 'Internship and workshop opportunities in defence & space technologies for engineering students.',
    href: 'https://qiscet.edu.in/qiscet/pdfs/Def-Space%20Winter%20Internship%20and%20Workshops%20Viksit%20Bharat%20Abhiyan%20@2047.pdf',
    image: '/images/images/s6.jpg',
    tag: 'Internship',
  },
  {
    date: '2022-09-15',
    title: 'Regal British Award for Dr. N. Surya Kalyan Chakravarthy',
    text: 'Our Executive Chairman was honoured at the British Parliament on 15 September 2022 for exceptional humanitarian services.',
    href: '/about/snes',
    image: '/images/images/sa112.jpg',
    tag: 'Award',
  },
  {
    date: '2026-02-06',
    title: 'QIS FEST 2026 – National Level Techno-Cultural Fest',
    text: 'Four days of technical events, cultural performances, workshops and competitions — 6 to 9 February 2026.',
    href: 'https://qiscet.edu.in/qisfest2026',
    image: '/images/images/qiscetgal_2.jpg',
    tag: 'Fest',
  },
];

export const recruiters = [
  { name: 'Cognizant', logo: '/images/images/cog.jpg' },
  { name: 'Infosys', logo: '/images/images/infosys.jpg' },
  { name: 'Mphasis', logo: '/images/images/mphasis.jpg' },
  { name: 'HCL', logo: '/images/images/hcl.jpg' },
  { name: 'Tech Mahindra', logo: '/images/images/tech_mahindra_logo.jpg' },
  { name: 'ING', logo: '/images/images/ing.jpg' },
  { name: 'Genpact', logo: '/images/images/genpact.jpg' },
  { name: 'Intergraph', logo: '/images/images/intergraph.jpg' },
];

export const recruiterNames = [
  'Accenture', 'Cognizant', 'Infosys', 'Wipro', 'TCS', 'Tech Mahindra', 'HCL Technologies', 'Capgemini', 'Mphasis', 'Genpact',
  'Virtusa', 'ING', 'Intergraph', 'Hexaware', 'Byju’s', 'Amazon', 'DXC Technology', 'Mindtree', 'L&T', 'Sutherland',
];

export const campusLife = [
  { src: '/images/images/office.jpg', alt: 'QISCET campus aerial view with landscaped gardens' },
  { src: '/images/images/qiscetgal_2.jpg', alt: 'Cultural performances at QIS FEST' },
  { src: '/images/images/s4.jpg', alt: 'Civil engineering students during a survey practical' },
  { src: '/images/images/s6.jpg', alt: 'Student working in the mechanical measurements laboratory' },
  { src: '/images/images/s7.jpg', alt: 'Mechanical engineering workshop' },
  { src: '/images/images/physical_education_header.jpg', alt: 'Sports facilities – basketball, table tennis and athletics' },
  { src: '/images/images/qiscetgal_1.jpg', alt: 'Graduation day at QISCET' },
  { src: '/images/images/hostel1.jpg', alt: 'Hostel rooms for boys and girls' },
];

export const programmeGroups = [
  {
    level: 'B.Tech (UG)',
    duration: '4 Years · Lateral entry to 2nd year via ECET',
    items: [
      { name: 'Computer Science & Engineering', intake: 780, href: '/departments/cse' },
      { name: 'CSE (Artificial Intelligence & Machine Learning)', intake: 480, href: '/departments/cse-ai-ml' },
      { name: 'Artificial Intelligence & Data Science', intake: 240, href: '/departments/ai-data-science' },
      { name: 'Artificial Intelligence', intake: 240, href: '/departments/artificial-intelligence' },
      { name: 'CSE (Data Science)', intake: 240, href: '/departments/cse-data-science' },
      { name: 'Quantum Computational Engineering', intake: 60, href: '/departments/quantum-computational-engineering' },
      { name: 'CSE (IoT & Cyber Security incl. Blockchain)', intake: 60, href: '/departments/cse-iot-cyber-security' },
      { name: 'Information Technology', intake: 90, href: '/departments/information-technology' },
      { name: 'Electronics & Communication Engineering', intake: 300, href: '/departments/ece' },
      { name: 'Electrical & Electronics Engineering', intake: 60, href: '/departments/eee' },
      { name: 'Mechanical Engineering', intake: 30, href: '/departments/mechanical' },
      { name: 'Civil Engineering', intake: 30, href: '/departments/civil' },
    ],
  },
  {
    level: 'M.Tech (PG)',
    duration: '2 Years · GATE / AP PGECET',
    items: [
      { name: 'Computer Science & Engineering', intake: 36, href: '/departments/cse' },
      { name: 'CSE (Artificial Intelligence & Machine Learning)', intake: 36, href: '/departments/cse-ai-ml' },
      { name: 'VLSI & Embedded Systems', intake: 18, href: '/departments/ece' },
      { name: 'Transportation Engineering', intake: 18, href: '/departments/civil' },
      { name: 'Structural Engineering', intake: 18, href: '/departments/civil' },
      { name: 'Power Electronics & Power Systems', intake: 18, href: '/departments/eee' },
      { name: 'Thermal Engineering', intake: 18, href: '/departments/mechanical' },
    ],
  },
  {
    level: 'MBA · MCA · BCA',
    duration: 'MBA / MCA: 2 Years (AP ICET) · BCA: 3 Years',
    items: [
      { name: 'MBA – Master of Business Administration', intake: 60, href: '/departments/mba' },
      { name: 'MBA – Hospital & Health Care Management', intake: 60, href: '/departments/mba' },
      { name: 'MBA – Corporate Communication & Event Management', intake: 60, href: '/departments/mba' },
      { name: 'MBA – Artificial Intelligence & Data Science', intake: 60, href: '/departments/mba' },
      { name: 'MCA – Master of Computer Applications', intake: 180, href: '/departments/mca' },
      { name: 'BCA – Bachelor of Computer Applications', intake: 60, href: '/departments/bca' },
    ],
  },
];

/** Answer-Engine-Optimised FAQs (also emitted as FAQPage JSON-LD). */
export const faqs = [
  {
    q: 'Where is QIS College of Engineering & Technology located?',
    a: 'QISCET is located on Pondur Road, Vengamukkapalem, Ongole, Prakasam District, Andhra Pradesh – 523272, about 2 km from Ongole town adjoining National Highway 16 (old NH-5). Ongole railway station is roughly 6 km away.',
  },
  {
    q: 'What is the EAPCET counselling code of QISCET?',
    a: 'The AP EAPCET / ECET counselling code for QIS College of Engineering & Technology, Ongole is QISE.',
  },
  {
    q: 'Is QISCET an autonomous college? What accreditations does it hold?',
    a: 'Yes. QISCET is an Autonomous institution approved by AICTE and permanently affiliated to JNTU Kakinada. It is accredited by NAAC with A+ grade, has NBA-accredited programmes, is ISO 9001:2015 certified, features in the NIRF India Rankings (Engineering, rank band 201–300 in 2025) and holds a Career360 AAA+ rating.',
  },
  {
    q: 'Which B.Tech branches are offered at QISCET and what is the intake?',
    a: 'For 2026-27 QISCET offers B.Tech in CSE (780 seats), CSE-AI & ML (480), AI & Data Science (240), Artificial Intelligence (240), CSE-Data Science (240), Quantum Computational Engineering (60), CSE-IoT & Cyber Security incl. Blockchain (60), Information Technology (90), ECE (300), EEE (60), Mechanical (30) and Civil Engineering (30).',
  },
  {
    q: 'What PG programmes are available?',
    a: 'M.Tech in CSE, CSE (AI & ML), VLSI & Embedded Systems, Transportation Engineering, Structural Engineering, Power Electronics & Power Systems and Thermal Engineering; MBA (General, Hospital & Health Care Management, Corporate Communication & Event Management, AI & Data Science) and MCA. A 3-year BCA programme is also offered.',
  },
  {
    q: 'How are seats filled? What is the admission procedure?',
    a: '70% of seats (Category A) are filled by the Government of Andhra Pradesh through AP EAPCET counselling and 30% (Category B / management quota) are filled by the college as per government norms. Diploma holders join the 2nd year through AP ECET lateral entry. PG admissions are through GATE / AP PGECET (M.Tech) and AP ICET (MBA / MCA).',
  },
  {
    q: 'What are the placement highlights at QISCET?',
    a: 'Around 60+ software and core companies recruit from QISCET every year. The average package is about ₹3.6 LPA with the highest at ₹15 LPA. Students receive 260+ hours of aptitude, reasoning, verbal and coding training and 300+ hours of hands-on practice through partners such as ByteXL and CodeTantra, plus company-specific drives (e.g., Accenture).',
  },
  {
    q: 'Does QISCET provide hostel and transport facilities?',
    a: 'Yes. Separate on-campus hostels for boys and girls offer hygienic food, RO water, Wi-Fi, gym, laundry and round-the-clock security. A fleet of college buses connects Ongole and surrounding towns; bus routes and timings are published every academic year.',
  },
  {
    q: 'How can I contact the admissions office?',
    a: 'Call +91 92464 19530 / +91 92464 19542, email principal@qiscet.edu.in, or submit the online enquiry form. Office hours are Monday to Saturday, 9:00 AM – 5:00 PM.',
  },
];

export const importantLinks = [
  { label: 'UGC', href: 'https://www.ugc.ac.in/' },
  { label: 'AICTE', href: 'https://www.aicte-india.org/' },
  { label: 'JNTUK', href: 'https://www.jntuk.edu.in/' },
  { label: 'APSCHE', href: 'https://apsche.ap.gov.in/' },
  { label: 'NAAC', href: 'http://www.naac.gov.in/' },
  { label: 'NBA', href: 'https://www.nbaind.org/' },
  { label: 'NIRF', href: 'https://www.nirfindia.org/Home' },
];
