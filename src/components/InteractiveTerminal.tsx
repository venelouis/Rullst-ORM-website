/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Play, Sparkles, Database } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Rullst CLI Engine v0.1.0-alpha', type: 'success' },
    { text: 'Type "rullst help" or click on the recommended shortcuts below to start.', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const commandShortcuts = [
    'rullst help',
    'rullst migrate',
    'rullst db:seed',
    'rullst status'
  ];

  const handleCommandSubmit = (command: string) => {
    if (isProcessing || !command.trim()) return;

    // Add command input line
    const newHistory = [...history, { text: cmdPrompt(command), type: 'input' as const }];
    setHistory(newHistory);
    setInputValue('');
    setIsProcessing(true);

    // Simulate system computation timing delay
    setTimeout(() => {
      const resp = processMockCommand(command.toLowerCase().trim());
      setHistory(prev => [...prev, ...resp]);
      setIsProcessing(false);
    }, 600);
  };

  const cmdPrompt = (cmd: string) => `$ ${cmd}`;

  const processMockCommand = (commandStr: string): TerminalLine[] => {
    // If user forgot 'rullst' prefix but typed basic command
    let clean = commandStr;
    if (clean.startsWith('rullst ')) {
      clean = clean.replace('rullst ', '');
    }

    switch (clean) {
      case 'help':
        return [
          { text: '=== AVAILABLE RULLST COMMANDS ===', type: 'success' },
          { text: '  rullst migrate                  Run all pending SQL database migrations', type: 'output' },
          { text: '  rullst db:seed                 Seed database tables with realistic mock records', type: 'output' },
          { text: '  rullst make:migration [NAME]   Generate structured custom SQL migration file', type: 'output' },
          { text: '  rullst make:model [NAME]       Generate clean Rust model struct with ActiveRecord derives', type: 'output' },
          { text: '  rullst status                  Check connections for active PostgreSQL, MySQL and SQLite drivers', type: 'output' },
          { text: '  clear                          Clear the terminal session output', type: 'output' }
        ];

      case 'migrate':
        return [
          { text: '⏱️ Initializing Rullst migration pool...', type: 'output' },
          { text: '✔ Creating table: users (0.012s)', type: 'success' },
          { text: '✔ Creating table: posts (0.009s)', type: 'success' },
          { text: '✔ Creating table: comments (0.015s)', type: 'success' },
          { text: '🎉 Database successfully migrated in 0.036s!', type: 'success' }
        ];

      case 'db:seed':
      case 'seed':
        return [
          { text: '🌱 Running Rullst Database Seeder...', type: 'output' },
          { text: '  ▸ Inserting 50 realistic fake user rows...', type: 'output' },
          { text: '  ▸ Seeding 120 posts coupled with related category tags...', type: 'output' },
          { text: '✔ Seeding successfully completed! All tables populated.', type: 'success' }
        ];

      case 'status':
        return [
          { text: '=== RULLST CONNECTION CHECK ===', type: 'success' },
          { text: '  • PostgreSQL Driver    : Active (sqlx postgres pool v0.7.3)', type: 'output' },
          { text: '  • MySQL Driver         : Active (sqlx mysql pool v0.7.3)', type: 'output' },
          { text: '  • SQLite Driver        : Active (sqlx sqlite pool v0.7.3)', type: 'output' },
          { text: '  • Redis Cache Server   : Connected (redis://127.0.0.1:6379)', type: 'output' },
          { text: '  ✔ Web deployment is ready for production scaling!', type: 'success' }
        ];

      case 'clear':
        setTimeout(() => setHistory([]), 5);
        return [];

      default:
        if (clean.startsWith('make:migration')) {
          const name = clean.split(' ')[1] || 'migration_file';
          return [
            { text: `✔ Migration generated: migrations/20260607_${name}.sql`, type: 'success' },
            { text: 'Tip: Run "rullst migrate" to automatically apply the schemas.', type: 'output' }
          ];
        }
        if (clean.startsWith('make:model')) {
          const modelName = clean.split(' ')[1] || 'NewModel';
          const capitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
          return [
            { text: `✔ Created rullst Rust model: src/models/${capitalized.toLowerCase()}.rs`, type: 'success' },
            { text: 'Insert #[derive(ActiveRecord)] directives to unlock fluent query DSL.', type: 'output' }
          ];
        }

        return [
          { text: `❌ Command not recognized: "${commandStr}"`, type: 'error' },
          { text: 'Type "rullst help" to list all available CLI commands inside Rullst.', type: 'output' }
        ];
    }
  };

  useEffect(() => {
    // Keep console scrolled to index
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <section id="cli" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section header block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Terminal className="h-4 w-4" />
            <span>Interactive CLI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight text-glow-orange">
            Artisan CLI for Rust
          </h2>
          <p className="text-zinc-400 mt-4 leading-relaxed text-sm md:text-base font-sans">
            Rullst comes with robust console utilities inspired by Laravel Artisan to handle pending SQL migrations, scaffold clean Rust models, and seed datasets in milliseconds. Try it now!
          </p>
        </div>

        {/* Terminal screen layout wrapper */}
        <div className="bg-[#010409] border border-zinc-800/85 rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto box-glow-orange">
          
          {/* Header toolbar */}
          <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-zinc-400 font-mono font-bold ml-3.5">venelouis@rullst-cli:~</span>
            </div>
            <div className="flex items-center space-x-1">
              <Database className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Dynamic Driver Exec</span>
            </div>
          </div>

          {/* Terminal Logs View */}
          <div className="p-6 h-[280px] overflow-y-auto font-mono text-xs sm:text-sm space-y-2 bg-[#010409]/95 select-text">
            {history.map((line, idx) => {
              let textClass = 'text-zinc-300';
              if (line.type === 'input') textClass = 'text-orange-400 font-semibold';
              else if (line.type === 'error') textClass = 'text-rose-400 font-bold';
              else if (line.type === 'success') textClass = 'text-emerald-400 font-medium';

              return (
                <div key={idx} className={`${textClass} leading-relaxed break-keep`}>
                  {line.text}
                </div>
              );
            })}
            
            {/* Loading blinking indicator */}
            {isProcessing && (
              <div className="text-orange-400 font-mono text-xs flex items-center space-x-2 animate-pulse">
                <span className="animate-spin mr-1">⌛</span>
                <span>Processing command inside Rullst...</span>
              </div>
            )}
            
            <div ref={terminalEndRef} />
          </div>

          {/* Input control line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommandSubmit(inputValue);
            }}
            className="px-4 py-3 bg-zinc-900/10 border-t border-zinc-900 flex items-center"
          >
            <ChevronRight className="h-4.5 w-4.5 text-orange-500 shrink-0 mr-1.5" />
            <input
              type="text"
              disabled={isProcessing}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type 'rullst help'..."
              className="bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-sm flex-1"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="p-1.5 px-4 bg-orange-600 hover:bg-orange-500 text-black font-bold text-[11px] rounded-lg transition-all cursor-pointer font-sans shrink-0 uppercase tracking-wider"
            >
              Execute
            </button>
          </form>

        </div>

        {/* Shortcuts / Quick Commands Buttons layout */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider mr-1.5 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Suggestions:
          </span>
          {commandShortcuts.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommandSubmit(cmd)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-zinc-900/40 border border-zinc-800/80 text-zinc-350 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
