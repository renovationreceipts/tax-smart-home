
import React from "react";

export const FeaturedIn = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container-width px-4">
        <div className="text-center mb-8">
          <h3 className="text-gray-500 font-medium text-lg">As featured in:</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center items-center">
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
          
          {/* Remaining placeholder boxes for logos */}
          {[4, 5].map((item) => (
            <div 
              key={item}
              className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-400"
              aria-label="Logo placeholder"
            >
              Logo {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
