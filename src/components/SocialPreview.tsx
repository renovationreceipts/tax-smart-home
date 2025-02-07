
import React from 'react';

const SocialPreview = () => {
  return (
    <div className="w-[1200px] h-[630px] bg-white flex flex-col justify-center items-center p-16">
      <h1 className="text-6xl font-bold text-gray-900 mb-8">Renovation Receipts</h1>
      <p className="text-3xl text-gray-600 text-center max-w-3xl">
        Track Home Improvement Expenses and Maximize Tax Savings
      </p>
      <div className="mt-12 flex gap-8">
        <div className="bg-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Track Receipts</h3>
          <p className="text-gray-600">Organize all your renovation expenses</p>
        </div>
        <div className="bg-green-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Calculate Taxes</h3>
          <p className="text-gray-600">Maximize your tax deductions</p>
        </div>
        <div className="bg-purple-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Store Documents</h3>
          <p className="text-gray-600">Keep all records in one place</p>
        </div>
      </div>
    </div>
  );
};

export default SocialPreview;
