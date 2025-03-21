
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollToTop = useScrollToTop();

  return (
    <footer className="bg-white border-t">
      <div className="container-width py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-6 space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <img 
                src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
                alt="RenovationReceipts.com"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Helping property owners track renovation costs and tax records efficiently.
            </p>
          </div>

          {/* Company Links */}
          <div className="md:col-span-3 text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={scrollToTop}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={scrollToTop}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3 text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={scrollToTop}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={scrollToTop}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/disclaimers" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={scrollToTop}
                >
                  Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t">
        <div className="container-width py-6">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} RenovationReceipts.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
