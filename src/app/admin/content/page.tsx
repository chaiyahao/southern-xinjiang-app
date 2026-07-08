import Link from "next/link";
import { contentService } from "@/services/contentService";

const statusTone: Record<string, string> = {
  official: "bg-emerald-50 text-emerald-700 border-emerald-200",
  verified: "bg-sky-50 text-sky-700 border-sky-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  stale: "bg-slate-100 text-slate-700 border-slate-200",
};

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

function getFreshnessLabel(hours: number) {
  if (hours <= 48) return `${hours}h strict`;
  if (hours <= 168) return `${hours}h monitored`;
  return `${hours}h reference`;
}

export default async function ContentAdminPage() {
  const [sources, items] = await Promise.all([
    contentService.getSources(),
    contentService.getAllContent(),
  ]);

  const publishedCount = items.filter((item) => item.status === "published").length;
  const verifiedCount = items.filter((item) => item.verificationStatus === "verified" || item.verificationStatus === "official").length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">Content Trust Console</span>
              <h1 className="text-3xl font-bold tracking-tight text-white">Southern Xinjiang Content Operations</h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-300">
                Read-only operations view for verified travel content, source registry health, and freshness policy before the full CMS is built.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              <Link href="/api/content/sources" className="rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sky-100 hover:bg-sky-400/20">
                API: sources
              </Link>
              <Link href="/api/content/items" className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-100 hover:bg-emerald-400/20">
                API: items
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Sources</div>
              <div className="mt-2 text-3xl font-bold text-white">{sources.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Content Items</div>
              <div className="mt-2 text-3xl font-bold text-white">{items.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Published</div>
              <div className="mt-2 text-3xl font-bold text-white">{publishedCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Verified / Official</div>
              <div className="mt-2 text-3xl font-bold text-white">{verifiedCount}</div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Source Registry</h2>
              <span className="text-xs text-slate-400">Active official feed list</span>
            </div>
            <div className="flex flex-col gap-3">
              {sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{source.sourceName}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{source.sourceKey}</div>
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                      {source.trustLevel}
                    </span>
                  </div>
                  <div className="mt-3 text-xs leading-5 text-slate-300">{source.notes || "-"}</div>
                  <a href={source.baseUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-sky-300 hover:text-sky-200">
                    {source.baseUrl}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Verified Content Inventory</h2>
              <span className="text-xs text-slate-400">Freshness-aware publication list</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.1fr_0.75fr_0.75fr_0.7fr_1fr] gap-3 bg-slate-900 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                <div>Content</div>
                <div>Type</div>
                <div>Status</div>
                <div>Freshness</div>
                <div>Last Checked</div>
              </div>
              <div className="divide-y divide-white/10 bg-slate-950/60">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1.1fr_0.75fr_0.75fr_0.7fr_1fr] gap-3 px-4 py-4 text-sm text-slate-200">
                    <div className="min-w-0">
                      <Link href={`/admin/content/${item.id}`} className="truncate font-semibold text-white hover:text-sky-300">
                        {item.canonicalTitle}
                      </Link>
                      <div className="mt-1 truncate text-xs text-slate-400">{item.contentKey}</div>
                      <div className="mt-2 text-xs leading-5 text-slate-300">{item.summary || "No summary"}</div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{item.contentType}</div>
                    <div>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${statusTone[item.verificationStatus] || statusTone.pending}`}>
                        {item.verificationStatus}
                      </span>
                      <div className="mt-2 text-[11px] text-slate-400">{item.status}</div>
                    </div>
                    <div className="text-xs text-slate-300">{getFreshnessLabel(item.freshnessHours)}</div>
                    <div className="text-xs text-slate-300">{formatDate(item.sourceLastCheckedAt || item.verifiedAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}