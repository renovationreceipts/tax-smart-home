
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container-width py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
                alt="RenovationReceipts.com"
                className="h-16 w-auto"
              />
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
            © {currentYear} RenovationReceipts.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
