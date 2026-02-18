
import React from 'react';
import { ChefHat, ShoppingBag, Box, Search } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'recipes', label: 'Recettes', icon: ChefHat },
    { id: 'pantry', label: 'Provisions', icon: Box },
    { id: 'shopping', label: 'Courses', icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-4xl mx-auto flex justify-around md:justify-start md:gap-8 items-center">
        <div className="hidden md:flex items-center gap-2 mr-8">
          <ChefHat className="text-orange-500 w-8 h-8" />
          <span className="font-serif text-xl font-bold text-gray-800">GourmetFlow</span>
        </div>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-lg transition-all ${
              activeTab === id ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs md:text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
