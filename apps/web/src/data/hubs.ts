/** Marketing copy for section landing pages (hubs that are not scraped content pages). */
export const hubCopy: Record<string, { title: string; subtitle: string; image?: string }> = {
  about: {
    title: 'About QIS College of Engineering & Technology',
    subtitle: 'An autonomous, NAAC A+ engineering college in Ongole, established in 1998 by Sri Nidamanuri Educational Society and permanently affiliated to JNTU Kakinada.',
    image: '/images/images/office.jpg',
  },
  admissions: {
    title: 'Admissions 2026-27',
    subtitle: 'B.Tech, M.Tech, MBA, MCA and BCA admissions are open. AP EAPCET / ECET counselling code: QISE. Category A seats are filled by the Government of Andhra Pradesh; Category B by the college.',
    image: '/images/images/qiscetgal_1.jpg',
  },
  academics: {
    title: 'Academics',
    subtitle: 'Autonomous academic regulations, outcome-based syllabus, academic calendar, Board of Studies and the Academic Council of QISCET.',
    image: '/images/images/s6.jpg',
  },
  departments: {
    title: 'Departments & Programmes',
    subtitle: '15 undergraduate and postgraduate departments spanning computing, core engineering, sciences and management — each with its own faculty, labs and BoS.',
    image: '/images/images/s4.jpg',
  },
  facilities: {
    title: 'Campus Facilities',
    subtitle: 'A residential green campus with a central library, hostels, transport, sports, medical care, RO water, Wi-Fi and a food court — 2 km from Ongole town.',
    image: '/images/images/hostel1.jpg',
  },
  placements: {
    title: 'Training & Placements',
    subtitle: 'A dedicated placement cell, 560+ hours of training, and 60+ recruiters every year. Highest package ₹15 LPA, average about ₹3.6 LPA.',
    image: '/images/images/qiscetgal_3.jpg',
  },
  accreditation: {
    title: 'Accreditation',
    subtitle: 'QISCET is an autonomous institution accredited by NAAC with A+ grade, with NBA-accredited programmes, AICTE approval and permanent affiliation to JNTUK.',
    image: '/images/images/qiscetgal_4.jpg',
  },
  rankings: {
    title: 'Rankings & Certifications',
    subtitle: 'NIRF India Rankings (Engineering, rank band 201–300 in 2025), ARIIA / ATAL ranking participation and ISO 9001:2015 certification.',
    image: '/images/images/qiscetgal_4.jpg',
  },
  innovation: {
    title: 'Centre for Innovation',
    subtitle: 'AICTE IDEA Lab, applied skilling domains and a maker culture that takes student ideas from sketch to prototype.',
    image: '/images/images/s7.jpg',
  },
  governance: {
    title: 'Governance & Compliance',
    subtitle: 'Statutory committees, anti-ragging policy, mandatory disclosure and grievance redressal — published in the interest of transparency.',
    image: '/images/images/office.jpg',
  },
};

export const admissionSteps = [
  { n: '01', title: 'Check eligibility', text: '10+2 with Maths, Physics and Chemistry (or a relevant diploma for lateral entry). PG programmes need a recognised degree plus AP PGECET / GATE or AP ICET as applicable.' },
  { n: '02', title: 'Appear for the entrance test', text: 'AP EAPCET for B.Tech, AP ECET for lateral entry, AP PGECET / GATE for M.Tech and AP ICET for MBA & MCA.' },
  { n: '03', title: 'Choose QISE in web options', text: 'During counselling, select QIS College of Engineering & Technology, Ongole with counselling code QISE.' },
  { n: '04', title: 'Seat allotment', text: '70% Category-A seats are allotted by the Government of Andhra Pradesh. 30% Category-B (management quota) seats are filled by the college as per APSCHE norms.' },
  { n: '05', title: 'Report to campus', text: 'Complete document verification, fee payment and hostel/transport options. Our admissions desk guides you through every step.' },
];

export const facilityCards: { title: string; href: string; text: string; image: string }[] = [
  { title: 'Central Library', href: '/facilities/library', text: '12,000 sq.ft, 60,000+ volumes, e-journals, DELNET, NPTEL and a digital library.', image: '/images/library/library.jpg' },
  { title: 'Hostels', href: '/facilities/hostel', text: 'Separate boys’ and girls’ hostels with mess, Wi-Fi, gym and 24×7 security.', image: '/images/images/hostel1.jpg' },
  { title: 'Transport', href: '/facilities/transport', text: 'College buses across Ongole and nearby towns. Routes published every year.', image: '/images/images/office.jpg' },
  { title: 'Sports', href: '/facilities/physical-education', text: 'Courts for volleyball, basketball, kabaddi, cricket nets and indoor games.', image: '/images/images/physical_education_header.jpg' },
  { title: 'Medical', href: '/facilities/medical', text: 'On-campus dispensary, first aid, ambulance and a visiting doctor.', image: '/images/images/1.jpg' },
  { title: 'Food Court & Cafeteria', href: '/facilities/food-court', text: 'Hygienic, institute-monitored food court plus a student cafeteria.', image: '/images/images/foodcourt.jpg' },
  { title: 'RO Drinking Water', href: '/facilities/mineral-water', text: 'Two RO plants, 2,000 litres/hour each, across the campus.', image: '/images/images/cafeteria.jpg' },
  { title: 'Wi-Fi Campus', href: '/facilities/wifi', text: 'Campus-wide wireless access for academic work and e-learning.', image: '/images/images/wifi-qiscet.jpg' },
];
