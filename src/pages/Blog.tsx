import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";

const blogPosts: BlogPost[] = [
  {
    slug: "track-home-improvement-receipts",
    title: "Should I Track My Home Improvement Receipts? Here's Why It Could Save You Thousands",
    description: "Learn how tracking your home improvement expenses can save you thousands in taxes when you sell your home. Get started with digital receipt tracking today.",
    thumbnail: "/lovable-uploads/de0711d6-5e88-442a-845c-efb3fd3caba4.png",
    date: "March 19, 2024"
  },
  // More blog posts will be added here
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-width py-8 sm:py-12">
        <div className="mb-12">
          <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">
            Expert advice on home improvement tracking, tax savings, and smart property management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
