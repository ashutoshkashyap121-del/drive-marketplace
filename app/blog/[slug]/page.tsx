import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | LearnDrive Blog`,
    description: post.description,
    alternates: {
      canonical: `https://learndrive.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `https://learndrive.in/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Driving Basics": "bg-blue-100 text-blue-700",
  "RTO Tips": "bg-orange-100 text-orange-700",
  "Licence Guide": "bg-green-100 text-green-700",
  "Trainer Tips": "bg-purple-100 text-purple-700",
  "Traffic Rules": "bg-red-100 text-red-700",
};

function renderMarkdown(content: string): string {
  return content
    .trim()
    .replace(/^\|(.+)\|$/gm, (line) => {
      const isHeader = line.includes('---|');
      if (isHeader) return '';
      const cells = line.split('|').filter((c) => c.trim());
      return cells.map((c) => `<td style="padding:10px 16px;border:1px solid #e0d8ce;font-size:14px;">${c.trim()}</td>`).join('');
    })
    .replace(/((<td[^>]*>.*<\/td>)+)/g, '<tr>$1</tr>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (block) => `<ul class="md-ul">${block}</ul>`)
    .replace(/^(?!<[hul]|<li|<tr|<td|<strong|\s*$)(.+)$/gm, '<p class="md-p">$1</p>')
    .replace(/---/g, '<hr class="md-hr" />');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== slug)
    .slice(0, 3);

  const htmlContent = renderMarkdown(post.content);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .md-h2 { font-size:1.4rem;font-weight:800;color:#1a2540;margin:2rem 0 0.75rem; }
        .md-h3 { font-size:1.15rem;font-weight:700;color:#1a2540;margin:1.5rem 0 0.5rem; }
        .md-p  { color:#374151;line-height:1.8;margin-bottom:1rem;font-size:1rem; }
        .md-ul { padding-left:1.5rem;margin-bottom:1rem; }
        .md-ul li { color:#374151;line-height:1.8;margin-bottom:0.25rem; }
        .md-link { color:#2563eb;text-decoration:underline; }
        .md-hr { border:none;border-top:1px solid #e5e7eb;margin:2rem 0; }
        table { width:100%;border-collapse:collapse;margin-bottom:1.5rem; }
        tr:nth-child(even) td { background:#fafaf8; }
      `}</style>

      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span>›</span>
            <span className="text-gray-800 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">{post.readTime} min read</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-600 text-base leading-relaxed mb-5">{post.description}</p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }} />

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to start learning to drive?</h3>
          <p className="text-gray-600 text-sm mb-4">Find certified driving instructors near you. Trial class from ₹299.</p>
          <Link href="/trainers" className="inline-block bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-amber-500 transition-colors">
            Find Trainers Near Me →
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)" }}>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>🆕 NEW SERVICE</div>
              <h3 className="font-bold text-white text-lg mb-1">Get Your Driving Licence Without the RTO Confusion</h3>
              <p className="text-sm" style={{ color: "#94a3b8" }}>AI fills your form, books your RTO slot, sends document checklist & reminders. Just ₹499.</p>
            </div>
            <Link href="/dl-assistance" style={{ background: "#f59e0b", color: "#1a2540", padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
              Get Started →
            </Link>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all h-full">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[related.category] || "bg-gray-100 text-gray-600"}`}>
                      {related.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 text-sm mt-2 leading-snug">{related.title}</h4>
                    <p className="text-gray-400 text-xs mt-2">{related.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/blog" className="text-blue-600 font-medium hover:text-blue-700">← Back to all articles</Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: "LearnDrive", url: "https://learndrive.in" },
          datePublished: post.date,
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://learndrive.in/blog/${post.slug}` },
        }),
      }} />
    </div>
  );
}