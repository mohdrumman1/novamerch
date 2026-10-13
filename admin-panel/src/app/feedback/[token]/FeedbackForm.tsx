"use client";

import { FormEvent, useEffect, useState } from "react";

type FormState = {
  overallRating: number | null;
  communicationRating: number | null;
  productQualityRating: number | null;
  resolutionRating: number | null;
  whatWentWell: string;
  whatWeCanImprove: string;
  futureBusiness: "" | "Yes" | "Maybe" | "No";
  permissionToContact: boolean;
};

const blankForm: FormState = { overallRating: null, communicationRating: null, productQualityRating: null, resolutionRating: null, whatWentWell: "", whatWeCanImprove: "", futureBusiness: "", permissionToContact: false };
const questions: Array<{ key: keyof Pick<FormState, "overallRating" | "communicationRating" | "productQualityRating" | "resolutionRating">; label: string; help: string; required?: boolean }> = [
  { key: "overallRating", label: "Overall experience", help: "Thinking about your experience with NovaMerch overall.", required: true },
  { key: "communicationRating", label: "Communication", help: "Clarity, responsiveness and keeping you informed.", required: true },
  { key: "productQualityRating", label: "Product outcome", help: "How well the supplied products met expectations.", required: true },
  { key: "resolutionRating", label: "Resolution", help: "How satisfied you were with the way concerns were handled." },
];

function Rating({ value, onChange, label }: { value: number | null; onChange: (rating: number) => void; label: string }) {
  return <div className="flex gap-2" role="radiogroup" aria-label={label}>{[1, 2, 3, 4, 5].map((number) => <button key={number} type="button" onClick={() => onChange(number)} aria-label={`${number} out of 5`} aria-pressed={value === number} className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${value === number ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-[var(--border-dark)] bg-white text-[var(--text)] hover:border-[var(--accent-dark)]"}`}>{number}</button>)}</div>;
}

export default function FeedbackForm({ token }: { token: string }) {
  const [form, setForm] = useState<FormState>(blankForm);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const endpoint = `/admin/api/public/feedback/${encodeURIComponent(token)}`;

  useEffect(() => {
    fetch(endpoint).then(async (response) => ({ response, data: await response.json() })).then(({ response, data }) => {
      if (!response.ok) setError(data.error || "We could not open this feedback form.");
      else setSubmitted(Boolean(data.alreadySubmitted));
    }).catch(() => setError("We could not open this feedback form. Please try again later.")).finally(() => setLoading(false));
  }, [endpoint]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.overallRating || !form.communicationRating || !form.productQualityRating || !form.whatWeCanImprove.trim() || !form.futureBusiness) {
      setError("Please complete the required questions before submitting.");
      return;
    }
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).catch(() => null);
    const data = response ? await response.json().catch(() => ({})) : {};
    if (!response?.ok) { setError(data.error || "We could not save your feedback. Please try again."); return; }
    setSubmitted(true);
  }

  if (loading) return <main className="min-h-screen grid place-items-center bg-[var(--bg)] p-6"><p className="text-sm text-[var(--text-muted)]">Opening feedback form…</p></main>;
  if (error && !submitted) return <main className="min-h-screen grid place-items-center bg-[var(--bg)] p-6"><section className="max-w-lg rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-[var(--red)]">Feedback form unavailable</p><p className="mt-3 text-sm text-[var(--text-muted)]">{error}</p></section></main>;
  if (submitted) return <main className="min-h-screen grid place-items-center bg-[var(--bg)] p-6"><section className="max-w-lg rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--accent)] text-xl font-bold">✓</div><h1 className="mt-5 text-2xl font-bold text-[var(--text)]">Thank you for your feedback.</h1><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Your response has been received and will help us improve how we work with customers.</p></section></main>;

  return <main className="min-h-screen bg-[var(--bg)] px-4 py-10 sm:px-6"><form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">NovaMerch customer feedback</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Tell us what we got right  -  and what we need to improve.</h1><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">This takes about two minutes. Your feedback is reviewed by the NovaMerch team and helps us improve future orders.</p><div className="mt-8 space-y-7">{questions.map((question) => <fieldset key={question.key}><legend className="text-sm font-semibold text-[var(--text)]">{question.label}{question.required && <span className="ml-1 text-[var(--red)]">*</span>}</legend><p className="mt-1 text-sm text-[var(--text-muted)]">{question.help}</p><div className="mt-3"><Rating label={question.label} value={form[question.key]} onChange={(value) => setForm({ ...form, [question.key]: value })} /></div></fieldset>)}<label className="block"><span className="text-sm font-semibold text-[var(--text)]">What went well?</span><textarea value={form.whatWentWell} onChange={(event) => setForm({ ...form, whatWentWell: event.target.value })} className="mt-2 min-h-28 w-full rounded-lg border border-[var(--border-dark)] p-3 text-sm" placeholder="Anything we should keep doing?" /></label><label className="block"><span className="text-sm font-semibold text-[var(--text)]">What could we improve?<span className="ml-1 text-[var(--red)]">*</span></span><textarea required value={form.whatWeCanImprove} onChange={(event) => setForm({ ...form, whatWeCanImprove: event.target.value })} className="mt-2 min-h-28 w-full rounded-lg border border-[var(--border-dark)] p-3 text-sm" placeholder="Please be as specific as you can." /></label><fieldset><legend className="text-sm font-semibold text-[var(--text)]">Would you consider NovaMerch again?<span className="ml-1 text-[var(--red)]">*</span></legend><div className="mt-3 flex flex-wrap gap-2">{(["Yes", "Maybe", "No"] as const).map((option) => <button type="button" key={option} onClick={() => setForm({ ...form, futureBusiness: option })} className={`rounded-full border px-4 py-2 text-sm font-medium ${form.futureBusiness === option ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-[var(--border-dark)] text-[var(--text)]"}`}>{option}</button>)}</div></fieldset><label className="flex gap-3 text-sm text-[var(--text-muted)]"><input type="checkbox" checked={form.permissionToContact} onChange={(event) => setForm({ ...form, permissionToContact: event.target.checked })} className="mt-1 h-4 w-4" />I’m happy for NovaMerch to contact me about this feedback.</label></div>{error && <p role="alert" className="mt-6 rounded-lg bg-[var(--red-soft)] p-3 text-sm text-[var(--red)]">{error}</p>}<button className="mt-8 w-full rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-dark)]">Submit feedback</button><p className="mt-4 text-center text-xs text-[var(--text-muted)]">Your response is linked to this order and is not published publicly.</p></form></main>;
}
