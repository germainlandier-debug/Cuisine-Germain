
import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { X, Users, CheckCircle2, ShoppingCart, Share2, Copy, Check } from 'lucide-react';

interface RecipeDetailsProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (ingredients: Ingredient[]) => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, onClose, onAddToShoppingList }) => {
  const [servings, setServings] = useState(recipe.servings);
  const [copied, setCopied] = useState(false);
  const scaleFactor = servings / recipe.servings;

  const scaledIngredients = recipe.ingredients.map(ing => ({
    ...ing,
    amount: Math.round((ing.amount * scaleFactor) * 10) / 10
  }));

  const handleShare = () => {
    const ingredientList = scaledIngredients.map(i => `- ${i.amount} ${i.unit} ${i.name}`).join('\n');
    const stepList = recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    const text = `🍽️ ${recipe.title}\nPour ${servings} personnes\n\nIngrédients :\n${ingredientList}\n\nPréparation :\n${stepList}\n\nPartagé via GourmetFlow`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-2xl md:rounded-3xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="relative h-64 md:h-72 shrink-0">
          <img 
            src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/800/600`} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-colors flex items-center gap-2 px-3"
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
              <span className="text-xs font-bold">{copied ? 'Copié !' : 'Partager'}</span>
            </button>
            <button 
              onClick={onClose}
              className="bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">{recipe.title}</h2>
              <p className="text-gray-500">{recipe.description}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 shrink-0">
              <Users className="text-orange-600" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Portions</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-100 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl min-w-[1.5rem] text-center">{servings}</span>
                  <button 
                    onClick={() => setServings(servings + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Ingrédients</h3>
                <button 
                  onClick={() => onAddToShoppingList(scaledIngredients)}
                  className="text-xs flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold hover:bg-orange-200 transition-colors"
                >
                  <ShoppingCart size={14} /> Ajouter aux courses
                </button>
              </div>
              <ul className="space-y-3">
                {scaledIngredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-700 font-medium capitalize">{ing.name}</span>
                    <span className="text-orange-600 font-bold bg-white px-2 py-1 rounded-lg text-sm shadow-sm">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Préparation</h3>
              <div className="space-y-4">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed text-sm pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
