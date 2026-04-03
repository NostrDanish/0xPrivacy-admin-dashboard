import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';
import { LoginArea } from '@/components/auth/LoginArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { genUserName } from '@/lib/genUserName';
import { PRIVACY_HASHTAGS } from '@/lib/verifiedSources';
import {
  Send, CheckCircle2, AlertTriangle, Hash, Shield, X,
} from 'lucide-react';

const CHAR_LIMIT = 280;

const QUICK_TAGS = [
  'privacy', 'cypherpunk', 'nostr', 'opsec', 'tor',
  'bitcoin', 'monero', 'decentralization', 'freedom', 'infosec',
];

interface ComposePostProps {
  onPublished?: () => void;
}

export function ComposePost({ onPublished }: ComposePostProps) {
  const { user, metadata } = useCurrentUser();
  const { mutate: publish, isPending } = useNostrPublish();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['privacy', 'cypherpunk']);
  const [customTag, setCustomTag] = useState('');
  const [sent, setSent] = useState(false);

  const displayName = metadata?.display_name ?? metadata?.name ?? (user ? genUserName(user.pubkey) : '');
  const remaining = CHAR_LIMIT - content.length;
  const isOverLimit = remaining < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !!user && !isPending && !sent;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 8)
    );
  };

  const addCustomTag = () => {
    const clean = customTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !selectedTags.includes(clean) && selectedTags.length < 8) {
      setSelectedTags((prev) => [...prev, clean]);
    }
    setCustomTag('');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    publish(
      {
        kind: 1,
        content: content.trim(),
        tags: selectedTags.map((t) => ['t', t]),
      },
      {
        onSuccess: () => {
          setSent(true);
          toast({ description: '✓ Broadcast to the mesh. Signal propagating.' });
          setTimeout(() => {
            setSent(false);
            setContent('');
            onPublished?.();
          }, 2500);
        },
        onError: () => {
          toast({
            description: 'Relay rejected the event. Check your connection.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="border border-[#00ff9f]/15 rounded-lg p-6 text-center bg-white/[0.01] space-y-4">
        <Shield className="w-10 h-10 text-[#00ff9f]/30 mx-auto" />
        <div>
          <p className="font-mono text-sm text-[#00ff9f]/70 mb-1">AUTHENTICATION REQUIRED</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Connect your Nostr key to broadcast. Use a NIP-07 extension (Alby, nos2x) to keep keys secure.
          </p>
        </div>
        <div className="flex justify-center">
          <LoginArea className="max-w-xs" />
        </div>
        <p className="font-mono text-[10px] text-white/20">
          Your nsec never leaves your signer. Your signal, your keys.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#00ff9f]/20 rounded-lg overflow-hidden bg-black/50">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00ff9f]/10 bg-[#00ff9f]/[0.03]">
        <div className="w-2 h-2 rounded-full bg-red-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-[#00ff9f]/60" />
        <span className="font-mono text-[10px] text-[#00ff9f]/40 ml-2">nostr:kind/1 // broadcast</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 font-mono text-[10px] text-[#00ff9f]/40">
          <Shield className="w-3 h-3" />
          NIP-01 · SIGNED
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Author + textarea */}
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 rounded-lg border border-[#00ff9f]/20 shrink-0">
            <AvatarImage src={metadata?.picture} />
            <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-xs rounded-lg">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
              placeholder={`> Transmit to the privacy mesh…\n\nWhat's on the wire? Ctrl+Enter to broadcast.`}
              className="font-mono text-sm bg-transparent border-[#00ff9f]/15 text-white placeholder:text-white/20 focus:border-[#00ff9f]/40 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px] leading-relaxed"
              disabled={isPending || sent}
            />
            <span
              className={`absolute bottom-2 right-2 font-mono text-[10px] tabular-nums ${
                isOverLimit ? 'text-red-400' : remaining < 40 ? 'text-yellow-400/70' : 'text-white/20'
              }`}
            >
              {remaining}
            </span>
          </div>
        </div>

        {/* Tag picker */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="w-3 h-3 text-[#00ff9f]/40" />
            <span className="font-mono text-[10px] text-[#00ff9f]/40 uppercase tracking-widest">
              Tags <span className="text-white/20">({selectedTags.length}/8)</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {QUICK_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-all ${
                    active
                      ? 'border-[#00ff9f]/50 bg-[#00ff9f]/15 text-[#00ff9f]'
                      : 'border-white/10 text-white/30 hover:border-[#00ff9f]/25 hover:text-white/50'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Selected tags (removable badges) */}
          {selectedTags.filter((t) => !QUICK_TAGS.includes(t)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedTags
                .filter((t) => !QUICK_TAGS.includes(t))
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-[#00ff9f]/40 bg-[#00ff9f]/10 text-[#00ff9f] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
                  >
                    #{tag} <X className="w-2.5 h-2.5" />
                  </button>
                ))}
            </div>
          )}

          {/* Custom tag input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="custom tag…"
              maxLength={30}
              className="flex-1 font-mono text-[11px] bg-transparent border border-white/10 text-white/60 placeholder:text-white/20 focus:border-[#00ff9f]/30 outline-none px-2.5 py-1 rounded"
            />
            <button
              onClick={addCustomTag}
              disabled={!customTag.trim() || selectedTags.length >= 8}
              className="font-mono text-[10px] px-3 py-1 border border-[#00ff9f]/20 text-[#00ff9f]/50 hover:bg-[#00ff9f]/5 hover:text-[#00ff9f]/80 disabled:opacity-30 rounded transition-all"
            >
              + ADD
            </button>
          </div>
        </div>

        {/* OPSEC reminder */}
        <div className="flex items-start gap-2 p-2.5 border border-yellow-500/15 bg-yellow-500/5 rounded">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/60 shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-yellow-600/70 leading-relaxed">
            <span className="text-yellow-400/80">OPSEC:</span> Events are permanent and replicated across relays.
            Use Tor. Guard your nsec. Signed with: <span className="text-yellow-300/60">{user.pubkey.slice(0, 8)}…{user.pubkey.slice(-8)}</span>
          </p>
        </div>

        {/* Submit row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="font-mono text-[10px] text-white/20">
            Ctrl+Enter to broadcast
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`font-mono text-xs tracking-widest px-5 uppercase transition-all ${
              sent
                ? 'bg-[#00ff9f]/80 text-black cursor-default'
                : 'bg-[#00ff9f] hover:bg-[#00ff9f]/90 text-black font-bold'
            } disabled:opacity-40`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                SIGNING…
              </span>
            ) : sent ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> TRANSMITTED
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5" /> BROADCAST
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
