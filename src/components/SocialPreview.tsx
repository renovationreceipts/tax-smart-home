
import React from 'react';
import { ArrowRight } from 'lucide-react';

const SocialPreview = () => {
  return (
    <div className="w-[1200px] h-[630px] bg-white flex flex-col justify-center items-center p-16 hero-gradient">
      <div className="w-full flex items-center justify-between mb-12">
        <img 
          src="/lovable-uploads/69bafa75-cbb8-49f9-a552-21142b9fa060.png" 
          alt="RenovationReceipts.com"
          className="h-20 w-auto"
        />
        <div className="flex gap-4">
          <div className="text-gray-600">Login</div>
          <div className="text-white bg-primary px-4 py-2 rounded-md">Sign Up</div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8">
          Track Home Renovations, Maximize Your Cost Basis, Slash Your Tax Bill
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Track all your home improvement expenses to accurately calculate cost basis—ultimately lowering taxable gains when selling.
        </p>
        <div className="flex items-center gap-2 text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-md text-xl">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default SocialPreview;
