import { useSeoMeta } from '@unhead/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Tag } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { guides } from '@/data/guides';
import NotFound from './NotFound';

/** Simple markdown-to-JSX renderer for guide content */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-4 rounded-lg border border-[#00ff9f]/10 bg-black/80 overflow-hidden">
            {codeLanguage && (
              <div className="px-4 py-1.5 border-b border-[#00ff9f]/10 bg-[#00ff9f]/5">
                <span className="font-mono text-[10px] text-[#00ff9f]/60 uppercase">{codeLanguage}</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className="font-mono text-xs text-[#00ff9f]/80 leading-relaxed">
                {codeLines.join('\n')}
              </code>
            </pre>
          </div>
        );
        codeLines = [];
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} className="h-3" />);
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-[#00ff9f]/10" />
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-white mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold text-[#00ff9f] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${i}`} className="my-4 pl-4 border-l-2 border-[#00ff9f]/30 text-sm text-white/60 italic">
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered list item
    if (line.startsWith('- ')) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-[#00ff9f]/40 font-mono shrink-0 mt-0.5">&gt;</span>
          <span className="text-sm text-white/70 leading-relaxed">{renderInlineMarkdown(line.slice(2))}</span>
        </div>
      );
      continue;
    }

    // Numbered list item
    const numberedMatch = line.match(/^(\d+)\.\s+/);
    if (numberedMatch) {
      elements.push(
        <div key={`ol-${i}`} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-[#00ff9f]/40 font-mono shrink-0 mt-0.5 w-4 text-right">{numberedMatch[1]}.</span>
          <span className="text-sm text-white/70 leading-relaxed">{renderInlineMarkdown(line.slice(numberedMatch[0].length))}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm text-white/60 leading-relaxed my-2">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  return <div className="guide-content">{elements}</div>;
}

/** Render inline markdown (bold, code, links) */
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code `text`
    const codeMatch = remaining.match(/`(.+?)`/);
    // Link [text](url)
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    // Find the earliest match
    const matches = [
      boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
      codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
      linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    const before = remaining.slice(0, earliest.index);
    if (before) parts.push(before);

    if (earliest.type === 'bold') {
      parts.push(<strong key={key++} className="text-white font-semibold">{earliest.match![1]}</strong>);
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === 'code') {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-[#00ff9f]/10 text-[#00ff9f] text-xs font-mono rounded">
          {earliest.match![1]}
        </code>
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === 'link') {
      parts.push(
        <a
          key={key++}
          href={earliest.match![2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff9f] underline underline-offset-2 hover:text-[#00ff9f]/80 transition-colors"
        >
          {earliest.match![1]}
        </a>
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    }
  }

  return parts;
}

export default function GuideDetail() {
  const { guideId } = useParams();
  const guide = guides.find((g) => g.id === guideId);

  useSeoMeta({
    title: guide ? `${guide.title} - 0xPrivacy.online` : '404 - Guide Not Found',
    description: guide?.description ?? 'The requested guide could not be found.',
  });

  if (!guide) {
    return <NotFound />;
  }

  return (
    <SiteLayout>
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/guides"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#00ff9f]/40 hover:text-[#00ff9f] transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Guides
          </Link>

          {/* Guide header */}
          <div className="mb-8 pb-6 border-b border-[#00ff9f]/10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${
                guide.difficulty === 'beginner'
                  ? 'text-green-400/70 border-green-400/20 bg-green-400/5'
                  : guide.difficulty === 'intermediate'
                    ? 'text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5'
                    : 'text-red-400/70 border-red-400/20 bg-red-400/5'
              }`}>
                {guide.difficulty}
              </span>
              <span className="text-[10px] font-mono text-white/20">{guide.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
              {guide.title}
            </h1>
            <p className="text-sm text-white/40 leading-relaxed mb-4">
              {guide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-white/30 font-mono">
                <Clock className="w-3 h-3" /> {guide.readTime} read
              </span>
              <span className="flex items-center gap-1 text-xs text-white/30 font-mono">
                <BookOpen className="w-3 h-3" /> {guide.category}
              </span>
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-white/20" />
                {guide.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono text-white/20 px-1.5 py-0.5 bg-white/[0.02] rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Guide content */}
          <MarkdownContent content={guide.content} />

          {/* Bottom nav */}
          <div className="mt-12 pt-6 border-t border-[#00ff9f]/10 flex items-center justify-between">
            <Link
              to="/guides"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#00ff9f]/40 hover:text-[#00ff9f] transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> All Guides
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#00ff9f]/40 hover:text-[#00ff9f] transition-colors"
            >
              Tools Hub &rarr;
            </Link>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
