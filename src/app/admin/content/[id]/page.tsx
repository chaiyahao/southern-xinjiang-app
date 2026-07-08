import Link from "next/link";
import { notFound } from "next/navigation";
import ContentAdminActions from "@/components/ContentAdminActions";
import { contentService } from "@/services/contentService";
import { isSupabaseWriteConfigured } from "@/utils/serverSupabaseClient";

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContentAdminDetailPage({ params }: PageProps) {
  const { id } = await params;
  const content = await contentService.getContentById(id);

  if (!content) {
    notFound();
  }

  const [localizations, media, verificationLogs] = await Promise.all([
    contentService.getContentLocalizations(id),
    contentService.getContentMedia(id),
    contentService.getVerificationLogs(id),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/admin/content" className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300 hover:text-sky-200">
              Back to inventory
            </Link>
            <h1 className="mt-3 text-3xl font-bold text-white">{content.canonicalTitle}</h1>
            <p className="mt-2 text-sm text-slate-300">{content.summary || "No summary available."}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Verification</div>
            <div className="mt-1 text-lg font-bold text-white">{content.verificationStatus}</div>
            <div className="text-xs text-slate-400">{content.status}</div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white">Canonical Record</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Key</div>
                <div className="mt-2 text-sm font-semibold text-white">{content.contentKey}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Type</div>
                <div className="mt-2 text-sm font-semibold text-white">{content.contentType}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Source</div>
                <div className="mt-2 text-sm font-semibold text-white">{content.source?.sourceName || "-"}</div>
                {content.sourceUrl && (
                  <a href={content.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs text-sky-300 hover:text-sky-200">
                    {content.sourceUrl}
                  </a>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Freshness</div>
                <div className="mt-2 text-sm font-semibold text-white">{content.freshnessHours}h</div>
                <div className="mt-1 text-xs text-slate-400">Last checked {formatDate(content.sourceLastCheckedAt || content.verifiedAt)}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Detail</div>
              <p className="mt-2 text-sm leading-6 text-slate-200">{content.detail || "No detail available."}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Metadata</div>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-200">{JSON.stringify(content.metadata, null, 2)}</pre>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ContentAdminActions content={content} writeEnabled={isSupabaseWriteConfigured} />

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white">Localizations</h2>
              <div className="mt-4 flex flex-col gap-3">
                {Object.values(localizations).map((entry) =>
                  entry ? (
                    <div key={entry.locale} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{entry.locale}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{entry.title}</div>
                      <div className="mt-2 text-xs leading-5 text-slate-300">{entry.summary || "No summary"}</div>
                    </div>
                  ) : null
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white">Verified Media</h2>
              <div className="mt-4 flex flex-col gap-3">
                {media.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">No verified media attached.</div>
                ) : (
                  media.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="text-sm font-semibold text-white">{item.altText || item.storagePath}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.storagePath}</div>
                      {item.caption && <div className="mt-2 text-xs text-slate-300">{item.caption}</div>}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white">Verification History</h2>
              <div className="mt-4 flex flex-col gap-3">
                {verificationLogs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">No verification logs yet.</div>
                ) : (
                  verificationLogs.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white">{entry.verificationStatus}</div>
                        <div className="text-xs text-slate-400">{formatDate(entry.checkedAt)}</div>
                      </div>
                      <div className="mt-2 text-xs text-slate-300">{entry.notes || "No notes"}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}