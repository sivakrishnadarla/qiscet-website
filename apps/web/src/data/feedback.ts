export type FeedbackKind = {
  slug: string;
  title: string;
  intro: string;
  googleForm: string;
  identity: { id: string; label: string; required?: boolean; type?: string }[];
  questions: string[];
};

const curriculum = [
  'The curriculum covers the fundamentals required for the programme.',
  'The syllabus is updated and relevant to current industry practice.',
  'Theory and laboratory / practical components are well balanced.',
  'Electives and value-added courses offer real choice.',
  'Assessment (internals and end exams) fairly tests the outcomes.',
  'Faculty are accessible for doubts and mentoring.',
  'Overall, I would recommend this curriculum.',
];

export const feedbackKinds: FeedbackKind[] = [
  {
    slug: 'student',
    title: 'Student feedback on curriculum',
    intro: 'Your ratings help the Board of Studies and IQAC revise the syllabus. Responses are reviewed in aggregate.',
    googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLSenyy0dbFHPMUBH6zilAKg__GudGbeyiVQo0mbqfS8-xsfE7A/viewform?embedded=true',
    identity: [
      { id: 'name', label: 'Name', required: true },
      { id: 'roll', label: 'Roll number', required: true },
      { id: 'programme', label: 'Programme & year', required: true },
    ],
    questions: curriculum,
  },
  {
    slug: 'parent',
    title: 'Parent feedback on curriculum',
    intro: 'Parents and guardians can tell us how well the programme is serving their ward.',
    googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLSfsYyHdWC1LvJOrxDNT6Rqv08vDMsNE0f9Vt_LmT3n2aIz9ow/viewform?embedded=true',
    identity: [
      { id: 'name', label: 'Parent name', required: true },
      { id: 'ward', label: 'Ward’s name & roll number', required: true },
      { id: 'mobile', label: 'Mobile', type: 'tel' },
    ],
    questions: [
      'The college communicates academic progress clearly.',
      'The curriculum is preparing my ward for a job or higher study.',
      'Discipline, safety and anti-ragging measures are effective.',
      'Hostel / transport / campus facilities (if used) are satisfactory.',
      'I would recommend QISCET to other parents.',
    ],
  },
  {
    slug: 'teacher',
    title: 'Teacher feedback on curriculum',
    intro: 'Faculty input is taken to the Board of Studies before each regulation revision.',
    googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLSc4zBjJFp1W-cIDgqkpkG4G99IHcBK13Wuf06_PlfFcOHBlAQ/viewform?embedded=true',
    identity: [
      { id: 'name', label: 'Name', required: true },
      { id: 'department', label: 'Department', required: true },
      { id: 'designation', label: 'Designation' },
    ],
    questions: [
      'Course outcomes are clearly stated and measurable.',
      'Contact hours are adequate for the syllabus.',
      'Recommended textbooks and e-resources are current.',
      'I have freedom to use innovative teaching methods.',
      'The assessment scheme matches the outcomes.',
    ],
  },
  {
    slug: 'alumni',
    title: 'Alumni feedback on curriculum',
    intro: 'Tell us what the programme gave you — and what it should add for the next batch.',
    googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLScxf53ABjDkHfSRz3kVUh0GSLGQtHVHV_TpzrbGeivACdTKjg/viewform?embedded=true',
    identity: [
      { id: 'name', label: 'Name', required: true },
      { id: 'batch', label: 'Batch & branch', required: true },
      { id: 'role', label: 'Current role / organisation' },
    ],
    questions: [
      'The curriculum prepared me for my first job or higher study.',
      'Labs and projects reflected real tools used in industry.',
      'Soft skills and aptitude training were useful.',
      'I stay connected with the department and alumni cell.',
      'I would recommend my branch at QISCET.',
    ],
  },
  {
    slug: 'employer',
    title: 'Employer feedback on curriculum',
    intro: 'Recruiters and industry partners: this goes directly to the Training & Placement Cell and the Boards of Studies.',
    googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLScozdnK8ZcbagBCPAoROUmy7XAcR0PvKe8jmkisA_87tpbeEA/viewform?embedded=true',
    identity: [
      { id: 'name', label: 'Your name', required: true },
      { id: 'organisation', label: 'Organisation', required: true },
      { id: 'email', label: 'Work email', type: 'email', required: true },
    ],
    questions: [
      'QISCET graduates meet the technical bar for the roles you hire.',
      'Communication and professional conduct are satisfactory.',
      'They learn new tools quickly on the job.',
      'You would hire from this campus again.',
      'The curriculum should add more of the skills your teams use today.',
    ],
  },
];

export function getFeedbackKind(slug: string) {
  return feedbackKinds.find((k) => k.slug === slug);
}
