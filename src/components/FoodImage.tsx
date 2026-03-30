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
    <div className={`${getCategoryColor(category)} ${className} flex items-center justify-center text-white relative overflow-hidden group`}>
      {/* Animated Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      
      <div className="relative text-center p-4 z-10 transition-transform duration-500 group-hover:scale-110">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/20 shadow-xl">
          <ChefHat size={32} className="opacity-80" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest opacity-90 text-center leading-tight">
          {foodName}
        </p>
      </div>

      {/* Internal Glow */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
    </div>
  );
}

