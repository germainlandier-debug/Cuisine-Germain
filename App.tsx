
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import RecipeCard from './components/RecipeCard';
import RecipeDetails from './components/RecipeDetails';
import PantryManager from './components/PantryManager';
import ShoppingList from './components/ShoppingList';
import { Recipe, PantryItem, ShoppingItem, Ingredient } from './types';
import { Plus, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { geminiService } from './services/geminiService';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Cannelloni Ricotta Épinards',
    description: 'Un classique italien fondant et savoureux, parfait pour toute la famille.',
    servings: 4,
    prepTime: '45 min',
    category: 'Italien',
    ingredients: [
      { name: 'Pâte à cannelloni', amount: 12, unit: 'tubes' },
      { name: 'Ricotta', amount: 500, unit: 'g' },
      { name: 'Épinards frais', amount: 400, unit: 'g' },
      { name: 'Parmesan', amount: 100, unit: 'g' },
      { name: 'Sauce tomate', amount: 500, unit: 'ml' },
      { name: 'Ail', amount: 2, unit: 'gousses' }
    ],
    steps: [
      'Faire revenir les épinards avec l\'ail.',
      'Mélanger les épinards hachés avec la ricotta et le parmesan.',
      'Farcir les cannelloni avec ce mélange.',
      'Napper de sauce tomate et enfourner 25 min à 200°C.'
    ]
  },
  {
    id: '2',
    title: 'Tartine Avocat & Œuf Poché',
    description: 'Le petit déjeuner idéal ou un brunch rapide et sain.',
    servings: 1,
    prepTime: '15 min',
    category: 'Brunch',
    ingredients: [
      { name: 'Pain de campagne', amount: 2, unit: 'tranches' },
      { name: 'Avocat', amount: 1, unit: 'unité' },
      { name: 'Œufs', amount: 2, unit: 'unités' },
      { name: 'Piment d\'Espelette', amount: 1, unit: 'pincée' }
    ],
    steps: [
      'Toaster le pain.',
      'Écraser l\'avocat avec du sel et du citron.',
      'Pocher les œufs 3 minutes dans l\'eau frémissante.',
      'Assembler et saupoudrer de piment.'
    ]
  }
];

const INITIAL_PANTRY: PantryItem[] = [
  { id: 'p1', name: 'Farine', amount: 1000, unit: 'g', category: 'Épicerie' },
  { id: 'p2', name: 'Œufs', amount: 6, unit: 'unités', category: 'Frais' },
  { id: 'p3', name: 'Sauce tomate', amount: 200, unit: 'ml', category: 'Conserves' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [pantry, setPantry] = useState<PantryItem[]>(INITIAL_PANTRY);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const savedPantry = localStorage.getItem('gourmet_pantry');
    if (savedPantry) setPantry(JSON.parse(savedPantry));
    const savedRecipes = localStorage.getItem('gourmet_recipes');
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
    const savedShopping = localStorage.getItem('gourmet_shopping');
    if (savedShopping) setShoppingList(JSON.parse(savedShopping));
  }, []);

  useEffect(() => {
    localStorage.setItem('gourmet_pantry', JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem('gourmet_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('gourmet_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const handleUpdatePantry = (id: string, amount: number) => {
    setPantry(pantry.map(item => item.id === id ? { ...item, amount } : item));
  };

  const handleAddPantryItem = (item: Omit<PantryItem, 'id'>) => {
    setPantry([...pantry, { ...item, id: Date.now().toString() }]);
  };

  const handleRemovePantryItem = (id: string) => {
    setPantry(pantry.filter(item => item.id !== id));
  };

  const handleAddToShoppingList = (ingredients: Ingredient[]) => {
    const newItems: ShoppingItem[] = ingredients.map(ing => ({
      ...ing,
      id: Math.random().toString(36).substr(2, 9),
      checked: false
    }));
    setShoppingList([...shoppingList, ...newItems]);
    alert(`${ingredients.length} ingrédients ajoutés à votre liste de courses !`);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const handleAiSmartSync = async () => {
    setIsAiLoading(true);
    // Simulation of AI intelligence sorting list by aisle or suggesting missing staples
    setTimeout(() => {
      setIsAiLoading(false);
      alert("Votre liste a été optimisée par IA !");
    }, 1500);
  };

  const handleMagicRecipe = async () => {
    setIsAiLoading(true);
    try {
      const suggestions = await geminiService.suggestRecipes(pantry.map(i => i.name));
      const firstSug = suggestions[0]?.replace(/^[-* ]+/, '') || "Ratatouille Express";
      
      const recipeData = await geminiService.parseRecipe(`Crée une recette de ${firstSug} en utilisant si possible ce que j'ai : ${pantry.map(i => i.name).join(', ')}`);
      
      const imageUrl = await geminiService.generateRecipeImage(recipeData.title || firstSug);
      
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        title: recipeData.title || firstSug,
        description: recipeData.description || 'Une délicieuse recette générée pour vous.',
        servings: recipeData.servings || 4,
        ingredients: recipeData.ingredients || [],
        steps: recipeData.steps || [],
        imageUrl: imageUrl,
        category: 'Inspiré par IA',
        prepTime: '25 min'
      };

      setRecipes([newRecipe, ...recipes]);
      setSelectedRecipe(newRecipe);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20 bg-[#fbfcfd]">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === 'recipes' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-5xl font-serif font-bold text-gray-800 mb-3 tracking-tight">Vos Recettes</h1>
                <p className="text-gray-500 text-lg">Cuisinez ce qui vous fait plaisir, tous les jours.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleMagicRecipe}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:shadow-orange-200 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                  <span>Inspiration IA</span>
                </button>
                <button 
                  className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                  title="Ajouter manuellement"
                >
                  <Plus size={24} />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={setSelectedRecipe} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pantry' && (
          <div className="animate-in fade-in duration-500">
            <PantryManager 
              items={pantry}
              onUpdate={handleUpdatePantry}
              onAdd={handleAddPantryItem}
              onRemove={handleRemovePantryItem}
            />
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="animate-in fade-in duration-500">
            <ShoppingList 
              items={shoppingList}
              pantryItems={pantry}
              onToggle={toggleShoppingItem}
              onRemove={removeShoppingItem}
              onClear={() => setShoppingList([])}
              onSmartSync={handleAiSmartSync}
            />
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetails 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToShoppingList={handleAddToShoppingList}
        />
      )}

      {/* Global AI Loading Overlay */}
      {isAiLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[100] flex flex-col items-center justify-center gap-4 text-orange-600">
          <Loader2 size={48} className="animate-spin" />
          <p className="font-serif text-xl font-bold animate-pulse">L'IA prépare quelque chose de bon...</p>
        </div>
      )}
    </div>
  );
};

export default App;
