import { formatDistanceToNow } from 'date-fns';
import type { NostrEvent } from '@nostrify/nostrify';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NoteContent } from '@/components/NoteContent';
import { nip19 } from 'nostr-tools';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface FeedCardProps {
  event: NostrEvent;
}

export function FeedCard({ event }: FeedCardProps) {
  const author = useAuthor(event.pubkey);
  const { toast } = useToast();
  const metadata = author.data?.metadata;
  const displayName = metadata?.display_name ?? metadata?.name ?? genUserName(event.pubkey);
  const shortPubkey = nip19.npubEncode(event.pubkey).slice(0, 12) + '…';
  const timeAgo = formatDistanceToNow(new Date(event.created_at * 1000), { addSuffix: true });

  // Extract hashtags from event tags
  const hashtags = event.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value)
    .slice(0, 4);

  const copyNpub = async () => {
    await navigator.clipboard.writeText(nip19.npubEncode(event.pubkey));
    toast({ description: 'Public key copied to clipboard.', duration: 2000 });
  };

  const openNostr = () => {
    const noteId = nip19.noteEncode(event.id);
    window.open(`https://njump.me/${noteId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative border border-green-500/15 bg-card rounded hover:border-green-500/35 hover:bg-green-500/5 transition-all duration-200 p-4 overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500/0 via-green-500/60 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-8 h-8 rounded border border-green-500/20 shrink-0">
          <AvatarImage src={metadata?.picture} alt={displayName} />
          <AvatarFallback className="bg-green-500/10 text-green-400 font-mono text-xs">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-green-300 text-sm truncate max-w-[140px]">{displayName}</span>
            <button
              onClick={copyNpub}
              className="font-mono text-[10px] text-muted-foreground hover:text-green-400 transition-colors flex items-center gap-1 truncate"
              title="Copy full npub"
            >
              {shortPubkey}
              <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60" />
            </button>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">{timeAgo}</p>
        </div>

        <button
          onClick={openNostr}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-green-600 hover:text-green-400"
          title="Open in njump.me"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="text-sm text-foreground/80 leading-relaxed mb-3 break-words">
        <NoteContent event={event} className="text-sm" />
      </div>

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-mono text-[10px] border-green-500/25 text-green-600 bg-green-500/5 hover:bg-green-500/15 cursor-pointer px-1.5 py-0 tracking-wider"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="border border-green-500/10 bg-card rounded p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-green-500/10 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 bg-green-500/10 rounded" />
          <div className="h-2.5 w-16 bg-green-500/5 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-green-500/10 rounded" />
        <div className="h-3 w-4/5 bg-green-500/10 rounded" />
        <div className="h-3 w-3/5 bg-green-500/5 rounded" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-14 bg-green-500/8 rounded-full" />
        <div className="h-4 w-10 bg-green-500/8 rounded-full" />
      </div>
    </div>
  );
}
