import { ChefHat } from 'lucide-react';

interface FoodImageProps {
  foodName: string;
  category: string;
  className?: string;
}

export default function FoodImage({ foodName, category, className = "" }: FoodImageProps) {
  // Get a color based on the category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'appetizers': return 'bg-gradient-to-br from-orange-400 to-red-500';
      case 'mains': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'pasta': return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'desserts': return 'bg-gradient-to-br from-pink-400 to-purple-500';
      case 'beverages': return 'bg-gradient-to-br from-blue-400 to-indigo-500';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`${getCategoryColor(category)} ${className} flex items-center justify-center text-white relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative text-center">
        <ChefHat size={32} className="mx-auto mb-2 opacity-80" />
        <p className="text-sm font-medium opacity-90 px-2 text-center leading-tight">
          {foodName}
        </p>
      </div>
    </div>
  );
}
