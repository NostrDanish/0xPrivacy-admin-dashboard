import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSubmitToDM } from '@/hooks/useSubmitToDM';
import { useToast } from '@/hooks/useToast';
import { LoginArea } from '@/components/auth/LoginArea';
import { SUBMISSION_TOPICS, type SubmissionTopicId } from '@/lib/adminConfig';
import {
  Send, CheckCircle2, Lock, ChevronDown, Info, X, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SubmitWidgetProps {
  defaultTopic?: SubmissionTopicId;
  compact?: boolean;
}

export function SubmitWidget({ defaultTopic = 'other', compact = false }: SubmitWidgetProps) {
  const { user } = useCurrentUser();
  const { mutate: submit, isPending } = useSubmitToDM();
  const { toast } = useToast();

  const [selectedTopic, setSelectedTopic] = useState<SubmissionTopicId>(defaultTopic);
  const [message, setMessage] = useState('');
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [sent, setSent] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const activeTopic = SUBMISSION_TOPICS.find((t) => t.id === selectedTopic)!;
  const canSubmit = message.trim().length > 5 && !!user && !isPending && !sent;

  const addCustomTag = () => {
    const clean = customTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !extraTags.includes(clean)) {
      setExtraTags((prev) => [...prev, clean]);
    }
    setCustomTag('');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    submit(
      { topic: selectedTopic, message, extraTags },
      {
        onSuccess: () => {
          setSent(true);
          toast({ description: '✓ Submission sent to the 0xPrivacy team via encrypted DM.' });
          setTimeout(() => {
            setSent(false);
            setMessage('');
            setExtraTags([]);
          }, 3000);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Failed to send';
          toast({ description: msg.includes('nip04') ? 'Your signer does not support NIP-04 encryption.' : 'Failed to send. Check your connection.', variant: 'destructive' });
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="border border-[#00ff9f]/15 rounded-lg p-5 text-center space-y-3 bg-white/[0.01]">
        <Lock className="w-8 h-8 text-[#00ff9f]/30 mx-auto" />
        <div>
          <p className="font-mono text-xs text-[#00ff9f]/60 mb-1">LOGIN TO SUBMIT</p>
          <p className="text-xs text-white/40">
            Submissions are sent as NIP-04 encrypted DMs. Login to keep your submission private.
          </p>
        </div>
        <div className="flex justify-center">
          <LoginArea className="max-w-xs" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#00ff9f]/15 rounded-lg overflow-hidden bg-black/40">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff9f]/10 bg-[#00ff9f]/[0.02]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f]" />
        <span className="font-mono text-[10px] text-[#00ff9f]/60 uppercase tracking-widest">
          Encrypted Submission
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 font-mono text-[9px] text-[#00ff9f]/30">
          <Lock className="w-2.5 h-2.5" />
          NIP-04 · E2E
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Topic selector */}
        <div className="relative">
          <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">
            Topic
          </label>
          <button
            onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 border border-white/10 rounded-lg text-sm hover:border-[#00ff9f]/30 transition-all bg-transparent"
          >
            <span className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-bold"
                style={{ color: activeTopic.color }}
              >
                {activeTopic.label}
              </span>
              {!compact && (
                <span className="text-xs text-white/30">{activeTopic.description}</span>
              )}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showTopicDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTopicDropdown(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#00ff9f]/20 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-20 overflow-hidden">
                {SUBMISSION_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => { setSelectedTopic(topic.id); setShowTopicDropdown(false); }}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors ${selectedTopic === topic.id ? 'bg-white/[0.03]' : ''}`}
                  >
                    <span className="font-mono text-xs font-bold shrink-0 mt-0.5 w-20" style={{ color: topic.color }}>
                      {topic.label}
                    </span>
                    <span className="text-xs text-white/40 leading-relaxed">{topic.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Additional tags */}
        <div>
          <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">
            Additional Tags <span className="text-white/20">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {extraTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setExtraTags((prev) => prev.filter((t) => t !== tag))}
                className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-[#00ffff]/30 bg-[#00ffff]/8 text-[#00ffff]/70 hover:border-red-500/30 hover:text-red-400 transition-colors"
              >
                #{tag} <X className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="add tag…"
              maxLength={30}
              className="flex-1 font-mono text-[11px] bg-transparent border border-white/10 text-white/60 placeholder:text-white/20 focus:border-[#00ff9f]/30 outline-none px-2.5 py-1.5 rounded"
            />
            <button
              onClick={addCustomTag}
              disabled={!customTag.trim()}
              className="p-1.5 border border-white/10 rounded text-white/30 hover:text-[#00ff9f]/60 hover:border-[#00ff9f]/25 disabled:opacity-30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message textarea */}
        <div>
          <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">
            Message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
            placeholder={`Tell us about your ${activeTopic.label} submission…\n\nInclude URLs, npubs, CIDs, or any relevant details.\nCtrl+Enter to send.`}
            className="font-mono text-sm bg-transparent border-white/10 text-white/70 placeholder:text-white/20 focus:border-[#00ff9f]/30 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px] leading-relaxed"
            disabled={isPending || sent}
          />
        </div>

        {/* Encryption notice */}
        <div className="flex items-start gap-2 p-2.5 border border-[#00ff9f]/10 bg-[#00ff9f]/[0.02] rounded">
          <Info className="w-3.5 h-3.5 text-[#00ff9f]/40 shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-[#00ff9f]/50 leading-relaxed">
            Your message is NIP-04 encrypted before sending. Only 0xPrivacy team members
            can read it. The topic tag <span className="text-[#00ff9f]/70">#{selectedTopic}</span> is
            visible to relays for routing — the message body is private.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="font-mono text-[10px] text-white/20">Ctrl+Enter to send</span>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`font-mono text-xs tracking-widest uppercase px-5 transition-all ${
              sent
                ? 'bg-[#00ff9f]/80 text-black cursor-default'
                : 'bg-[#00ff9f] hover:bg-[#00ff9f]/90 text-black font-bold'
            } disabled:opacity-40`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                ENCRYPTING…
              </span>
            ) : sent ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> SENT
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5" /> SEND SECURELY
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
