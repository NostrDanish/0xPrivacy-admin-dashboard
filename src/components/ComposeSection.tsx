import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { LoginArea } from '@/components/auth/LoginArea';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Shield, Hash, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const SUGGESTED_TAGS = [
  'privacy', 'cypherpunk', 'nostr', 'opsec', 'bitcoin',
  'freedom', 'cryptography', 'decentralization', 'selfcustody', 'tor',
];

interface ComposeSectionProps {
  id?: string;
}

export function ComposeSection({ id }: ComposeSectionProps) {
  const { user } = useCurrentUser();
  const { mutate: createEvent, isPending } = useNostrPublish();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['cypherpunk', 'privacy']);
  const [customTag, setCustomTag] = useState('');
  const [sent, setSent] = useState(false);

  const charLimit = 280;
  const remaining = charLimit - content.length;
  const isOverLimit = remaining < 0;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 8)
    );
  };

  const addCustomTag = () => {
    const clean = customTag.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags((prev) => [...prev, clean].slice(0, 8));
    }
    setCustomTag('');
  };

  const handleSubmit = () => {
    if (!content.trim() || isOverLimit || !user) return;

    const tagsList = selectedTags.map((t) => ['t', t]);

    createEvent(
      {
        kind: 1,
        content: content.trim(),
        tags: tagsList,
      },
      {
        onSuccess: () => {
          setSent(true);
          setContent('');
          setTimeout(() => setSent(false), 3000);
          toast({ description: 'Broadcast to the Nostr mesh. Signal sent.' });
        },
        onError: () => {
          toast({ description: 'Relay refused the signal. Check your connection.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <section id={id} className="py-20 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <span className="font-mono text-[10px] text-green-600 tracking-widest uppercase block mb-2">
            [SECURE BROADCAST]
          </span>
          <h2 className="font-mono text-2xl font-bold text-green-400 terminal-glow mb-2">
            &gt; Transmit
          </h2>
          <p className="text-muted-foreground text-sm">
            Cryptographically signed. Broadcast to multiple relays simultaneously.
            Your keys, your message, your permanent record on the mesh.
          </p>
        </div>

        {!user ? (
          /* Not logged in state */
          <div className="border border-green-500/20 bg-card rounded p-8 text-center space-y-4">
            <Shield className="w-10 h-10 text-green-500/40 mx-auto" />
            <div>
              <p className="font-mono text-sm text-green-400 mb-1">AUTHENTICATION REQUIRED</p>
              <p className="text-xs text-muted-foreground">
                Generate or import your Nostr keypair to begin broadcasting.
                Use a NIP-07 extension for maximum key security.
              </p>
            </div>
            <div className="flex justify-center">
              <LoginArea className="max-w-xs" />
            </div>
            <div className="font-mono text-[10px] text-muted-foreground pt-2 border-t border-green-500/10">
              Recommended: Alby, nos2x, or Amber (Android) for key custody
            </div>
          </div>
        ) : (
          /* Compose form */
          <div className="border border-green-500/20 bg-card rounded overflow-hidden neon-border">
            {/* Terminal titlebar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/15 bg-green-500/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="font-mono text-[10px] text-green-600 ml-2">nostr://broadcast/kind1</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-green-600">
                <Shield className="w-3 h-3" />
                <span>NIP-01 · SIGNED</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Textarea */}
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`> Transmit your signal to the cypherpunk mesh...\n\nBe sovereign. Be specific. Be free.`}
                  className="font-mono text-sm bg-transparent border-green-500/20 text-green-200 placeholder:text-green-700/50 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 resize-none min-h-[120px] leading-relaxed"
                  disabled={isPending}
                />
                {/* Char counter */}
                <div
                  className={`absolute bottom-2 right-3 font-mono text-[10px] tabular-nums ${
                    isOverLimit ? 'text-red-400' : remaining < 50 ? 'text-amber-400' : 'text-green-700'
                  }`}
                >
                  {remaining}
                </div>
              </div>

              {/* Tag selector */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Hash className="w-3 h-3 text-green-600" />
                  <span className="font-mono text-[10px] text-green-600 tracking-widest uppercase">Tags</span>
                  <span className="font-mono text-[10px] text-muted-foreground">({selectedTags.length}/8)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-all duration-150 tracking-wider ${
                        selectedTags.includes(tag)
                          ? 'border-green-500/60 bg-green-500/20 text-green-400'
                          : 'border-green-500/15 text-green-700 hover:border-green-500/35 hover:text-green-500'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Custom tag input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                    placeholder="custom tag..."
                    maxLength={30}
                    className="font-mono text-[11px] bg-transparent border border-green-500/20 text-green-300 placeholder:text-green-800 focus:border-green-500/40 outline-none px-2 py-1 rounded flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomTag}
                    className="font-mono text-[10px] border-green-500/25 text-green-600 hover:bg-green-500/10 px-2 py-1 h-auto"
                  >
                    + ADD
                  </Button>
                </div>
              </div>

              {/* Selected tags preview */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      onClick={() => toggleTag(tag)}
                      className="font-mono text-[10px] border-green-500/40 bg-green-500/10 text-green-400 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 border border-amber-500/20 bg-amber-500/5 rounded p-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] text-amber-600/80 leading-relaxed">
                  <span className="text-amber-400">OPSEC REMINDER:</span> Events are permanent and broadcast to multiple relays.
                  Avoid metadata leaks. Consider Tor. Your npub is public by design — guard your nsec.
                </p>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-1">
                <div className="font-mono text-[10px] text-muted-foreground">
                  Signing with: <span className="text-green-500">{user.pubkey.slice(0, 8)}…{user.pubkey.slice(-8)}</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isOverLimit || isPending || sent}
                  className={`font-mono text-xs tracking-widest px-5 transition-all duration-200 uppercase ${
                    sent
                      ? 'bg-green-600 text-black'
                      : 'bg-green-500 hover:bg-green-400 text-black font-bold neon-border'
                  }`}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border border-black/40 border-t-black rounded-full animate-spin" />
                      SIGNING...
                    </span>
                  ) : sent ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      TRANSMITTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      BROADCAST
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
