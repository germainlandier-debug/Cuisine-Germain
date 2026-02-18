
import React from 'react';
import { ShoppingItem, PantryItem } from '../types';
import { Trash2, CheckCircle, Circle, RefreshCw, Sparkles } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItem[];
  pantryItems: PantryItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSmartSync: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  items, 
  pantryItems,
  onToggle, 
  onRemove, 
  onClear,
  onSmartSync
}) => {
  const pendingItems = items.filter(i => !i.checked);
  const completedItems = items.filter(i => i.checked);

  // Simple heuristic: if we have more in pantry than needed, mark as maybe already owned
  const getIsMissing = (item: ShoppingItem) => {
    const inStock = pantryItems.find(p => p.name.toLowerCase() === item.name.toLowerCase());
    return !inStock || inStock.amount < item.amount;
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">Ma Liste de Courses</h1>
          <p className="text-gray-500">Préparez vos prochaines recettes en toute sérénité.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={onSmartSync}
            className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-2xl font-bold hover:bg-orange-200 transition-all text-sm"
          >
            <Sparkles size={18} /> Synchroniser IA
          </button>
          <button 
            onClick={onClear}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 px-4 py-2 rounded-2xl transition-all text-sm"
          >
            <Trash2 size={18} /> Tout effacer
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">À acheter ({pendingItems.length})</h3>
          <div className="space-y-3">
            {pendingItems.length > 0 ? (
              pendingItems.map(item => {
                const isMissing = getIsMissing(item);
                return (
                  <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm group">
                    <div className="flex items-center gap-4">
                      <button onClick={() => onToggle(item.id)} className="text-gray-300 hover:text-orange-500 transition-colors">
                        <Circle size={24} />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 capitalize">{item.name}</span>
                          {!isMissing && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">En stock</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{item.amount} {item.unit}</span>
                      </div>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-12 text-center">
                <ShoppingBag className="mx-auto text-orange-200 mb-4" size={48} />
                <p className="text-orange-800 font-medium">Votre panier est vide !</p>
                <p className="text-orange-600/70 text-sm mt-1">Ajoutez des ingrédients depuis vos recettes préférées.</p>
              </div>
            )}
          </div>
        </section>

        {completedItems.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Déjà pris ({completedItems.length})</h3>
            <div className="space-y-2">
              {completedItems.map(item => (
                <div key={item.id} className="bg-gray-50/50 p-3 rounded-xl flex items-center justify-between border border-gray-100 opacity-60">
                  <div className="flex items-center gap-4">
                    <button onClick={() => onToggle(item.id)} className="text-green-500">
                      <CheckCircle size={20} />
                    </button>
                    <span className="text-gray-500 line-through capitalize font-medium">{item.name} ({item.amount} {item.unit})</span>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Placeholder icon for empty state
const ShoppingBag = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default ShoppingList;
