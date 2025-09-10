import { Star, User, Clock } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely amazing experience! The food was outstanding, especially the lobster thermidor. The service was impeccable and the atmosphere was perfect for our anniversary dinner. Will definitely be coming back!',
    dish: 'Lobster Thermidor'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    date: '2024-01-12',
    comment: 'Best Italian food in the city! The spaghetti carbonara was authentic and delicious. The staff was knowledgeable about the menu and wine pairings. Highly recommended for anyone who appreciates fine dining.',
    dish: 'Spaghetti Carbonara'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great food and lovely ambiance. The ribeye steak was cooked to perfection. Only minor complaint is that it took a bit long to get seated, but the quality of food made up for it. The dessert was heavenly!',
    dish: 'Ribeye Steak'
  },
  {
    id: 4,
    name: 'David Thompson',
    rating: 5,
    date: '2024-01-08',
    comment: 'Exceptional dining experience from start to finish. The QR code ordering system was convenient and the food arrived quickly. The grilled salmon was fresh and flavorful. Perfect for business dinners.',
    dish: 'Grilled Salmon'
  },
  {
    id: 5,
    name: 'Lisa Williams',
    rating: 5,
    date: '2024-01-05',
    comment: 'The chef\'s tasting menu was an incredible journey of flavors. Each course was beautifully presented and delicious. The wine selection was excellent. This is a must-visit restaurant for special occasions.',
    dish: 'Chef\'s Tasting Menu'
  },
  {
    id: 6,
    name: 'Robert Martinez',
    rating: 4,
    date: '2024-01-03',
    comment: 'Solid choice for a family dinner. The kids loved the chicken parmesan and we enjoyed the extensive wine list. The service was friendly and accommodating. Good value for money considering the quality.',
    dish: 'Chicken Parmesan'
  },
  {
    id: 7,
    name: 'Jennifer Davis',
    rating: 5,
    date: '2024-01-01',
    comment: 'Started the new year right with an amazing meal here! The tiramisu was the best I\'ve ever had. The atmosphere was cozy and romantic. Thank you for making our New Year\'s Eve special!',
    dish: 'Tiramisu'
  },
  {
    id: 8,
    name: 'Kevin Brown',
    rating: 4,
    date: '2023-12-28',
    comment: 'Great restaurant with excellent food quality. The antipasto platter was generous and tasty. The reservation system worked smoothly. Will be back to try more dishes from their extensive menu.',
    dish: 'Antipasto Platter'
  }
];

const overallStats = {
  averageRating: 4.8,
  totalReviews: 247,
  ratingDistribution: {
    5: 78,
    4: 18,
    3: 3,
    2: 1,
    1: 0
  }
};

function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            See what our customers are saying about their dining experiences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overall Rating Stats */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">{overallStats.averageRating}</div>
              <StarRating rating={Math.round(overallStats.averageRating)} className="justify-center mb-2" />
              <p className="text-gray-600">Based on {overallStats.totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = overallStats.ratingDistribution[rating as keyof typeof overallStats.ratingDistribution];
                  const percentage = (count / 100) * 100;
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm">{rating}</span>
                        <Star size={14} className="text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-10">{count}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                  <User size={24} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  
                  <div className="inline-block bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full">
                    Tried: {review.dish}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Had a Great Experience?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;d love to hear about your visit! Your feedback helps us improve and lets other food lovers know what to expect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
            >
              Leave a Review
            </a>
            <a
              href="/reservations"
              className="border border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors inline-block"
            >
              Make a Reservation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
