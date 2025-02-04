import React from 'react';

const Disclaimers = () => {
  return (
    <div className="container-width py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">No Tax or Legal Advice</h2>
          <p className="text-gray-600 leading-relaxed">
            The information provided here is for general informational purposes only and does not constitute tax, legal, or other professional advice. While efforts are made to ensure the accuracy of the information, it may not be applicable to your specific situation and should not be used as a substitute for consultation with a qualified tax attorney or other appropriate professional.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Consult a Qualified Professional</h2>
          <p className="text-gray-600 leading-relaxed">
            You should always seek the advice of a licensed attorney or certified tax professional regarding questions or concerns about your individual circumstances. Reliance on any information presented here is solely at your own risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">No Attorney-Client Relationship</h2>
          <p className="text-gray-600 leading-relaxed">
            Viewing or using the information contained in these materials does not create an attorney-client relationship. Do not act or refrain from acting on the basis of any information provided here without first seeking legal counsel in the relevant jurisdiction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">No Warranties or Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            All information is provided "as is," with no warranties, express or implied, including but not limited to warranties of accuracy, completeness, or fitness for a particular purpose. To the fullest extent permitted by law, the author(s) and publisher(s) disclaim any liability for damages of any kind arising from the use of or reliance on this information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Jurisdiction</h2>
          <p className="text-gray-600 leading-relaxed">
            Laws and regulations vary by jurisdiction and may change over time. Any references to laws and regulations are specific to a given jurisdiction and may not apply to all users. It is your responsibility to ensure compliance with applicable laws in your location.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Disclaimers;