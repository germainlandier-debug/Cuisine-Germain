
import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, ArrowRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer group"
      onClick={() => onClick(recipe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/400`} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {recipe.category && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow-sm">
            {recipe.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={14} />
              <span>{recipe.servings} pers.</span>
            </div>
            {recipe.prepTime && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14} />
                <span>{recipe.prepTime}</span>
              </div>
            )}
          </div>
          <ArrowRight size={18} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
