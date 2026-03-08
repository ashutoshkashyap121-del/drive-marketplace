import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | LearnDrive Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

// Simple markdown-to-HTML renderer
function renderMarkdown(content: string): string {
  return content
    .trim()
    // Tables
    .replace(/^\|(.+)\|$/gm, (line) => {
      const isHeader = line.includes('---|');
      if (isHeader) return '';
      const cells = line.split('|').filter((c) => c.trim());
      return cells.map((c) => `<td style="padding:10px 16px;border:1px solid #e0d8ce;font-size:14px;">${c.trim()}</td>`).join('');
    })
    // Wrap table rows
    .replace(/((<td[^>]*>.*<\/td>)+)/g, '<tr>$1</tr>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    // H4
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="md-hr" />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
    .replace(/(<li class="md-oli"[^>]*>.*<\/li>\n?)+/g, '<ol class="md-ol">$&</ol>')
    // Checkboxes
    .replace(/^- \[ \] (.+)$/gm, '<li class="md-check"><span class="check-box">□</span> $1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="md-check checked"><span class="check-box">✓</span> $1</li>')
    // Paragraphs (lines not starting with HTML tags)
    .replace(/^(?!<[a-zA-Z\/])(.+)$/gm, '<p class="md-p">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="md-p"><\/p>/g, '')
    // Wrap table content
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, '<div class="md-table-wrap"><table class="md-table">$&</table></div>');
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const renderedContent = renderMarkdown(post.content);

  return (
    <main style={{ minHeight: '100vh', background: '#f8f6f1', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .blog-font { font-family: 'Playfair Display', Georgia, serif; }
        .body-font { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .md-h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 800; color: #1a1208; margin: 40px 0 14px; letter-spacing: -0.3px; line-height: 1.2; border-bottom: 2px solid #e8e0d4; padding-bottom: 10px; }
        .md-h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #2d2318; margin: 28px 0 10px; letter-spacing: -0.2px; }
        .md-h4 { font-family: 'Source Sans 3', sans-serif; font-size: 16px; font-weight: 700; color: #2d2318; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .md-p { font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.8; color: #3d3228; margin: 0 0 16px; }
        .md-ul, .md-ol { margin: 8px 0 20px 0; padding-left: 0; list-style: none; }
        .md-li { font-family: 'Source Sans 3', sans-serif; font-size: 15px; color: #3d3228; line-height: 1.7; margin-bottom: 6px; padding-left: 20px; position: relative; }
        .md-li::before { content: '•'; color: #c2440e; position: absolute; left: 6px; font-weight: 900; }
        .md-oli { font-family: 'Source Sans 3', sans-serif; font-size: 15px; color: #3d3228; line-height: 1.7; margin-bottom: 8px; padding-left: 8px; }
        .md-check { font-family: 'Source Sans 3', sans-serif; font-size: 14px; color: #3d3228; line-height: 1.7; margin-bottom: 6px; list-style: none; padding: 4px 8px; }
        .md-check.checked { color: #2d7a3a; text-decoration: line-through; opacity: 0.7; }
        .check-box { margin-right: 8px; font-weight: 700; }
        .md-hr { border: none; border-top: 2px solid #e0d8ce; margin: 36px 0; }
        .md-link { color: #c2440e; text-decoration: underline; font-weight: 600; }
        .md-link:hover { color: #9a3209; }
        .md-table-wrap { overflow-x: auto; margin: 16px 0 28px; border-radius: 6px; border: 1px solid #e0d8ce; }
        .md-table { width: 100%; border-collapse: collapse; }
        .md-table tr:first-child td { background: #0A1628; color: white; font-weight: 700; font-family: 'Source Sans 3', sans-serif; font-size: 13px; letter-spacing: 0.3px; }
        .md-table tr:nth-child(even) td { background: #f5f0e8; }
        strong { font-weight: 700; color: #1a1208; }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(10,22,40,0.12); }
        .breadcrumb { font-family: 'Source Sans 3', sans-serif; font-size: 13px; }
        .breadcrumb a { color: #8aa5bc; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
      `}</style>

      {/* Header */}
      <header style={{ background: '#0A1628', borderBottom: '3px solid #c2440e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="blog-font" style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>LearnDrive</span>
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/blog" className="body-font" style={{ color: '#9ab0c8', fontSize: 14, textDecoration: 'none' }}>Blog</Link>
            <Link href="/rto-test" className="body-font" style={{ color: '#9ab0c8', fontSize: 14, textDecoration: 'none' }}>RTO Test</Link>
            <Link href="/trainers" className="body-font" style={{ background: '#c2440e', color: 'white', fontSize: 13, textDecoration: 'none', fontWeight: 600, padding: '8px 18px', borderRadius: 4 }}>Book Trainer</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article>
        {/* Article Header */}
        <div style={{ background: '#0A1628', padding: '48px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div className="breadcrumb" style={{ marginBottom: 20 }}>
              <Link href="/">Home</Link>
              <span style={{ color: '#4a6480', margin: '0 8px' }}>›</span>
              <Link href="/blog">Blog</Link>
              <span style={{ color: '#4a6480', margin: '0 8px' }}>›</span>
              <span style={{ color: '#6b8aa8' }}>{post.category}</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span className="body-font" style={{ background: '#c2440e', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {post.category}
              </span>
            </div>

            <h1 className="blog-font" style={{ color: 'white', fontSize: 42, fontWeight: 900, lineHeight: 1.15, marginBottom: 18, letterSpacing: '-1px' }}>
              {post.title}
            </h1>
            <p className="body-font" style={{ color: '#8aa5bc', fontSize: 17, lineHeight: 1.6, marginBottom: 24 }}>
              {post.description}
            </p>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="body-font" style={{ color: '#6b8aa8', fontSize: 13 }}>
                ✍️ {post.author}
              </span>
              <span style={{ color: '#2d4a62', fontSize: 12 }}>•</span>
              <span className="body-font" style={{ color: '#6b8aa8', fontSize: 13 }}>
                📅 {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span style={{ color: '#2d4a62', fontSize: 12 }}>•</span>
              <span className="body-font" style={{ color: '#6b8aa8', fontSize: 13 }}>
                ⏱ {post.readTime} min read
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: 4, background: 'linear-gradient(to right, #c2440e, #f97316, #c2440e)' }} />

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
          <div dangerouslySetInnerHTML={{ __html: renderedContent }} />

          {/* Tags */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e0d8ce' }}>
            <span className="body-font" style={{ fontSize: 12, color: '#8a7e72', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginRight: 10 }}>Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} style={{ display: 'inline-block', margin: '4px', padding: '4px 12px', background: '#f0ebe3', borderRadius: 20, fontSize: 12, color: '#5a4f42', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* CTA Banner */}
      <section style={{ background: '#0A1628', padding: '40px 24px', margin: '0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <h3 className="blog-font" style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              Practice for the RTO Written Test — Free
            </h3>
            <p className="body-font" style={{ color: '#8aa5bc', fontSize: 14 }}>
              200+ questions covering traffic signs, road rules, speed limits, and more.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/rto-test" style={{ background: '#c2440e', color: 'white', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", whiteSpace: 'nowrap' }}>
              Take Free Test →
            </Link>
            <Link href="/trainers" style={{ background: 'transparent', color: 'white', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", border: '1.5px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
              Find Trainer
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 64px' }}>
          <h2 className="blog-font" style={{ fontSize: 26, fontWeight: 800, color: '#1a1208', marginBottom: 28, letterSpacing: '-0.3px' }}>
            Related Articles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                <article className="card-hover" style={{ background: 'white', borderRadius: 8, padding: 24, border: '1px solid #e0d8ce', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', background: '#e8e4dc', borderRadius: 20, fontSize: 11, color: '#5a4f42', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginBottom: 12 }}>
                    {related.category}
                  </span>
                  <h3 className="blog-font" style={{ fontSize: 17, fontWeight: 700, color: '#1a1208', lineHeight: 1.3, marginBottom: 10, flex: 1 }}>
                    {related.title}
                  </h3>
                  <span style={{ color: '#c2440e', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Read →
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer style={{ background: '#060e1a', padding: '24px', textAlign: 'center' }}>
        <p className="body-font" style={{ color: '#3d5570', fontSize: 13 }}>
          © 2025 LearnDrive · <Link href="/terms" style={{ color: '#3d5570' }}>Terms</Link> · <Link href="/help" style={{ color: '#3d5570' }}>Help</Link>
        </p>
      </footer>
    </main>
  );
}