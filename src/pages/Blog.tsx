
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";

const blogPosts: BlogPost[] = [{
  slug: "eliminate-pmi-sooner",
  title: "How Home Improvements Can Help You Eliminate PMI Sooner",
  description: "Save money by increasing your home's value and lowering your loan-to-value ratio (LTV). Learn how smart home improvements can help remove PMI years earlier.",
  thumbnail: "/lovable-uploads/902eef2d-5840-4c0b-8638-e5093ed3aae0.png",
  date: "March 1, 2025"
}, {
  slug: "track-home-improvement-receipts",
  title: "Should I Track My Home Improvement Receipts? Here's Why It Could Save You Thousands",
  description: "Learn how tracking your home improvement expenses can save you thousands in taxes when you sell your home. Get started with digital receipt tracking today.",
  thumbnail: "/lovable-uploads/de0711d6-5e88-442a-845c-efb3fd3caba4.png",
  date: "February 8, 2025"
}, {
  slug: "homeowners-guide-tax-savings",
  title: "The Homeowner's Guide to Tax Savings: Tracking Renovations the Smart Way",
  description: "A comprehensive guide to maximizing your tax benefits through strategic renovation tracking and documentation. Learn what qualifies and how to track effectively.",
  thumbnail: "/lovable-uploads/b7991edb-8f33-4954-870d-418db6c5c3d7.png",
  date: "February 8, 2025"
}, {
  slug: "capital-gains-101",
  title: "Capital Gains 101: How to Reduce Your Taxable Gain When Selling Your Home",
  description: "Understanding capital gains tax on your home sale and legal strategies to minimize your tax burden through proper improvement tracking and documentation.",
  thumbnail: "/lovable-uploads/6509f569-6024-48bb-b69e-73a69de6f023.png",
  date: "February 8, 2025"
}];

const Blog = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div className="min-h-screen bg-white">
      <div className="container-width py-8 sm:py-12 bg-white px-[15px]">
        <div className="mb-12">
          <Link 
            to={isAuthenticated ? "/account" : "/"} 
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">
            Expert advice on home improvement tracking, tax savings, and smart property management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => <BlogCard key={post.slug} post={post} />)}
        </div>
      </div>
    </div>;
};

export default Blog;
