// app/blog/[slug]/page.tsx
// Renders individual blog post from DB

import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://learndrive.in";

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${baseUrl}/api/blog/posts?slug=${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string): Promise<Post[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/blog/posts?category=${encodeURIComponent(category)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const posts: Post[] = await res.json();
    return posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | LearnDrive" };

  return {
    title: `${post.title} | LearnDrive`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
  };
}

// Convert markdown to HTML (simple, no external deps)
function markdownToHtml(md: string): string {
  return md
    // Tables
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n)*)/g, (_, header, rows) => {
      const ths = header.split("|").filter(Boolean).map((h: string) => `<th>${h.trim()}</th>`).join("");
      const trs = rows.trim().split("\n").map((row: string) =>
        `<tr>${row.split("|").filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join("")}</tr>`
      ).join("");
      return `<div class="overflow-x-auto my-6"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
    })
    // H1-H3
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold / italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered lists
    .replace(/(^- .+$\n?)+/gm, (block) => {
      const items = block.trim().split("\n").map((l) => `<li>${l.replace(/^- /, "")}</li>`).join("");
      return `<ul>${items}</ul>`;
    })
    // Ordered lists
    .replace(/(^\d+\. .+$\n?)+/gm, (block) => {
      const items = block.trim().split("\n").map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("");
      return `<ol>${items}</ol>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs
    .replace(/\n\n([^<])/g, "\n\n<p>$1")
    .replace(/([^>])\n\n/g, "$1</p>\n\n")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const CATEGORY_COLORS: Record<string, string> = {
  "Driving Basics": "bg-blue-100 text-blue-700",
  "RTO Tips": "bg-orange-100 text-orange-700",
  "Licence Guide": "bg-green-100 text-green-700",
  "Trainer Tips": "bg-purple-100 text-purple-700",
  "Traffic Rules": "bg-red-100 text-red-700",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) notFound();

  const relatedPosts = await getRelatedPosts(post.category, slug);
  const htmlContent = markdownToHtml(post.content);

  const tags: string[] = (() => {
    try { return JSON.parse(post.tags); } catch { return []; }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
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
        {/* Article header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">{post.readTime} min read</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-4">{post.description}</p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>By {post.author}</span>
            <span>·</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {post.updatedAt !== post.createdAt && (
              <>
                <span>·</span>
                <span>Updated {new Date(post.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </>
            )}
          </div>
        </header>

        {/* Article content */}
        <article
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            lineHeight: "1.8",
          }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA box */}
        <div className="mt-10 bg-gradient-to-r from-[#1a2540] to-blue-700 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">Ready to Start Driving?</h3>
          <p className="text-blue-200 text-sm mb-4">
            Find a certified driving trainer near you and book your first lesson today.
          </p>
          <Link
            href="/trainers"
            className="inline-block bg-white text-[#1a2540] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Find Trainers Near Me →
          </Link>
        </div>

        {/* DL Assistance CTA */}
        <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)" }}>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>🆕 NEW SERVICE</div>
              <h3 className="font-bold text-white text-lg mb-1">Get Your Driving Licence Without the RTO Confusion</h3>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                AI fills your form, books your RTO slot, sends document checklist & reminders. Just ₹499.
              </p>
            </div>
            <Link
              href="/dl-assistance"
              className="whitespace-nowrap flex-shrink-0"
              style={{ background: "#f59e0b", color: "#1a2540", padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}
            >
              Get Started →
            </Link>
          </div>
        </div>
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-100 transition-all h-full">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[related.category] || "bg-gray-100 text-gray-600"}`}>
                      {related.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 text-sm mt-2 leading-snug">
                      {related.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-2">{related.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/blog" className="text-blue-600 font-medium hover:text-blue-700">
            ← Back to all articles
          </Link>
        </div>
      </div>

      {/* Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "LearnDrive",
              url: baseUrl,
            },
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
          }),
        }}
      />
    </div>
  );
}