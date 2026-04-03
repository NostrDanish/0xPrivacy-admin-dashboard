import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import {
  Inbox, RefreshCw, Lock, ShieldCheck, Filter, X,
  ExternalLink, Clock, Tag, ChevronDown, ChevronUp,
} from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAdminInbox, type DecryptedSubmission } from '@/hooks/useAdminInbox';
import { useAuthor } from '@/hooks/useAuthor';
import { LoginArea } from '@/components/auth/LoginArea';
import { genUserName } from '@/lib/genUserName';
import { SUBMISSION_TOPICS } from '@/lib/adminConfig';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ── Topic colour map ──────────────────────────────────────────────────────────

const TOPIC_COLOR: Record<string, string> = Object.fromEntries(
  SUBMISSION_TOPICS.map((t) => [t.id, t.color])
);
function topicColor(topic: string) { return TOPIC_COLOR[topic] ?? '#8e8e93'; }

// ── Submission card ───────────────────────────────────────────────────────────

function SubmissionCard({ sub }: { sub: DecryptedSubmission }) {
  const author = useAuthor(sub.senderPubkey);
  const meta = author.data?.metadata;
  const displayName = meta?.display_name ?? meta?.name ?? genUserName(sub.senderPubkey);
  const [expanded, setExpanded] = useState(false);
  const color = topicColor(sub.topic);

  const ts = new Date(sub.createdAt * 1000);
  const timeStr = ts.toLocaleString();

  return (
    <div className="border rounded-lg overflow-hidden transition-all hover:border-white/15"
      style={{ borderColor: `${color}18` }}>
      <div className="flex items-start gap-3 p-4">
        <Avatar className="w-8 h-8 rounded-lg border border-white/10 shrink-0 mt-0.5">
          <AvatarImage src={meta?.picture} />
          <AvatarFallback className="font-mono text-[9px] rounded-lg" style={{ backgroundColor: `${color}12`, color }}>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-white/80 truncate">{displayName}</span>
            <Badge className="font-mono text-[9px] h-4 px-1.5 border" style={{
              backgroundColor: `${color}12`, color, borderColor: `${color}30`,
            }}>#{sub.topic}</Badge>
            {sub.extraTags.map((t) => (
              <Badge key={t} variant="outline" className="font-mono text-[9px] h-4 px-1.5 text-white/40 border-white/10">#{t}</Badge>
            ))}
          </div>
          <p className={`text-xs text-white/60 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {sub.plaintext.replace(/^#\w+(\s+#\w+)*\s*---\s*/i, '')}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 font-mono text-[9px] text-white/30 hover:text-white/60 transition-colors">
              {expanded ? <><ChevronUp className="w-3 h-3" />COLLAPSE</> : <><ChevronDown className="w-3 h-3" />EXPAND</>}
            </button>
            <div className="flex items-center gap-1 font-mono text-[9px] text-white/25">
              <Clock className="w-3 h-3" />{timeStr}
            </div>
          </div>
        </div>
        <a href={`https://njump.me/${sub.senderPubkey}`} target="_blank" rel="noopener noreferrer"
          className="text-white/20 hover:text-[#00ff9f] transition-colors p-1 shrink-0">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Full Message</p>
          <pre className="text-xs text-white/60 whitespace-pre-wrap leading-relaxed font-mono bg-white/[0.02] p-3 rounded border border-white/5">
            {sub.plaintext}
          </pre>
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-white/20" />
            <code className="font-mono text-[9px] text-white/25 break-all">{sub.senderPubkey}</code>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-white/20" />
            <code className="font-mono text-[9px] text-white/25">event id: {sub.id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main InboxPage ────────────────────────────────────────────────────────────

export default function AdminInbox() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [filterTopic, setFilterTopic] = useState<string | null>(null);

  useSeoMeta({ title: 'Submission Inbox — 0xPrivacy Admin' });

  const { data: submissions = [], isLoading, isFetching, refetch } = useAdminInbox(100);

  if (!isAdmin && !adminLoading) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-16 h-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <Lock className="w-7 h-7 text-red-400/60" />
          </div>
          <div>
            <p className="font-mono text-sm text-red-400/60 mb-1">// ACCESS DENIED</p>
            <h1 className="text-2xl font-bold text-white mb-2">Submission Inbox</h1>
            <p className="text-sm text-white/40">Admin access required.</p>
          </div>
          <LoginArea className="max-w-xs" />
        </div>
      </SiteLayout>
    );
  }

  const filtered = filterTopic ? submissions.filter((s) => s.topic === filterTopic) : submissions;

  const topicCounts = SUBMISSION_TOPICS.reduce((acc, t) => {
    acc[t.id] = submissions.filter((s) => s.topic === t.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-10 pb-6 border-b border-[#00ff9f]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-1">
                // encrypted submissions
              </p>
              <h1 className="text-3xl font-bold text-white">
                Submission <span className="text-[#00ff9f]">Inbox</span>
              </h1>
              <p className="text-sm text-white/40 mt-1">
                NIP-04 encrypted DMs sent to the support pubkey, decrypted client-side.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00ff9f]/20 rounded font-mono text-[10px] text-[#00ff9f]/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/5 hover:border-[#00ff9f]/40 disabled:opacity-40 transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
              REFRESH
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar: topic filters ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-3.5 h-3.5 text-white/40" />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Filter by Topic</span>
            </div>
            <button
              onClick={() => setFilterTopic(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs transition-all ${
                !filterTopic ? 'border-[#00ff9f]/40 bg-[#00ff9f]/8 text-[#00ff9f]' : 'border-white/8 text-white/40 hover:border-white/15'
              }`}
            >
              <span>ALL</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5">{submissions.length}</span>
            </button>
            {SUBMISSION_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTopic(filterTopic === t.id ? null : t.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs transition-all"
                style={filterTopic === t.id
                  ? { borderColor: `${t.color}40`, backgroundColor: `${t.color}10`, color: t.color }
                  : { borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              >
                <span>{t.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${t.color}12`, color: `${t.color}80` }}>
                  {topicCounts[t.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* ── Main: submissions list ── */}
          <div className="lg:col-span-3 space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-white/5" />
              ))
            ) : filtered.length === 0 ? (
              <div className="border border-dashed border-[#00ff9f]/10 rounded-lg p-10 text-center">
                <Inbox className="w-8 h-8 text-[#00ff9f]/20 mx-auto mb-3" />
                <p className="font-mono text-sm text-white/30">
                  {filterTopic ? `No ${filterTopic} submissions.` : 'Inbox is empty.'}
                </p>
                <p className="text-xs text-white/20 mt-1">
                  Submissions are NIP-04 DMs. Make sure your signer supports NIP-04 decryption.
                </p>
              </div>
            ) : (
              filtered.map((sub) => <SubmissionCard key={sub.id} sub={sub} />)
            )}

            {!isLoading && filtered.length > 0 && (
              <p className="font-mono text-[9px] text-white/20 text-center pt-2">
                {filtered.length} submission{filtered.length !== 1 ? 's' : ''} shown
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
