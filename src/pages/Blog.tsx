
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-width py-8 sm:py-12">
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">
            Latest insights and updates from RenovationReceipts.com
          </p>
        </div>

        {/* Blog post placeholder - to be updated with actual content */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-500 mb-2">Please provide the blog content</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
