/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, Github, BookOpen, Terminal, Code2, Sparkles, Layers } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenDocs: () => void;
}

export default function Navigation({ activeSection, setActiveSection, onOpenDocs }: NavigationProps) {
  const navItems = [
    { id: 'features', label: 'Benefícios', icon: Sparkles },
    { id: 'playground', label: 'Query Builder', icon: Code2 },
    { id: 'designer', label: 'Schema Builder', icon: Layers },
    { id: 'cli', label: 'Artisan CLI', icon: Terminal },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 rounded bg-orange-600 flex items-center justify-center text-black font-extrabold text-lg shadow-md shadow-orange-600/10">
            R
          </div>
          <span className="font-bold text-xl tracking-tight text-white font-sans">
            rullst<span className="text-orange-500">-orm</span>
          </span>
        </div>

        {/* Navigation center items */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-orange-500 bg-zinc-900 border border-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Extra buttons (Docs & GitHub) */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-orange-500" />
            <span className="hidden sm:inline">Documentação</span>
          </button>

          <a
            href="https://github.com/venelouis/rullst-orm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/80 transition-all cursor-pointer"
            title="Ver no GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
