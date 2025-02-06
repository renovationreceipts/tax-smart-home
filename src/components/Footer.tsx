import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container-width py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">CompanyName</span>
            </div>
            <p className="text-gray-600">
              Helping property owners track renovation costs and tax records efficiently.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/disclaimers" className="text-gray-600 hover:text-gray-900">Disclaimers</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t">
        <div className="container-width py-6">
          <p className="text-center text-gray-600">
            © {currentYear} CompanyName. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;