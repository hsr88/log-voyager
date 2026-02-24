import { useState } from 'react';
import { Plus, X, Filter, Trash2, CaseSensitive, Regex } from 'lucide-react';
import type { Filter } from '../types';

interface MultiFilterProps {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MultiFilter: React.FC<MultiFilterProps> = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addFilter = () => {
    const newFilter: Filter = {
      id: generateId(),
      term: '',
      type: 'include',
      useRegex: false,
      caseSensitive: false,
      level: 'all',
    };
    onChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    onChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const clearFilters = () => {
    onChange([]);
  };

  const activeCount = filters.filter(f => f.term.trim()).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold transition-all ${
          activeCount > 0 
            ? 'bg-[#00f3ff]/20 border border-[#00f3ff] text-[#00f3ff]' 
            : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
        }`}
      >
        <Filter size={12} />
        <span>FILTERS {activeCount > 0 && `(${activeCount})`}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 glass-panel border border-white/10 rounded-xl z-50 shadow-2xl">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Filter size={12} className="text-[#00f3ff]" />
              MULTI-FILTER
            </span>
            <div className="flex items-center gap-1">
              {filters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                  title="Clear all filters"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-3 space-y-2">
            {filters.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No filters active. Click + to add one.
              </div>
            ) : (
              filters.map((filter) => (
                <div
                  key={filter.id}
                  className="bg-black/40 rounded-lg p-3 border border-white/5 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={filter.type}
                      onChange={(e) => updateFilter(filter.id, { type: e.target.value as 'include' | 'exclude' })}
                      className="bg-white/10 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                    >
                      <option value="include">Include</option>
                      <option value="exclude">Exclude</option>
                    </select>
                    
                    <select
                      value={filter.level}
                      onChange={(e) => updateFilter(filter.id, { level: e.target.value as Filter['level'] })}
                      className="bg-white/10 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                    >
                      <option value="all">Any Level</option>
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>

                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="ml-auto p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={filter.term}
                    onChange={(e) => updateFilter(filter.id, { term: e.target.value })}
                    placeholder="Filter term..."
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00f3ff]/50"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFilter(filter.id, { caseSensitive: !filter.caseSensitive })}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] transition-colors ${
                        filter.caseSensitive 
                          ? 'bg-[#00f3ff]/20 text-[#00f3ff]' 
                          : 'bg-white/5 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <CaseSensitive size={10} />
                      Aa
                    </button>
                    <button
                      onClick={() => updateFilter(filter.id, { useRegex: !filter.useRegex })}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] transition-colors ${
                        filter.useRegex 
                          ? 'bg-[#00f3ff]/20 text-[#00f3ff]' 
                          : 'bg-white/5 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Regex size={10} />
                      .*
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={addFilter}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 text-[#00f3ff] text-xs font-bold transition-colors"
            >
              <Plus size={14} />
              ADD FILTER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to apply filters to lines
export const applyFilters = (lines: string[], filters: Filter[]): string[] => {
  if (filters.length === 0 || !filters.some(f => f.term.trim())) return lines;

  return lines.filter(line => {
    let shouldInclude = true;

    for (const filter of filters) {
      if (!filter.term.trim()) continue;

      const levelMatch = filter.level === 'all' || 
        (filter.level === 'error' && /error|exception|fail|crash/i.test(line)) ||
        (filter.level === 'warn' && /warn|warning|caution/i.test(line)) ||
        (filter.level === 'info' && /info|information/i.test(line)) ||
        (filter.level === 'debug' && /debug|trace/i.test(line));

      if (!levelMatch) {
        if (filter.type === 'include') {
          shouldInclude = false;
          break;
        }
        continue;
      }

      let termMatch: boolean;
      try {
        if (filter.useRegex) {
          const regex = new RegExp(filter.term, filter.caseSensitive ? '' : 'i');
          termMatch = regex.test(line);
        } else {
          if (filter.caseSensitive) {
            termMatch = line.includes(filter.term);
          } else {
            termMatch = line.toLowerCase().includes(filter.term.toLowerCase());
          }
        }
      } catch {
        termMatch = false;
      }

      if (filter.type === 'include' && !termMatch) {
        shouldInclude = false;
        break;
      }
      if (filter.type === 'exclude' && termMatch) {
        shouldInclude = false;
        break;
      }
    }

    return shouldInclude;
  });
};
