
import PrivacyHeader from "@/components/privacy/PrivacyHeader";
import PrivacySection from "@/components/privacy/PrivacySection";
import PrivacyList from "@/components/privacy/PrivacyList";

const Privacy = () => {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <PrivacyHeader />
      
      <div className="prose prose-gray max-w-none space-y-8">
        <p>
          Renovation Receipts ("we," "us," or "our") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you use our website and services, including Renovation Receipts (the "Service"). 
          By accessing or using the Service, you consent to the data practices described in this Privacy Policy.
        </p>

        <PrivacySection title="1. Information We Collect">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">A. Personal Information</h3>
              <p>When you register for an account or use our Service, we may collect personally identifiable information ("Personal Information") such as:</p>
              <PrivacyList items={[
                "Name",
                "Email address",
                "Mailing address (if provided)",
                "Phone number (if provided)",
                "Payment information (if applicable)"
              ]} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">B. Property and Project Data</h3>
              <p>Our Service is designed to help you track home improvement projects and calculate your cost basis. We may collect information related to:</p>
              <PrivacyList items={[
                "Property details (e.g., address, property type, purchase price)",
                "Project details (e.g., project name, start and end dates, builder information, project cost)",
                "Uploaded documents (e.g., receipts, before and after photos, PDF receipts)"
              ]} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">C. Usage Data</h3>
              <p>We automatically collect certain information about your use of the Service, including:</p>
              <PrivacyList items={[
                "IP address",
                "Browser type and version",
                "Device information",
                "Pages visited and actions taken within the Service",
                "Timestamps and usage patterns"
              ]} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">D. Cookies and Similar Technologies</h3>
              <p>
                We may use cookies and similar tracking technologies to enhance your experience, 
                analyze usage trends, and improve our Service. You can adjust your browser settings 
                to refuse cookies, but some features of the Service may not function properly as a result.
              </p>
            </div>
          </div>
        </PrivacySection>

        <PrivacySection title="2. How We Use Your Information">
          <p>We use the collected information for various purposes, including:</p>
          <PrivacyList items={[
            "Providing and Maintaining the Service: To create and manage your account, track home improvement projects, calculate cost basis, and generate tax reports.",
            "Improving the Service: To analyze usage trends and improve the functionality, security, and user experience of the Service.",
            "Communication: To send you service-related updates, promotional information (if you have opted in), and respond to your inquiries.",
            "Legal and Compliance: To comply with legal obligations, resolve disputes, and enforce our terms."
          ]} />
        </PrivacySection>

        <PrivacySection title="3. How We Share Your Information">
          <p>We do not sell your Personal Information to third parties. We may share your information as follows:</p>
          <PrivacyList items={[
            "Service Providers: With third-party vendors who perform services on our behalf (e.g., hosting, payment processing, analytics). These vendors are obligated to protect your information.",
            "Legal Requirements: If required by law, regulation, or legal process, we may disclose your information to government authorities or other entities.",
            "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner, provided that the new owner agrees to handle your data in accordance with this Privacy Policy.",
            "With Your Consent: We may share your information with your consent or at your direction."
          ]} />
        </PrivacySection>

        <PrivacySection title="4. Data Retention">
          <p>
            We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
            unless a longer retention period is required or permitted by law. When your information is no longer needed, 
            we will securely delete or anonymize it.
          </p>
        </PrivacySection>

        <PrivacySection title="5. Data Security">
          <p>
            We implement appropriate technical and organizational measures to protect your Personal Information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
            internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </PrivacySection>

        <PrivacySection title="6. Your Rights and Choices">
          <p>Depending on your jurisdiction, you may have rights regarding your Personal Information, including:</p>
          <PrivacyList items={[
            "Access and Correction: The right to access, update, or correct your Personal Information.",
            "Deletion: The right to request the deletion of your Personal Information.",
            "Objection and Restriction: The right to object to or restrict the processing of your Personal Information.",
            "Data Portability: The right to request a copy of your Personal Information in a structured, commonly used format."
          ]} />
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
        </PrivacySection>

        <PrivacySection title="7. Third-Party Links and Services">
          <p>
            Our Service may contain links to third-party websites or services that are not operated or controlled by us. 
            This Privacy Policy does not apply to the practices of those third parties. We encourage you to review the 
            privacy policies of any third-party websites you visit.
          </p>
        </PrivacySection>

        <PrivacySection title="8. International Data Transfers">
          <p>
            Your information may be transferred to, and maintained on, servers located outside of your country. 
            By using our Service, you consent to the transfer of your information to countries that may have 
            different data protection laws than your country.
          </p>
        </PrivacySection>

        <PrivacySection title="9. Children's Privacy">
          <p>
            Our Service is not intended for individuals under the age of 18. We do not knowingly collect Personal 
            Information from children. If you believe we have inadvertently collected such information, please 
            contact us immediately.
          </p>
        </PrivacySection>

        <PrivacySection title="10. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the updated Privacy Policy on our website and updating the "Last Updated" date. Your continued use 
            of the Service after such changes constitutes your acceptance of the revised Privacy Policy.
          </p>
        </PrivacySection>

        <PrivacySection title="11. Contact Us">
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          <div className="mt-4">
            <p>[Your Company Name]</p>
            <p>Email: [Your Contact Email]</p>
            <p>Address: [Your Company Address]</p>
          </div>
        </PrivacySection>
      </div>
    </div>
  );
};

export default Privacy;
