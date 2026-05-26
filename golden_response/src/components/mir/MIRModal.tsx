"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

const inquiryOptions = [
  ["dosing", "Dosing"],
  ["safety", "Safety"],
  ["efficacy", "Efficacy"],
  ["clinical-trial", "Clinical trial"],
  ["storage", "Storage"],
  ["medical-literature", "Medical literature"],
  ["other", "Other"],
];

export function MIRModal({ open, onClose }: Props) {
  const [errors, setErrors] = useState<string[]>([]);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors([]);
    setTrackingId(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      hcpRole: form.get("hcpRole"),
      institution: form.get("institution"),
      email: form.get("email"),
      phone: form.get("phone"),
      country: form.get("country"),
      product: form.get("product"),
      inquiryTypes: form.getAll("inquiryTypes"),
      message: form.get("message"),
      consentAccepted: form.get("consentAccepted") === "on",
    };

    const response = await fetch("/api/medical-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      setErrors(result.errors?.length ? result.errors : [result.message]);
      setSubmitting(false);
      return;
    }

    setTrackingId(result.trackingId);
    formRef.current?.reset();
    setSubmitting(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mir-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="mir-title" className="text-2xl font-semibold text-slate-950">
                  Medical information request
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  For healthcare professionals requesting product or medical-science information.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            {errors.length > 0 ? (
              <div role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : null}

            {trackingId ? (
              <div role="status" className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
                Request received. Your tracking ID is <strong>{trackingId}</strong>.
              </div>
            ) : null}

            <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="fullName" required />
              <Field label="HCP role" name="hcpRole" required />
              <Field label="Institution" name="institution" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Country" name="country" required />
              <Field label="Product" name="product" required />

              <fieldset className="md:col-span-2">
                <legend className="mb-2 text-sm font-medium text-slate-800">Inquiry type</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {inquiryOptions.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 rounded-md border border-slate-200 p-2 text-sm">
                      <input name="inquiryTypes" type="checkbox" value={value} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="md:col-span-2 text-sm font-medium text-slate-800">
                Message
                <textarea
                  name="message"
                  required
                  minLength={20}
                  className="mt-1 min-h-32 w-full rounded-md border border-slate-300 p-3"
                />
              </label>

              <label className="md:col-span-2 flex items-start gap-3 text-sm text-slate-700">
                <input name="consentAccepted" type="checkbox" required className="mt-1" />
                I confirm I am submitting this request for medical information purposes and consent to processing according to the privacy notice.
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="md:col-span-2 rounded-md bg-teal-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Submitting..." : "Submit request"}
              </button>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-slate-800">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
      />
    </label>
  );
}
