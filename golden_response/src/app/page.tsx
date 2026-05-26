"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MIRModal } from "@/components/mir/MIRModal";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Medical affairs platform</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Enterprise pharmaceutical information requests, handled with care.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            A secure HCP-facing workflow for product inquiries, audit logging, compliant routing, and clear requester confirmation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setOpen(true)} className="rounded-md bg-teal-700 px-5 py-3 font-semibold text-white">
              Request medical information
            </button>
            <a href="#pipeline" className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-800">
              View pipeline
            </a>
          </div>
        </div>

        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <dl className="grid gap-5">
            <Stat value="24/7" label="Request intake monitoring" />
            <Stat value="5/hr" label="Submission rate limit per hashed IP" />
            <Stat value="100%" label="Tracked submissions with audit events" />
          </dl>
        </motion.div>
      </section>

      <section id="pipeline" className="border-y border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {["Oncology", "Immunology", "Rare disease"].map((area) => (
            <article key={area} className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-xl font-semibold">{area}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Medical content, study references, and region-aware information request routing.
              </p>
            </article>
          ))}
        </div>
      </section>

      <MIRModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-3xl font-semibold text-teal-700">{value}</dt>
      <dd className="mt-1 text-sm text-slate-600">{label}</dd>
    </div>
  );
}
