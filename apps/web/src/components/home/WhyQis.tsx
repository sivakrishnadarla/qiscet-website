import { Award, BrainCircuit, Briefcase, Building2, FlaskConical, Globe2, HeartHandshake, Lightbulb } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const items = [
  { Icon: Award, title: 'Autonomous · NAAC A+ · NBA', text: 'Outcome-based curriculum designed with industry, accredited at the institutional and programme level.' },
  { Icon: Briefcase, title: 'Strong placement record', text: '60+ companies visit every year; average package ₹3.6 LPA and highest ₹15 LPA with dedicated CRT & soft-skills training.' },
  { Icon: BrainCircuit, title: 'AI-first computing programmes', text: 'CSE (AI&ML), AI&DS, Data Science, IoT & Cyber Security, VLSI and India’s early B.Tech in Quantum Computational Engineering.' },
  { Icon: FlaskConical, title: 'Research & innovation ecosystem', text: 'AICTE IDEA Lab, Institution’s Innovation Council, Centres of Excellence, patents, funded projects and 250+ publications a year.' },
  { Icon: Lightbulb, title: 'Startups & entrepreneurship', text: 'Entrepreneurship Development Cell with ideathons, Startup India linkages and incubated student ventures.' },
  { Icon: Building2, title: '60-acre green campus', text: 'Modern labs, central library with 60,000+ volumes, hostels, food court, RO water, medical centre and Wi-Fi campus.' },
  { Icon: Globe2, title: 'Global & industry exposure', text: '80+ MoUs, international conferences (IMCEST), NPTEL local chapter and Smart India Hackathon nodal centre.' },
  { Icon: HeartHandshake, title: 'Student-first support', text: 'Mentoring, counselling, scholarships, anti-ragging & grievance cells, NSS/NCC and a vibrant cultural life (QIS FEST).' },
];

export default function WhyQis() {
  return (
    <section className="section relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid bg-[size:36px_36px] opacity-30" aria-hidden />
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-saffron-500/20 blur-3xl" aria-hidden />
      <div className="container-x relative">
        <SectionHeading light align="center" eyebrow="Why QISCET" title="Everything a future engineer needs — in one campus" text="Here is what sets QIS College of Engineering & Technology apart among engineering colleges in Andhra Pradesh." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, text }) => (
            <li key={title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-saffron-400/60 hover:bg-white/10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-300 transition group-hover:bg-saffron-500 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-navy-100">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
