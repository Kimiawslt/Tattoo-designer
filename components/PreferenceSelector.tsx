import React from 'react';
import { Preference } from '../types';
import { Tag, Plus, X } from 'lucide-react';

interface Props {
  preferences: Preference[];
  togglePreference: (id: string) => void;
  addPreference: (label: string) => void;
  removePreference: (id: string) => void;
}

export const PreferenceSelector: React.FC<Props> = ({ 
  preferences, 
  togglePreference, 
  addPreference,
  removePreference 
}) => {
  const [newTag, setNewTag] = React.useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addPreference(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-skin-500" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Meaning & Symbols</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 border cursor-pointer select-none
              ${pref.active 
                ? 'bg-skin-500 border-skin-500 text-ink-900 font-medium shadow-[0_0_15px_rgba(197,160,131,0.3)]' 
                : 'bg-ink-800 border-ink-800 text-gray-400 hover:border-gray-600'}
            `}
            onClick={() => togglePreference(pref.id)}
          >
            {pref.label}
            {/* Delete button only visible on hover if active or inactive */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removePreference(pref.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-red-400 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="relative mt-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add custom meaning (e.g., Strength)..."
          className="w-full bg-transparent border-b border-gray-700 py-2 pl-2 pr-8 text-sm focus:border-skin-500 focus:outline-none transition-colors text-white placeholder-gray-600"
        />
        <button 
          type="submit"
          className="absolute right-0 top-2 text-gray-500 hover:text-skin-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};