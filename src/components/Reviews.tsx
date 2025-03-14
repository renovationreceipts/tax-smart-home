
import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Reviews = () => {
  const reviews = [
    {
      rating: 5,
      text: "Tracking home receipts was a nightmare before I found this app. Thank you Renovation Receipts!",
      author: "Sarah Johnson",
      role: "Homeowner"
    },
    {
      rating: 5,
      text: "Managing multiple rental properties was a nightmare before. Now I can track everything in one place.",
      author: "Michael Chen",
      role: "Property Investor"
    },
    {
      rating: 5,
      text: "This app found me over $10,000 in tax credits I would have missed out on. Thank you!",
      author: "Emily Rodriguez",
      role: "Homeowner"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="border rounded-lg shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.author}</h4>
                  <p className="text-gray-500 text-sm">{review.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
