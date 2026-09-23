import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { site } from '@/data/site';

export default function EnquiryBand() {
  return (
    <section id="enquire" className="section relative overflow-hidden bg-navy-gradient text-white">
      <div className="absolute inset-0 bg-grid bg-[size:36px_36px] opacity-20" aria-hidden />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-saffron-300">Admissions 2026-27 · Code QISE</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Talk to an admissions counsellor today</h2>
          <p className="mt-4 text-base leading-7 text-navy-100">Get personalised guidance on branch selection, EAPCET/ECET/ICET counselling, B-category (management quota) seats, fee reimbursement, scholarships, hostel and transport.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-saffron-400" /><span><span className="block text-xs uppercase tracking-wider text-navy-200">Admissions helpline</span>{site.admissionsPhones.map((p, i) => <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="font-semibold hover:text-saffron-300">{i ? ' · ' : ''}{p}</a>)}</span></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-saffron-400" /><span><span className="block text-xs uppercase tracking-wider text-navy-200">Email</span><a href={`mailto:${site.email}`} className="font-semibold hover:text-saffron-300">{site.email}</a></span></li>
            <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-saffron-400" /><span><span className="block text-xs uppercase tracking-wider text-navy-200">Campus</span>{site.address.full}</span></li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-saffron-400" /><span><span className="block text-xs uppercase tracking-wider text-navy-200">Office hours</span>{site.hours}</span></li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lift backdrop-blur md:p-8">
          <EnquiryForm dark source="home-band" />
        </div>
      </div>
    </section>
  );
}
