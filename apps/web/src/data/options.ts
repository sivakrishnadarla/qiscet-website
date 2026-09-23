export const branchOptions = [
  'CSE — Computer Science & Engineering',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'CSE (IoT & Cyber Security incl. Blockchain)',
  'CSE & Business Systems',
  'Computer Science & Information Technology',
  'Artificial Intelligence',
  'Artificial Intelligence & Data Science',
  'Quantum Computational Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electronics Engineering (VLSI Design & Technology)',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const programmeOptions = [
  { group: 'B.Tech (UG)', options: branchOptions.map((b) => `B.Tech – ${b}`) },
  {
    group: 'M.Tech (PG)',
    options: ['M.Tech – CSE', 'M.Tech – CSE (AI & ML)', 'M.Tech – VLSI & Embedded Systems', 'M.Tech – Transportation Engineering', 'M.Tech – Structural Engineering', 'M.Tech – Power Electronics & Power Systems', 'M.Tech – Thermal Engineering'],
  },
  {
    group: 'Management & Applications',
    options: ['MBA – General', 'MBA – Hospital & Health Care Management', 'MBA – Corporate Communication & Event Management', 'MBA – AI & Data Science', 'MCA', 'BCA'],
  },
];

export const interGroupOptions = ['MPC', 'BiPC', 'MEC', 'CEC', 'Diploma — CSE', 'Diploma — ECE', 'Diploma — EEE', 'Diploma — Mechanical', 'Diploma — Civil', 'Diploma — IT', 'B.Sc. (Mathematics)', 'Other'];

export const districtOptions = [
  'Prakasam', 'Guntur', 'Bapatla', 'Palnadu', 'Sri Potti Sriramulu Nellore', 'Kurnool', 'Nandyal', 'YSR Kadapa', 'Annamayya', 'Tirupati', 'Chittoor',
  'Sri Sathya Sai', 'Anantapur', 'Krishna (NTR)', 'Eluru', 'West Godavari', 'Konaseema', 'East Godavari', 'Kakinada', 'Visakhapatnam', 'Anakapalli',
  'Alluri Sitharama Raju', 'Vizianagaram', 'Srikakulam', 'Parvathipuram Manyam', 'Other State',
];

export const entryTypeOptions = ['EAPCET (Regular)', 'ECET (Lateral Entry)', 'ICET (MBA/MCA)', 'PGECET / GATE (M.Tech)', 'Management Quota (B-Category)', 'Other'];
