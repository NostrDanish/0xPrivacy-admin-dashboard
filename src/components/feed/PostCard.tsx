import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NostrEvent } from '@nostrify/nostrify';
import { nip19 } from 'nostr-tools';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { VERIFIED_SOURCES } from '@/lib/verifiedSources';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NoteContent } from '@/components/NoteContent';
import { Copy, ExternalLink, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface PostCardProps {
  event: NostrEvent;
  compact?: boolean;
}

export function PostCard({ event, compact = false }: PostCardProps) {
  const author = useAuthor(event.pubkey);
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(false);

  const metadata = author.data?.metadata;
  const displayName = metadata?.display_name ?? metadata?.name ?? genUserName(event.pubkey);
  const npub = nip19.npubEncode(event.pubkey);
  const shortNpub = npub.slice(0, 10) + '…' + npub.slice(-6);
  const timeAgo = formatDistanceToNow(new Date(event.created_at * 1000), { addSuffix: true });
  const noteId = nip19.noteEncode(event.id);

  // Is this a verified/curated source?
  const verifiedSource = VERIFIED_SOURCES.find((s) => s.pubkey === event.pubkey);

  // Extract hashtags
  const hashtags = event.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value.toLowerCase())
    .slice(0, 5);

  const copyNoteId = async () => {
    await navigator.clipboard.writeText(noteId);
    setCopiedId(true);
    toast({ description: 'Note ID copied.' });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const openInBrowser = () => {
    window.open(`https://njump.me/${noteId}`, '_blank', 'noopener,noreferrer');
  };

  // Skip very short or empty content
  if (event.content.trim().length < 5) return null;

  return (
    <article className="group relative border border-[#00ff9f]/10 bg-white/[0.01] rounded-lg hover:border-[#00ff9f]/25 hover:bg-[#00ff9f]/[0.02] transition-all overflow-hidden">
      {/* Verified source accent stripe */}
      {verifiedSource && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00ff9f]/0 via-[#00ff9f] to-[#00ff9f]/0" />
      )}

      <div className={compact ? 'p-3' : 'p-5'}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <a
            href={`https://njump.me/${npub}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Avatar className={`rounded-lg border border-[#00ff9f]/20 hover:border-[#00ff9f]/50 transition-colors ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <AvatarImage src={metadata?.picture} alt={displayName} />
              <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-xs rounded-lg">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </a>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-white truncate max-w-[160px] ${compact ? 'text-sm' : 'text-base'}`}>
                {displayName}
              </span>
              {verifiedSource && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded border text-[#00ff9f]/80 border-[#00ff9f]/25 bg-[#00ff9f]/8">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  VERIFIED
                </span>
              )}
              {metadata?.nip05 && (
                <span className="font-mono text-[10px] text-[#00ff9f]/50 truncate hidden sm:block">
                  {metadata.nip05}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] text-white/25">{shortNpub}</span>
              <span className="text-white/15">·</span>
              <span className="font-mono text-[10px] text-white/25">{timeAgo}</span>
              {verifiedSource && (
                <span className="font-mono text-[9px] text-white/20 hidden sm:block">
                  // {verifiedSource.description.slice(0, 40)}
                </span>
              )}
            </div>
          </div>

          {/* Actions — appear on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={copyNoteId}
              title="Copy note ID"
              className="p-1.5 text-white/25 hover:text-[#00ff9f] transition-colors rounded"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={openInBrowser}
              title="Open in njump.me"
              className="p-1.5 text-white/25 hover:text-[#00ff9f] transition-colors rounded"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`text-white/70 leading-relaxed break-words ${compact ? 'text-xs line-clamp-3' : 'text-sm'}`}>
          <NoteContent event={event} className={compact ? 'text-xs' : 'text-sm'} />
        </div>

        {/* Hashtags */}
        {!compact && hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#00ff9f]/15 text-[#00ff9f]/50 bg-[#00ff9f]/5 hover:border-[#00ff9f]/30 hover:text-[#00ff9f]/70 cursor-default transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function PostCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`border border-[#00ff9f]/8 bg-white/[0.005] rounded-lg animate-pulse ${compact ? 'p-3' : 'p-5'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`rounded-lg bg-[#00ff9f]/8 shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'}`} />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-28 bg-[#00ff9f]/8 rounded" />
          <div className="h-2.5 w-20 bg-white/5 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-4/5 bg-white/5 rounded" />
        {!compact && <div className="h-3 w-3/5 bg-white/4 rounded" />}
      </div>
      {!compact && (
        <div className="flex gap-2 mt-3">
          <div className="h-4 w-14 bg-[#00ff9f]/5 rounded-full" />
          <div className="h-4 w-10 bg-[#00ff9f]/5 rounded-full" />
        </div>
      )}
    </div>
  );
}
