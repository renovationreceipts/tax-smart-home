
import React from "react";

export const FeaturedIn = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container-width px-4">
        <div className="text-center mb-8">
          <h3 className="text-gray-500 font-medium text-lg">As featured in:</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center items-center">
          {/* Placeholder boxes for logos */}
          {[1, 2, 3, 4, 5].map((item) => (
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
