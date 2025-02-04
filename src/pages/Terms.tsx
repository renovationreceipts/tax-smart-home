import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container-width py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="prose prose-gray max-w-none space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: {currentDate}</p>
        </div>

        <div className="space-y-4">
          <p>Welcome to PropertyTracker ("Service"). These Terms of Service ("Terms") govern your use of our website and services, including any content, functionality, and services offered on or through our website (the "Site"). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with these Terms, please do not use our Service.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>By creating an account or using the Service, you represent that you have read, understand, and agree to be bound by these Terms, including any modifications made from time to time.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Changes to the Terms</h2>
          <p>We reserve the right to modify or update these Terms at any time, and such changes will be effective upon posting to the Site. Your continued use of the Service after any changes indicates your acceptance of the new Terms. We encourage you to review these Terms periodically.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Description of the Service</h2>
          <p>Our Service provides a platform to help homeowners, property investors, and rental property owners track home improvement expenses and calculate their cost basis for tax purposes. Features include, but are not limited to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Recording home improvement projects</li>
            <li>Uploading receipts, photos, and other supporting documents</li>
            <li>Calculating and tracking cost basis for tax reporting</li>
            <li>Exporting data for tax forms such as IRS Form 8949</li>
            <li>Optional tools for maintenance tracking and personalized recommendations</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">4. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account Creation: To use certain features of our Service, you must create an account and provide accurate and complete information.</li>
            <li>Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>Eligibility: You must be at least 18 years old and capable of entering into a legally binding agreement to use the Service.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">5. User Obligations</h2>
          <p>You agree to use the Service in compliance with all applicable laws and not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate or infringe the rights of others</li>
            <li>Use the Service for any fraudulent or unlawful purpose</li>
            <li>Interfere with or disrupt the operation of the Service</li>
            <li>Upload or share any content that is illegal, harmful, or otherwise objectionable</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use automated scripts or other means to access the Service in a manner that violates these Terms</li>
            <li>Share your account credentials with third parties</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Our Property: All content, features, and functionality of the Service, including text, graphics, logos, images, and software, are owned by PropertyTracker or its licensors and are protected by intellectual property laws.</li>
            <li>User Content: You retain ownership of any content you upload or submit. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.</li>
            <li>Restrictions: You agree not to reproduce, duplicate, copy, sell, or exploit any portion of the Service without express written permission.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Disclaimer of Warranties</h2>
          <p>The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including, but not limited to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
          </ul>
          <p>We do not guarantee that the Service will be uninterrupted, error-free, or secure, and we disclaim all liability for any loss or damage arising from your use of the Service.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
          <p>In no event shall PropertyTracker, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service. Our total liability, whether in contract, tort, or otherwise, shall not exceed the amount paid by you (if any) for accessing the Service.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless PropertyTracker and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising from your use of the Service or your violation of these Terms.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Governing Law and Dispute Resolution</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or the use of the Service shall be resolved in the courts of the United States, unless otherwise agreed upon in writing.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Contact Information</h2>
          <p>If you have any questions or concerns about these Terms, please contact us at:</p>
          <p>support@propertytracker.com</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;