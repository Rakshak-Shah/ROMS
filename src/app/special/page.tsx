import Link from 'next/link';
import { Clock, Star, Gift } from 'lucide-react';

const specialOffers = [
  {
    id: 1,
    title: 'Happy Hour Special',
    description: '50% off on all appetizers and drinks',
    validTime: 'Monday - Friday, 3:00 PM - 6:00 PM',
    discount: '50% OFF',
    type: 'time-based',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Date Night Package',
    description: 'Three-course meal for two with complimentary wine',
    validTime: 'Available every evening',
    discount: '$89.99',
    type: 'package',
    color: 'bg-pink-500'
  },
  {
    id: 3,
    title: 'Weekend Brunch',
    description: 'Unlimited brunch buffet with bottomless mimosas',
    validTime: 'Saturday - Sunday, 10:00 AM - 2:00 PM',
    discount: '$35/person',
    type: 'weekend',
    color: 'bg-orange-500'
  },
  {
    id: 4,
    title: 'Family Feast',
    description: 'Special family menu for 4+ people with kids eat free',
    validTime: 'Available daily',
    discount: 'Kids Free',
    type: 'family',
    color: 'bg-green-500'
  },
  {
    id: 5,
    title: 'Birthday Special',
    description: 'Free dessert and special celebration for birthday guests',
    validTime: 'Valid with ID on birthday',
    discount: 'Free Dessert',
    type: 'birthday',
    color: 'bg-purple-500'
  },
  {
    id: 6,
    title: 'Chef&apos;s Tasting Menu',
    description: 'Seven-course tasting menu showcasing our chef&apos;s finest creations',
    validTime: 'Available Thursday - Saturday',
    discount: '$125/person',
    type: 'premium',
    color: 'bg-amber-500'
  }
];

export default function SpecialPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Offers</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our exclusive deals and seasonal promotions for an exceptional dining experience
          </p>
        </div>
      </div>

      {/* Special Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`${offer.color} text-white p-6 relative`}>
                <div className="absolute top-4 right-4">
                  {offer.type === 'time-based' && <Clock size={24} />}
                  {offer.type === 'package' && <Gift size={24} />}
                  {offer.type === 'weekend' && <Star size={24} />}
                  {offer.type === 'family' && <Gift size={24} />}
                  {offer.type === 'birthday' && <Gift size={24} />}
                  {offer.type === 'premium' && <Star size={24} />}
                </div>
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <div className="text-3xl font-bold">{offer.discount}</div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                  <Clock size={16} />
                  <span>{offer.validTime}</span>
                </div>
                <Link
                  href="/menu"
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors text-center block"
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Terms & Conditions</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4 text-sm text-gray-600">
              <p>• Special offers cannot be combined with other promotions or discounts</p>
              <p>• Happy Hour special is valid for dine-in customers only</p>
              <p>• Date Night Package requires advance reservation</p>
              <p>• Weekend Brunch requires reservation and is subject to availability</p>
              <p>• Family Feast offer: Kids 12 and under eat free with purchase of 2 adult entrees</p>
              <p>• Birthday special requires valid ID showing birthday date</p>
              <p>• Chef&apos;s Tasting Menu has limited availability and requires 24-hour advance booking</p>
              <p>• All offers are subject to availability and may be modified or discontinued without notice</p>
              <p>• Gratuity is not included in special offer pricing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-amber-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enjoy These Offers?</h2>
          <p className="text-xl mb-8">
            Make a reservation or order online to take advantage of our special deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservations"
              className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Make Reservation
            </Link>
            <Link
              href="/menu"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-colors"
            >
              Order Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
