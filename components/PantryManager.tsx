
import React, { useState } from 'react';
import { PantryItem } from '../types';
import { Plus, Minus, Search, Trash2, Box } from 'lucide-react';

interface PantryManagerProps {
  items: PantryItem[];
  onUpdate: (id: string, amount: number) => void;
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
  onRemove: (id: string) => void;
}

const PantryManager: React.FC<PantryManagerProps> = ({ items, onUpdate, onAdd, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('g');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    onAdd({
      name: newItemName,
      amount: newItemAmount,
      unit: newItemUnit,
      category: 'Divers'
    });
    setNewItemName('');
    setNewItemAmount(1);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">Mes Provisions</h1>
        <p className="text-gray-500 italic">Gardez un œil sur ce qu'il reste dans vos placards.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Rechercher un ingrédient..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-50 p-2 rounded-xl">
                      <Box className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 capitalize">{item.name}</h4>
                      <span className="text-xs text-gray-400 font-medium">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-xl">
                      <button 
                        onClick={() => onUpdate(item.id, Math.max(0, item.amount - 1))}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold min-w-[3rem] text-center text-gray-700">
                        {item.amount} <span className="text-xs font-medium text-gray-400 uppercase">{item.unit}</span>
                      </span>
                      <button 
                        onClick={() => onUpdate(item.id, item.amount + 1)}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">Aucun ingrédient trouvé.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-orange-500" /> Ajouter un produit
          </h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nom de l'ingrédient</label>
              <input 
                type="text"
                placeholder="Ex: Farine, Oeufs..."
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Quantité</label>
                <input 
                  type="number"
                  className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Unité</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                >
                  <option value="g">grammes (g)</option>
                  <option value="kg">kilogrammes (kg)</option>
                  <option value="ml">millilitres (ml)</option>
                  <option value="L">litres (L)</option>
                  <option value="unité">unité(s)</option>
                  <option value="pincée">pincée(s)</option>
                </select>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
            >
              Ajouter au stock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PantryManager;
