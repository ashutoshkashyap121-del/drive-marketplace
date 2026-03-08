"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { blogPosts, categories, searchBlogPosts, getBlogPostsByCategory } from "@/lib/blog-data";

const categoryIcons: Record<string, string> = {
  All: "📚",
  "Licence Guide": "🪪",
  "RTO Tips": "🏛️",
  "Driving Basics": "🚗",
  "Trainer Tips": "👨‍🏫",
  "Traffic Rules": "🚦",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (searchQuery.trim()) return searchBlogPosts(searchQuery);
    return getBlogPostsByCategory(activeCategory);
  }, [activeCategory, searchQuery]);

  const featuredPost = blogPosts[0];

  return (
    <main className="min-h-screen bg-[#f8f6f1]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .blog-font { font-family: 'Playfair Display', Georgia, serif; }
        .body-font { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(10,22,40,0.15); }
        .category-pill { transition: all 0.2s ease; }
        .category-pill:hover { background: #0A1628; color: white; }
        .category-pill.active { background: #0A1628; color: white; }
        .search-input:focus { outline: none; border-color: #0A1628; box-shadow: 0 0 0 3px rgba(10,22,40,0.1); }
        .tag { display: inline-block; padding: 2px 10px; background: #e8e4dc; border-radius: 20px; font-size: 11px; color: #5a4f42; font-family: 'Source Sans 3', sans-serif; font-weight: 500; letter-spacing: 0.3px; }
        .read-more { color: #c2440e; font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; text-decoration: none; }
        .read-more:hover { text-decoration: underline; }
        .divider { border: none; border-top: 1px solid #d8d0c4; }
      `}</style>

      {/* Header */}
      <header style={{ background: '#0A1628', borderBottom: '3px solid #c2440e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="blog-font" style={{ color: 'white', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
                LearnDrive
              </span>
            </Link>
            <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <Link href="/trainers" className="body-font" style={{ color: '#9ab0c8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Find Trainers</Link>
              <Link href="/rto-test" className="body-font" style={{ color: '#9ab0c8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>RTO Test</Link>
              <Link href="/trainers" className="body-font" style={{ background: '#c2440e', color: 'white', fontSize: 13, textDecoration: 'none', fontWeight: 600, padding: '8px 18px', borderRadius: 4 }}>Book a Trainer</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: '#0A1628', padding: '56px 24px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="body-font" style={{ color: '#c2440e', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>
            LearnDrive Knowledge Hub
          </p>
          <h1 className="blog-font" style={{ color: 'white', fontSize: 52, fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1px' }}>
            Drive Better.<br />Know More.
          </h1>
          <p className="body-font" style={{ color: '#8aa5bc', fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>
            Guides, tips, and everything you need to get your driving licence, pass the RTO test, and become a confident driver on Indian roads.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory("All"); }}
              placeholder="Search articles..."
              className="search-input body-font"
              style={{
                width: '100%', padding: '14px 16px 14px 44px', fontSize: 15,
                background: 'white', border: '2px solid transparent', borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            />
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div style={{ height: 4, background: 'linear-gradient(to right, #c2440e, #f97316, #c2440e)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Categories */}
        <div style={{ padding: '32px 0 24px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="body-font" style={{ fontSize: 13, color: '#8a7e72', fontWeight: 600, marginRight: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
              className={`category-pill body-font ${activeCategory === cat && !searchQuery ? "active" : ""}`}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: '1.5px solid #0A1628', cursor: 'pointer',
                background: activeCategory === cat && !searchQuery ? '#0A1628' : 'transparent',
                color: activeCategory === cat && !searchQuery ? 'white' : '#0A1628',
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>

        <hr className="divider" />

        {/* Results count */}
        <p className="body-font" style={{ fontSize: 13, color: '#8a7e72', margin: '20px 0 28px', fontWeight: 500 }}>
          {searchQuery ? `${filteredPosts.length} results for "${searchQuery}"` : `${filteredPosts.length} articles`}
        </p>

        {/* Featured Article (first post, always shown without search) */}
        {!searchQuery && activeCategory === "All" && (
          <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 48 }}>
            <article className="card-hover" style={{
              background: '#0A1628', borderRadius: 8, padding: 40,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
              alignItems: 'center', cursor: 'pointer',
            }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                  <span className="body-font" style={{ background: '#c2440e', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Featured</span>
                  <span className="body-font" style={{ color: '#6b8aa8', fontSize: 12 }}>{featuredPost.category}</span>
                </div>
                <h2 className="blog-font" style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.5px' }}>
                  {featuredPost.title}
                </h2>
                <p className="body-font" style={{ color: '#8aa5bc', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                  {featuredPost.description}
                </p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span className="body-font" style={{ color: '#f97316', fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Read Article →</span>
                  <span className="body-font" style={{ color: '#4a6480', fontSize: 12 }}>⏱ {featuredPost.readTime} min read</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['🪪', '🏛️', '🚗', '🚦'].map((icon, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div className="body-font" style={{ color: '#6b8aa8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {['Licence\nGuide', 'RTO\nTips', 'Driving\nBasics', 'Traffic\nRules'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </Link>
        )}

        {/* Article Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 64 }}>
          {filteredPosts
            .filter((p) => !(activeCategory === "All" && !searchQuery && p.slug === featuredPost.slug))
            .map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="card-hover" style={{
                  background: 'white', borderRadius: 8, padding: 28,
                  border: '1px solid #e0d8ce', height: '100%',
                  display: 'flex', flexDirection: 'column', cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="tag">{categoryIcons[post.category]} {post.category}</span>
                    <span className="body-font" style={{ color: '#b0a495', fontSize: 11 }}>⏱ {post.readTime} min</span>
                  </div>
                  <h2 className="blog-font" style={{ color: '#1a1208', fontSize: 19, fontWeight: 700, lineHeight: 1.3, marginBottom: 12, flex: 1, letterSpacing: '-0.2px' }}>
                    {post.title}
                  </h2>
                  <p className="body-font" style={{ color: '#6b5f52', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                    {post.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f0ebe3' }}>
                    <span className="read-more">Read More →</span>
                    <span className="body-font" style={{ color: '#b0a495', fontSize: 11 }}>
                      {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8a7e72' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p className="blog-font" style={{ fontSize: 22, color: '#3d3228', marginBottom: 8 }}>No articles found</p>
            <p className="body-font" style={{ fontSize: 15 }}>Try a different search term or browse by category</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section style={{ background: '#0A1628', padding: '56px 24px', textAlign: 'center', borderTop: '3px solid #c2440e' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 className="blog-font" style={{ color: 'white', fontSize: 34, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>
            Ready to start driving?
          </h2>
          <p className="body-font" style={{ color: '#8aa5bc', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Practice for the RTO written test for free, then find a certified trainer near you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/rto-test" style={{ background: '#c2440e', color: 'white', padding: '14px 28px', borderRadius: 4, textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Free RTO Test →
            </Link>
            <Link href="/trainers" style={{ background: 'transparent', color: 'white', padding: '14px 28px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Find Trainers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#060e1a', padding: '24px', textAlign: 'center' }}>
        <p className="body-font" style={{ color: '#3d5570', fontSize: 13 }}>
          © 2025 LearnDrive · <Link href="/terms" style={{ color: '#3d5570' }}>Terms</Link> · <Link href="/help" style={{ color: '#3d5570' }}>Help</Link>
        </p>
      </footer>
    </main>
  );
}