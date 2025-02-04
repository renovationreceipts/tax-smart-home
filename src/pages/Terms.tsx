import TermsHeader from "@/components/terms/TermsHeader";
import TermsSection from "@/components/terms/TermsSection";
import TermsList from "@/components/terms/TermsList";

const Terms = () => {
  return (
    <div className="container-width py-8">
      <TermsHeader />

      <div className="prose prose-gray max-w-none space-y-8 mt-8">
        <div className="space-y-4">
          <p>
            Welcome to PropertyTracker ("Service"). These Terms of Service ("Terms") govern your use of our website and services, including any content, functionality, and services offered on or through our website (the "Site"). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with these Terms, please do not use our Service.
          </p>
        </div>

        <TermsSection title="1. Acceptance of Terms">
          <p>By creating an account or using the Service, you represent that you have read, understand, and agree to be bound by these Terms, including any modifications made from time to time.</p>
        </TermsSection>

        <TermsSection title="2. Changes to the Terms">
          <p>We reserve the right to modify or update these Terms at any time, and such changes will be effective upon posting to the Site. Your continued use of the Service after any changes indicates your acceptance of the new Terms. We encourage you to review these Terms periodically.</p>
        </TermsSection>

        <TermsSection title="3. Description of the Service">
          <p>Our Service provides a platform to help homeowners, property investors, and rental property owners track home improvement expenses and calculate their cost basis for tax purposes. Features include, but are not limited to:</p>
          <TermsList items={[
            "Recording home improvement projects",
            "Uploading receipts, photos, and other supporting documents",
            "Calculating and tracking cost basis for tax reporting",
            "Exporting data for tax forms such as IRS Form 8949",
            "Optional tools for maintenance tracking and personalized recommendations"
          ]} />
        </TermsSection>

        <TermsSection title="4. User Accounts">
          <TermsList items={[
            "Account Creation: To use certain features of our Service, you must create an account and provide accurate and complete information.",
            "Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
            "Eligibility: You must be at least 18 years old and capable of entering into a legally binding agreement to use the Service."
          ]} />
        </TermsSection>

        <TermsSection title="5. User Obligations">
          <p>You agree to use the Service in compliance with all applicable laws and not to:</p>
          <TermsList items={[
            "Violate or infringe the rights of others",
            "Use the Service for any fraudulent or unlawful purpose",
            "Interfere with or disrupt the operation of the Service",
            "Upload or share any content that is illegal, harmful, or otherwise objectionable"
          ]} />
        </TermsSection>

        <TermsSection title="6. Prohibited Conduct">
          <p>You agree not to:</p>
          <TermsList items={[
            "Reverse engineer, decompile, or disassemble any part of the Service",
            "Use automated scripts or other means to access the Service in a manner that violates these Terms",
            "Share your account credentials with third parties"
          ]} />
        </TermsSection>

        <TermsSection title="7. Intellectual Property">
          <TermsList items={[
            "Our Property: All content, features, and functionality of the Service, including text, graphics, logos, images, and software, are owned by PropertyTracker or its licensors and are protected by intellectual property laws.",
            "User Content: You retain ownership of any content you upload or submit. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.",
            "Restrictions: You agree not to reproduce, duplicate, copy, sell, or exploit any portion of the Service without express written permission."
          ]} />
        </TermsSection>

        <TermsSection title="8. Disclaimer of Warranties">
          <p>The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including, but not limited to:</p>
          <TermsList items={[
            "Merchantability",
            "Fitness for a particular purpose",
            "Non-infringement"
          ]} />
          <p>We do not guarantee that the Service will be uninterrupted, error-free, or secure, and we disclaim all liability for any loss or damage arising from your use of the Service.</p>
        </TermsSection>

        <TermsSection title="9. Limitation of Liability">
          <p>In no event shall PropertyTracker, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service. Our total liability, whether in contract, tort, or otherwise, shall not exceed the amount paid by you (if any) for accessing the Service.</p>
        </TermsSection>

        <TermsSection title="10. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless PropertyTracker and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising from your use of the Service or your violation of these Terms.</p>
        </TermsSection>

        <TermsSection title="11. Governing Law and Dispute Resolution">
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or the use of the Service shall be resolved in the courts of the United States, unless otherwise agreed upon in writing.</p>
        </TermsSection>

        <TermsSection title="12. Termination">
          <p>We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.</p>
        </TermsSection>

        <TermsSection title="13. Contact Information">
          <p>If you have any questions or concerns about these Terms, please contact us at:</p>
          <p>support@propertytracker.com</p>
        </TermsSection>
      </div>
    </div>
  );
};

export default Terms;