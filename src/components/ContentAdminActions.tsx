"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  ContentPublicationStatus,
  ContentUpdateInput,
  TravelContentRecord,
  VerificationLogCreateInput,
  VerificationStatus,
} from "@/types";

type Props = {
  content: TravelContentRecord;
  writeEnabled: boolean;
};

const verificationOptions: VerificationStatus[] = ["pending", "verified", "official", "rejected", "stale"];
const statusOptions: ContentPublicationStatus[] = ["draft", "published", "archived"];

export default function ContentAdminActions({ content, writeEnabled }: Props) {
  const router = useRouter();
  const [recordForm, setRecordForm] = useState<ContentUpdateInput>({
    status: content.status,
    verificationStatus: content.verificationStatus,
    freshnessHours: content.freshnessHours,
    verifiedBy: content.verifiedBy || "",
    summary: content.summary || "",
    detail: content.detail || "",
    sourceUrl: content.sourceUrl || "",
    sourceLastCheckedAt: content.sourceLastCheckedAt || new Date().toISOString(),
    expiresAt: content.expiresAt || "",
  });
  const [logForm, setLogForm] = useState<VerificationLogCreateInput>({
    verificationStatus: content.verificationStatus,
    reviewer: content.verifiedBy || "",
    notes: "",
    checkedAt: new Date().toISOString(),
  });
  const [recordState, setRecordState] = useState<{ loading: boolean; message?: string; error?: string }>({ loading: false });
  const [logState, setLogState] = useState<{ loading: boolean; message?: string; error?: string }>({ loading: false });

  const refreshAfterSuccess = async () => {
    router.refresh();
  };

  const updateRecord = async () => {
    setRecordState({ loading: true });
    try {
      const response = await fetch(`/api/content/items/${content.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recordForm,
          expiresAt: recordForm.expiresAt || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update content record.");
      }

      setRecordState({ loading: false, message: "Content record updated." });
      await refreshAfterSuccess();
    } catch (error) {
      setRecordState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update content record.",
      });
    }
  };

  const createVerificationLog = async () => {
    setLogState({ loading: true });
    try {
      const response = await fetch(`/api/content/items/${content.id}/verification-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create verification log.");
      }

      setLogForm((prev) => ({ ...prev, notes: "", checkedAt: new Date().toISOString() }));
      setLogState({ loading: false, message: "Verification log added." });
      await refreshAfterSuccess();
    } catch (error) {
      setLogState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create verification log.",
      });
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Admin Actions</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Update publication state and append verification history entries for this content record.
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${writeEnabled ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-amber-400/30 bg-amber-400/10 text-amber-200"}`}>
          {writeEnabled ? "Writable" : "Read only"}
        </span>
      </div>

      {!writeEnabled && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          `SUPABASE_SERVICE_ROLE_KEY` is not configured, so write actions are disabled in this environment.
        </div>
      )}

      <div className="mt-5 flex flex-col gap-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="text-sm font-semibold text-white">Update content record</div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Publication status
              <select
                disabled={!writeEnabled || recordState.loading}
                value={recordForm.status}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, status: event.target.value as ContentPublicationStatus }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Verification status
              <select
                disabled={!writeEnabled || recordState.loading}
                value={recordForm.verificationStatus}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, verificationStatus: event.target.value as VerificationStatus }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {verificationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Freshness hours
              <input
                disabled={!writeEnabled || recordState.loading}
                type="number"
                min={1}
                value={recordForm.freshnessHours}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, freshnessHours: Number(event.target.value) }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Reviewer / verifier
              <input
                disabled={!writeEnabled || recordState.loading}
                value={recordForm.verifiedBy}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, verifiedBy: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300 md:col-span-2">
              Source URL
              <input
                disabled={!writeEnabled || recordState.loading}
                value={recordForm.sourceUrl}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, sourceUrl: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300 md:col-span-2">
              Summary
              <textarea
                disabled={!writeEnabled || recordState.loading}
                rows={3}
                value={recordForm.summary}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300 md:col-span-2">
              Detail
              <textarea
                disabled={!writeEnabled || recordState.loading}
                rows={5}
                value={recordForm.detail}
                onChange={(event) => setRecordForm((prev) => ({ ...prev, detail: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!writeEnabled || recordState.loading}
              onClick={updateRecord}
              className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {recordState.loading ? "Saving..." : "Save record"}
            </button>
            {recordState.message && <span className="text-xs text-emerald-300">{recordState.message}</span>}
            {recordState.error && <span className="text-xs text-rose-300">{recordState.error}</span>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="text-sm font-semibold text-white">Append verification log</div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Verification status
              <select
                disabled={!writeEnabled || logState.loading}
                value={logForm.verificationStatus}
                onChange={(event) => setLogForm((prev) => ({ ...prev, verificationStatus: event.target.value as VerificationStatus }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {verificationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300">
              Reviewer
              <input
                disabled={!writeEnabled || logState.loading}
                value={logForm.reviewer}
                onChange={(event) => setLogForm((prev) => ({ ...prev, reviewer: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-slate-300 md:col-span-2">
              Notes
              <textarea
                disabled={!writeEnabled || logState.loading}
                rows={4}
                value={logForm.notes}
                onChange={(event) => setLogForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!writeEnabled || logState.loading}
              onClick={createVerificationLog}
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {logState.loading ? "Submitting..." : "Add verification log"}
            </button>
            {logState.message && <span className="text-xs text-emerald-300">{logState.message}</span>}
            {logState.error && <span className="text-xs text-rose-300">{logState.error}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}