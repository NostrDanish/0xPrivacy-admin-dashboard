import { useState, useEffect } from 'react';
import { useSeoMeta } from '@unhead/react';
import {
  Shield, ShieldCheck, Rss, Hash, Database, Lock,
  Plus, Trash2, Save, RefreshCw, Copy, Check, X, ExternalLink,
  Key, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAdminConfig, useSaveAdmins, useSaveVerifiedSources, useSaveRssFeeds, useSaveHashtags } from '@/hooks/useAdminConfig';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { LoginArea } from '@/components/auth/LoginArea';
import { useToast } from '@/hooks/useToast';
import { genUserName } from '@/lib/genUserName';
import { OWNER_PUBKEY, type AdminVerifiedSource, type RssFeed } from '@/lib/adminConfig';
import { nip19 } from 'nostr-tools';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Shared small helpers ──────────────────────────────────────────────────

type TabId = 'verified' | 'rss' | 'hashtags' | 'mirrors' | 'admins' | 'feedtabs';

function SectionHeader({ icon: Icon, title, subtitle, color = '#00ff9f' }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <h2 className="font-bold text-white text-base">{title}</h2>
        <p className="text-xs text-white/40 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

function SaveBtn({ isPending, onClick, disabled }: { isPending: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending || disabled}
      className="font-mono text-xs bg-[#00ff9f] hover:bg-[#00ff9f]/90 text-black font-bold px-4 h-8 disabled:opacity-40"
    >
      {isPending
        ? <><RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />SAVING…</>
        : <><Save className="w-3 h-3 mr-1.5" />SAVE TO NOSTR</>}
    </Button>
  );
}



export default function AdminDashboard() {
  const { isAdmin, isOwner, isLoading } = useIsAdmin();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('verified');

  useSeoMeta({ title: 'Admin Dashboard — 0xPrivacy.online' });

  if (!user) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-16 h-16 rounded-2xl border border-[#00ff9f]/20 bg-[#00ff9f]/5 flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#00ff9f]/40" />
          </div>
          <div>
            <p className="font-mono text-sm text-[#00ff9f]/60 mb-1">// ACCESS RESTRICTED</p>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-sm text-white/40">Login with your Nostr identity to access the admin panel.</p>
          </div>
          <LoginArea className="max-w-xs" />
        </div>
      </SiteLayout>
    );
  }

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 font-mono text-[#00ff9f]/60 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            VERIFYING IDENTITY…
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-16 h-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <Shield className="w-7 h-7 text-red-400/60" />
          </div>
          <div>
            <p className="font-mono text-sm text-red-400/60 mb-1">// ACCESS DENIED</p>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-sm text-white/40 mb-1">Your pubkey is not on the admin list.</p>
            <code className="font-mono text-[10px] text-white/20 break-all">{user.pubkey}</code>
          </div>
          <p className="text-xs text-white/30">Contact nostrdanish to request access.</p>
        </div>
      </SiteLayout>
    );
  }

  const TABS = [
    { id: 'verified' as TabId, label: 'Verified Feed', icon: ShieldCheck, color: '#00ff9f' },
    { id: 'rss' as TabId, label: 'RSS Feeds', icon: Rss, color: '#00ffff' },
    { id: 'hashtags' as TabId, label: 'Hashtags', icon: Hash, color: '#00ffff' },
    { id: 'mirrors' as TabId, label: 'Mirrors / IPFS', icon: Database, color: '#bf5af2' },
    { id: 'admins' as TabId, label: 'Admins', icon: Key, color: '#ff9f00', ownerOnly: true },
  ];

  return (
    <SiteLayout>
      {/* ── Header ── */}
      <section className="pt-10 pb-6 border-b border-[#00ff9f]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs text-[#00ff9f]/40 uppercase tracking-widest mb-1">
                // sovereign control panel
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Admin <span className="text-[#00ff9f]">Dashboard</span>
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Manage the verified feed, RSS sources, hashtags, mirrors and admins.
                All changes publish to Nostr via NIP-78 (kind:30078).
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && (
                <span className="font-mono text-[9px] px-2 py-1 border border-[#ff9f00]/30 bg-[#ff9f00]/5 text-[#ff9f00] rounded">
                  OWNER
                </span>
              )}
              <span className="font-mono text-[9px] px-2 py-1 border border-[#00ff9f]/30 bg-[#00ff9f]/5 text-[#00ff9f] rounded">
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab bar ── */}
      <div className="sticky top-16 z-40 border-b border-[#00ff9f]/8 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 overflow-x-auto">
            {TABS.filter((t) => !('ownerOnly' in t) || !t.ownerOnly || isOwner).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 font-mono text-xs whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#00ff9f] text-[#00ff9f]'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
                style={activeTab === tab.id ? { borderColor: tab.color, color: tab.color } : {}}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'verified' && <VerifiedTab toast={toast} />}
        {activeTab === 'rss' && <RssTab toast={toast} />}
        {activeTab === 'hashtags' && <HashtagsTab toast={toast} />}
        {activeTab === 'mirrors' && <MirrorsTab />}
        {activeTab === 'admins' && isOwner && <AdminsTab toast={toast} currentUserPubkey={user.pubkey} />}
      </div>

    </SiteLayout>
  );
}

// ─── VerifiedTab ──────────────────────────────────────────────────────────────
type ToastFn = ReturnType<typeof useToast>['toast'];

function VerifiedTab({ toast }: { toast: ToastFn }) {
  const { data: config, isLoading } = useAdminConfig();
  const { mutate: save, isPending } = useSaveVerifiedSources();
  const { user } = useCurrentUser();

  const [sources, setSources] = useState<AdminVerifiedSource[]>([]);
  const [dirty, setDirty] = useState(false);

  const [form, setForm] = useState({
    pubkey: '', handle: '', displayName: '', description: '', category: 'privacy', nip05: '', website: '',
  });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (config?.verifiedSources) {
      setSources(config.verifiedSources);
    }
  }, [config?.verifiedSources]);

  const handleAdd = () => {
    if (!form.pubkey.trim() || !form.displayName.trim()) return;
    const newSource: AdminVerifiedSource = {
      ...form,
      pubkey: form.pubkey.trim(),
      addedBy: user?.pubkey ?? '',
      addedAt: Math.floor(Date.now() / 1000),
    };
    const next = [...sources, newSource];
    setSources(next);
    setDirty(true);
    setShowAdd(false);
    setForm({ pubkey: '', handle: '', displayName: '', description: '', category: 'privacy', nip05: '', website: '' });
  };

  const handleRemove = (pubkey: string) => {
    setSources((prev) => prev.filter((s) => s.pubkey !== pubkey));
    setDirty(true);
  };

  const handleSave = () => {
    save({ sources }, {
      onSuccess: () => { toast({ description: 'Verified sources saved to Nostr.' }); setDirty(false); },
      onError: () => toast({ description: 'Failed to save.', variant: 'destructive' }),
    });
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full bg-white/5" />)}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ShieldCheck}
        title="Verified Feed Sources"
        subtitle="npubs listed here appear in the Verified Sources sidebar and their posts appear in the Verified Feed tab. All queries are author-filtered."
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="font-mono text-xs text-white/40">{sources.length} source{sources.length !== 1 ? 's' : ''} configured</p>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAdd(!showAdd)}
            variant="outline"
            className="font-mono text-xs border-[#00ff9f]/30 text-[#00ff9f] hover:bg-[#00ff9f]/10 h-8"
          >
            <Plus className="w-3 h-3 mr-1.5" />ADD SOURCE
          </Button>
          <SaveBtn isPending={isPending} onClick={handleSave} disabled={!dirty} />
        </div>
      </div>

      {showAdd && (
        <div className="p-4 border border-[#00ff9f]/20 rounded-lg bg-[#00ff9f]/[0.02] space-y-3">
          <p className="font-mono text-xs text-[#00ff9f]/60 uppercase tracking-widest">Add Verified Source</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">HEX PUBKEY *</label>
              <Input value={form.pubkey} onChange={(e) => setForm({ ...form, pubkey: e.target.value })}
                placeholder="64-char hex or npub1..." className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">DISPLAY NAME *</label>
              <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="Edward Snowden" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">HANDLE</label>
              <Input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })}
                placeholder="Snowden" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">CATEGORY</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full font-mono text-xs bg-black border border-white/10 text-white/70 h-8 rounded px-2 focus:border-[#00ff9f]/30 outline-none">
                {['privacy', 'security', 'cypherpunk', 'bitcoin', 'nostr-dev', 'journalism'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">NIP-05</label>
              <Input value={form.nip05} onChange={(e) => setForm({ ...form, nip05: e.target.value })}
                placeholder="user@domain.com" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">WEBSITE</label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://example.com" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] text-white/40 mb-1 block">DESCRIPTION</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short bio..." className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ff9f]/30" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowAdd(false)} variant="ghost" className="font-mono text-xs text-white/40 h-8">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.pubkey.trim() || !form.displayName.trim()}
              className="font-mono text-xs bg-[#00ff9f]/90 text-black h-8 hover:bg-[#00ff9f]">
              <Plus className="w-3 h-3 mr-1" />ADD
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sources.length === 0 ? (
          <div className="border border-dashed border-[#00ff9f]/10 rounded-lg p-8 text-center">
            <ShieldCheck className="w-8 h-8 text-[#00ff9f]/20 mx-auto mb-3" />
            <p className="font-mono text-xs text-white/30">No verified sources. Add one above.</p>
          </div>
        ) : (
          sources.map((src) => (
            <VerifiedSourceRow key={src.pubkey} source={src} onRemove={() => handleRemove(src.pubkey)} />
          ))
        )}
      </div>

      {dirty && (
        <div className="flex items-center gap-2 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <p className="font-mono text-xs text-amber-400/80">Unsaved changes. Click SAVE TO NOSTR to publish.</p>
        </div>
      )}
    </div>
  );
}

function VerifiedSourceRow({ source, onRemove }: { source: AdminVerifiedSource; onRemove: () => void }) {
  const author = useAuthor(source.pubkey);
  const meta = author.data?.metadata;
  const displayName = meta?.name ?? source.displayName;

  return (
    <div className="flex items-center gap-3 p-3 border border-[#00ff9f]/8 rounded-lg hover:border-[#00ff9f]/20 transition-all group">
      <Avatar className="w-8 h-8 rounded-lg border border-[#00ff9f]/15 shrink-0">
        <AvatarImage src={meta?.picture} />
        <AvatarFallback className="bg-[#00ff9f]/10 text-[#00ff9f] font-mono text-[9px] rounded-lg">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-white/80 truncate">{displayName}</span>
          <Badge variant="outline" className="font-mono text-[9px] border-[#00ff9f]/20 text-[#00ff9f]/60 h-4 px-1.5">{source.category}</Badge>
          {source.nip05 && <span className="font-mono text-[9px] text-[#00ff9f]/40">{source.nip05}</span>}
        </div>
        <code className="font-mono text-[9px] text-white/20 truncate block">{source.pubkey}</code>
      </div>
      <a href={`https://njump.me/${source.pubkey}`} target="_blank" rel="noopener noreferrer"
        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#00ff9f] transition-all p-1">
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all p-1">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── RssTab ───────────────────────────────────────────────────────────────────

function RssTab({ toast }: { toast: ToastFn }) {
  const { data: config, isLoading } = useAdminConfig();
  const { mutate: save, isPending } = useSaveRssFeeds();
  const { user } = useCurrentUser();

  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [dirty, setDirty] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', category: 'news' });

  useEffect(() => { if (config?.rssFeeds) setFeeds(config.rssFeeds); }, [config?.rssFeeds]);

  const handleAdd = () => {
    if (!form.url.trim() || !form.title.trim()) return;
    const newFeed: RssFeed = {
      id: crypto.randomUUID(),
      ...form,
      url: form.url.trim(),
      addedBy: user?.pubkey ?? '',
      addedAt: Math.floor(Date.now() / 1000),
    };
    setFeeds((prev) => [...prev, newFeed]);
    setDirty(true);
    setShowAdd(false);
    setForm({ title: '', url: '', description: '', category: 'news' });
  };

  const handleRemove = (id: string) => { setFeeds((prev) => prev.filter((f) => f.id !== id)); setDirty(true); };

  const handleSave = () => {
    save({ feeds }, {
      onSuccess: () => { toast({ description: 'RSS feeds saved to Nostr.' }); setDirty(false); },
      onError: () => toast({ description: 'Failed to save.', variant: 'destructive' }),
    });
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full bg-white/5" />)}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Rss} title="RSS / Atom Feeds" subtitle="Curated RSS/Atom feed URLs shown in the site and used for news aggregation. Stored on Nostr via NIP-78." color="#00ffff" />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="font-mono text-xs text-white/40">{feeds.length} feed{feeds.length !== 1 ? 's' : ''}</p>
        <div className="flex gap-2">
          <Button onClick={() => setShowAdd(!showAdd)} variant="outline" className="font-mono text-xs border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10 h-8">
            <Plus className="w-3 h-3 mr-1.5" />ADD FEED
          </Button>
          <SaveBtn isPending={isPending} onClick={handleSave} disabled={!dirty} />
        </div>
      </div>

      {showAdd && (
        <div className="p-4 border border-[#00ffff]/20 rounded-lg bg-[#00ffff]/[0.02] space-y-3">
          <p className="font-mono text-xs text-[#00ffff]/60 uppercase tracking-widest">Add RSS Feed</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">TITLE *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="EFF Deeplinks" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ffff]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">CATEGORY</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full font-mono text-xs bg-black border border-white/10 text-white/70 h-8 rounded px-2 focus:border-[#00ffff]/30 outline-none">
                {['news', 'security', 'privacy', 'bitcoin', 'tech', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] text-white/40 mb-1 block">FEED URL *</label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://www.eff.org/rss/updates.xml" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ffff]/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] text-white/40 mb-1 block">DESCRIPTION</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description..." className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ffff]/30" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowAdd(false)} variant="ghost" className="font-mono text-xs text-white/40 h-8">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.url.trim() || !form.title.trim()}
              className="font-mono text-xs bg-[#00ffff]/80 text-black h-8 hover:bg-[#00ffff]">
              <Plus className="w-3 h-3 mr-1" />ADD
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {feeds.length === 0 ? (
          <div className="border border-dashed border-[#00ffff]/10 rounded-lg p-8 text-center">
            <Rss className="w-8 h-8 text-[#00ffff]/20 mx-auto mb-3" />
            <p className="font-mono text-xs text-white/30">No RSS feeds. Add one above.</p>
          </div>
        ) : feeds.map((feed) => (
          <div key={feed.id} className="flex items-center gap-3 p-3 border border-[#00ffff]/8 rounded-lg hover:border-[#00ffff]/20 transition-all group">
            <div className="w-7 h-7 rounded border border-[#00ffff]/20 bg-[#00ffff]/5 flex items-center justify-center shrink-0">
              <Rss className="w-3.5 h-3.5 text-[#00ffff]/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/80 truncate">{feed.title}</span>
                <Badge variant="outline" className="font-mono text-[9px] border-[#00ffff]/20 text-[#00ffff]/50 h-4 px-1.5">{feed.category}</Badge>
              </div>
              <code className="font-mono text-[9px] text-white/25 truncate block">{feed.url}</code>
            </div>
            <a href={feed.url} target="_blank" rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#00ffff] transition-all p-1">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => handleRemove(feed.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      {dirty && <div className="flex items-center gap-2 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <p className="font-mono text-xs text-amber-400/80">Unsaved changes.</p>
      </div>}
    </div>
  );
}

// ─── HashtagsTab ──────────────────────────────────────────────────────────────

function HashtagsTab({ toast }: { toast: ToastFn }) {
  const { data: config, isLoading } = useAdminConfig();
  const { mutate: save, isPending } = useSaveHashtags();

  const [tags, setTags] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => { if (config?.hashtags) setTags(config.hashtags); }, [config?.hashtags]);

  const addTag = () => {
    const clean = input.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) { setTags((p) => [...p, clean]); setDirty(true); }
    setInput('');
  };

  const removeTag = (t: string) => { setTags((p) => p.filter((x) => x !== t)); setDirty(true); };

  const handleSave = () => {
    save({ hashtags: tags }, {
      onSuccess: () => { toast({ description: 'Hashtags saved to Nostr.' }); setDirty(false); },
      onError: () => toast({ description: 'Failed to save.', variant: 'destructive' }),
    });
  };

  if (isLoading) return <Skeleton className="h-32 w-full bg-white/5" />;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Hash} title="Tracked Hashtags" subtitle="These hashtags populate the community feed filter pills and the verified feed query. Save to Nostr to update all clients." color="#00ffff" />

      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add hashtag (e.g. privacy)" maxLength={40}
          className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#00ffff]/30" />
        <Button onClick={addTag} disabled={!input.trim()} variant="outline"
          className="font-mono text-xs border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10 h-8 px-3">
          <Plus className="w-3.5 h-3.5" />
        </Button>
        <SaveBtn isPending={isPending} onClick={handleSave} disabled={!dirty} />
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} onClick={() => removeTag(tag)}
            className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded border border-[#00ffff]/25 bg-[#00ffff]/5 text-[#00ffff]/70 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all group">
            #{tag}
            <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
          </button>
        ))}
        {tags.length === 0 && <p className="font-mono text-xs text-white/30">No hashtags yet.</p>}
      </div>
      <p className="font-mono text-[10px] text-white/25">{tags.length} tracked tag{tags.length !== 1 ? 's' : ''} — click any tag to remove it.</p>
    </div>
  );
}

// ─── MirrorsTab ───────────────────────────────────────────────────────────────

function MirrorsTab() {
  const [entries, setEntries] = useState<{ id: string; label: string; cid: string; url: string; addedAt: number }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: '', cid: '', url: '' });
  const [copied, setCopied] = useState<string | null>(null);

  const addEntry = () => {
    if (!form.cid.trim()) return;
    setEntries((p) => [...p, { id: crypto.randomUUID(), ...form, addedAt: Date.now() }]);
    setForm({ label: '', cid: '', url: '' });
    setShowAdd(false);
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Database} title="Mirrors / IPFS" subtitle="IPFS CIDs and gateway links for mirrored content. Add CIDs you have pinned for the Mirror Vault. Note: local state only — NIP-78 persistence coming soon." color="#bf5af2" />

      <div className="flex justify-between flex-wrap gap-3">
        <p className="font-mono text-xs text-white/40">{entries.length} mirror{entries.length !== 1 ? 's' : ''}</p>
        <Button onClick={() => setShowAdd(!showAdd)} variant="outline"
          className="font-mono text-xs border-[#bf5af2]/30 text-[#bf5af2] hover:bg-[#bf5af2]/10 h-8">
          <Plus className="w-3 h-3 mr-1.5" />PIN IPFS CID
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 border border-[#bf5af2]/20 rounded-lg bg-[#bf5af2]/[0.02] space-y-3">
          <p className="font-mono text-xs text-[#bf5af2]/60 uppercase tracking-widest">Add IPFS Mirror</p>
          <div className="space-y-3">
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">LABEL</label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="0xPrivacy.online v1.2 snapshot" className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#bf5af2]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">IPFS CID *</label>
              <Input value={form.cid} onChange={(e) => setForm({ ...form, cid: e.target.value })}
                placeholder="bafybeig..." className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#bf5af2]/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 mb-1 block">GATEWAY URL</label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://ipfs.io/ipfs/bafybeig..." className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#bf5af2]/30" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowAdd(false)} variant="ghost" className="font-mono text-xs text-white/40 h-8">Cancel</Button>
            <Button onClick={addEntry} disabled={!form.cid.trim()} className="font-mono text-xs bg-[#bf5af2]/80 text-white h-8 hover:bg-[#bf5af2]">
              <Plus className="w-3 h-3 mr-1" />ADD
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="border border-dashed border-[#bf5af2]/10 rounded-lg p-8 text-center">
            <Database className="w-8 h-8 text-[#bf5af2]/20 mx-auto mb-3" />
            <p className="font-mono text-xs text-white/30">No mirrors yet. Pin a CID above.</p>
          </div>
        ) : entries.map((e) => (
          <div key={e.id} className="flex items-center gap-3 p-3 border border-[#bf5af2]/8 rounded-lg hover:border-[#bf5af2]/20 transition-all group">
            <div className="w-7 h-7 rounded border border-[#bf5af2]/20 bg-[#bf5af2]/5 flex items-center justify-center shrink-0">
              <Database className="w-3.5 h-3.5 text-[#bf5af2]/60" />
            </div>
            <div className="flex-1 min-w-0">
              {e.label && <span className="text-xs font-semibold text-white/70 block truncate">{e.label}</span>}
              <code className="font-mono text-[9px] text-[#bf5af2]/50 truncate block">{e.cid}</code>
            </div>
            <button onClick={() => copy(e.cid, e.id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#bf5af2] transition-all p-1">
              {copied === e.id ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#bf5af2] transition-all p-1">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>}
            <button onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AdminsTab (owner only) ───────────────────────────────────────────────────

function AdminsTab({ toast, currentUserPubkey }: { toast: ToastFn; currentUserPubkey: string }) {
  const { data: config, isLoading } = useAdminConfig();
  const { mutate: save, isPending } = useSaveAdmins();

  const [admins, setAdmins] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => { if (config?.admins) setAdmins(config.admins); }, [config?.admins]);

  const addAdmin = () => {
    let pk = input.trim();
    try {
      if (pk.startsWith('npub1')) {
        const decoded = nip19.decode(pk);
        if (decoded.type === 'npub') pk = decoded.data as string;
      }
    } catch { /* invalid npub */ }
    if (pk.length === 64 && !admins.includes(pk)) { setAdmins((p) => [...p, pk]); setDirty(true); }
    setInput('');
  };

  const removeAdmin = (pk: string) => {
    if (pk === OWNER_PUBKEY) return;
    setAdmins((p) => p.filter((x) => x !== pk));
    setDirty(true);
  };

  const handleSave = () => {
    save({ admins }, {
      onSuccess: () => { toast({ description: 'Admin list saved to Nostr.' }); setDirty(false); },
      onError: () => toast({ description: 'Failed to save.', variant: 'destructive' }),
    });
  };

  if (isLoading) return <Skeleton className="h-32 w-full bg-white/5" />;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Key} title="Admin Management" subtitle="Only you (OWNER) can add or remove admins. Admins can manage verified sources, RSS feeds, hashtags, and mirrors — but cannot modify the admin list." color="#ff9f00" />

      <div className="p-4 border border-[#ff9f00]/20 bg-[#ff9f00]/[0.03] rounded-lg flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#ff9f00] shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-xs text-[#ff9f00]/80 mb-1">OWNER-ONLY OPERATION</p>
          <p className="text-xs text-white/40">These changes are published as kind:30078 events signed with your private key. Only events signed by the OWNER pubkey are trusted by the app.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAdmin()}
          placeholder="npub1... or 64-char hex pubkey"
          className="font-mono text-xs bg-transparent border-white/10 text-white/80 h-8 focus-visible:ring-[#ff9f00]/30" />
        <Button onClick={addAdmin} disabled={!input.trim()} variant="outline"
          className="font-mono text-xs border-[#ff9f00]/30 text-[#ff9f00] hover:bg-[#ff9f00]/10 h-8 px-3">
          <Plus className="w-3.5 h-3.5" />
        </Button>
        <SaveBtn isPending={isPending} onClick={handleSave} disabled={!dirty} />
      </div>

      <div className="space-y-2">
        {admins.map((pk) => (
          <AdminRow
            key={pk}
            pubkey={pk}
            isOwner={pk === OWNER_PUBKEY}
            isSelf={pk === currentUserPubkey}
            onRemove={() => removeAdmin(pk)}
          />
        ))}
      </div>

      {dirty && <div className="flex items-center gap-2 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <p className="font-mono text-xs text-amber-400/80">Unsaved changes — publish to apply.</p>
      </div>}
    </div>
  );
}

function AdminRow({ pubkey, isOwner, isSelf, onRemove }: {
  pubkey: string;
  isOwner: boolean;
  isSelf: boolean;
  onRemove: () => void;
}) {
  const author = useAuthor(pubkey);
  const meta = author.data?.metadata;
  const displayName = meta?.display_name ?? meta?.name ?? genUserName(pubkey);
  const [expanded, setExpanded] = useState(false);

  let npub = pubkey;
  try { npub = nip19.npubEncode(pubkey); } catch { /* ignore */ }

  return (
    <div className="border border-white/8 rounded-lg hover:border-[#ff9f00]/20 transition-all">
      <div className="flex items-center gap-3 p-3">
        <Avatar className="w-8 h-8 rounded-lg border border-white/10 shrink-0">
          <AvatarImage src={meta?.picture} />
          <AvatarFallback className="bg-[#ff9f00]/10 text-[#ff9f00] font-mono text-[9px] rounded-lg">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-white/80 truncate">{displayName}</span>
            {isOwner && <Badge className="font-mono text-[9px] bg-[#ff9f00]/15 text-[#ff9f00] border-[#ff9f00]/30 h-4 px-1.5">OWNER</Badge>}
            {isSelf && !isOwner && <Badge className="font-mono text-[9px] bg-[#00ff9f]/10 text-[#00ff9f] border-[#00ff9f]/30 h-4 px-1.5">YOU</Badge>}
            {meta?.nip05 && <span className="font-mono text-[9px] text-[#00ff9f]/40">{meta.nip05}</span>}
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-white/20 hover:text-white/50 p-1 transition-colors">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {!isOwner && (
          <button onClick={onRemove} className="text-white/20 hover:text-red-400 transition-colors p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {expanded && (
        <div className="px-4 pb-3 space-y-1 border-t border-white/5">
          <div className="flex items-center gap-2 mt-2">
            <code className="font-mono text-[9px] text-white/25 break-all flex-1">{pubkey}</code>
          </div>
          <code className="font-mono text-[9px] text-white/20 break-all block">{npub}</code>
          {meta?.about && <p className="text-[10px] text-white/35 mt-1">{meta.about}</p>}
        </div>
      )}
    </div>
  );
}
