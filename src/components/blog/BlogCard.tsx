
import { Link } from "react-router-dom";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-6">
          <time className="text-sm text-gray-500 mb-2 block">{post.date}</time>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 line-clamp-2">
            {post.description}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
