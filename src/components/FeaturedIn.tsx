
import React from "react";

export const FeaturedIn = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container-width px-4">
        <div className="text-center mb-8">
          <h3 className="text-gray-500 font-medium text-lg">As featured in:</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center items-center">
          {/* Real logos */}
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/40fe9562-14e0-4d60-8008-efe46604e833.png" 
              alt="Kiplinger Personal Finance" 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b39c9234-6cff-4434-a4e4-cdcb6fb50f34.png" 
              alt="ABC News" 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d2799b6b-465e-4dab-bec0-5e4b48941fc2.png" 
              alt="CNBC" 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/9df26525-c31e-4307-af49-751e5bbe0729.png" 
              alt="HGTV" 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/eeb4b39f-b3af-4631-a42f-8162cb0248d2.png" 
              alt="REALTOR" 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/f64cec28-b481-4ab7-9bac-265f6c1819aa.png" 
              alt="Better Homes and Gardens" 
              className="max-h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
