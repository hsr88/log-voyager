import { useState, useEffect, useMemo } from 'react';
import { Command, Search, X, Keyboard, Sun, Moon, Split, Filter, Download, BarChart, AlertCircle, BookOpen, Settings, FileText, Zap } from 'lucide-react';
import type { Command as CommandType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandType[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower)
    );
  }, [search, commands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  const getIcon = (iconName?: string) => {
    const props = { size: 16, className: "text-slate-400" };
    switch (iconName) {
      case 'keyboard': return <Keyboard {...props} />;
      case 'sun': return <Sun {...props} />;
      case 'moon': return <Moon {...props} />;
      case 'split': return <Split {...props} />;
      case 'filter': return <Filter {...props} />;
      case 'download': return <Download {...props} />;
      case 'stats': return <BarChart {...props} />;
      case 'errors': return <AlertCircle {...props} />;
      case 'bookmarks': return <BookOpen {...props} />;
      case 'settings': return <Settings {...props} />;
      case 'file': return <FileText {...props} />;
      case 'zap': return <Zap {...props} />;
      default: return <Command {...props} />;
    }
  };

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandType[]>);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0d1117] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-jetbrains">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search size={20} className="text-[#00f3ff]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/5">
                  {category}
                </div>
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-[#00f3ff]/10 border-l-2 border-[#00f3ff]' : 'hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      {getIcon(cmd.icon)}
                      <span className={`flex-1 text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {cmd.label}
                      </span>
                      {cmd.shortcut && (
                        <kbd className="px-2 py-1 text-[10px] bg-white/10 rounded text-slate-400">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Enter</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
