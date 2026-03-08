// Re-export everything from the original file
export type { BlogPost } from "./blog-data-original";
export { categories } from "./blog-data-original";
import { blogPosts as originalPosts } from "./blog-data-original";
import { extendedBlogPosts } from "./blog-data-extended";

// All 28 posts combined, sorted by date descending
export const blogPosts = [...originalPosts, ...extendedBlogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  if (category === "All") return blogPosts;
  return blogPosts.filter((p) => p.category === category);
}

export function searchBlogPosts(query: string) {
  const q = query.toLowerCase();
  return blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}