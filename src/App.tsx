/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import InteractiveSandbox from './components/InteractiveSandbox';
import SchemaDesigner from './components/SchemaDesigner';
import InteractiveTerminal from './components/InteractiveTerminal';
import Documentation from './components/Documentation';
import { Database, Github, Terminal, Copyright, Heart, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('features');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll height to highlight correct navbar link and display scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      // Determine what section we are over
      const featuresEl = document.getElementById('features');
      const playgroundEl = document.getElementById('playground');
      const designerEl = document.getElementById('designer');
      const cliEl = document.getElementById('cli');

      if (cliEl && scrollPosition >= cliEl.offsetTop) {
        setActiveSection('cli');
      } else if (designerEl && scrollPosition >= designerEl.offsetTop) {
        setActiveSection('designer');
      } else if (playgroundEl && scrollPosition >= playgroundEl.offsetTop) {
        setActiveSection('playground');
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveSection('features');
      }

      // Show scroll-to-top toggle
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased relative">
      {/* Sleek Background Grid */}
      <div className="absolute inset-0 opacity-8 sleek-grid pointer-events-none z-0" />

      {/* 1. Header & Navigation */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={handleNavigate}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* 2. Page Contents */}
      <main className="flex-1 w-full">
        {/* Dynamic Header Display */}
        <Hero />

        {/* Core benefits & matrices */}
        <Features />

        {/* Sandbox Query workspace */}
        <InteractiveSandbox />

        {/* Structural Model Schemer */}
        <SchemaDesigner />

        {/* Command Terminal simulator */}
        <InteractiveTerminal />
      </main>

      {/* 3. Global Documents panel drawer */}
      <Documentation
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* 4. Footer */}
      <footer className="bg-zinc-950/60 backdrop-blur-sm border-t border-zinc-900 py-12 relative overflow-hidden">
        {/* Ambient indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-900 pb-8">
            
            {/* Logo details */}
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                <Database className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">Rullst ORM</span>
            </div>

            {/* Links and handles */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <button onClick={() => handleNavigate('features')} className="hover:text-orange-500 transition-colors cursor-pointer">Benefits</button>
              <button onClick={() => handleNavigate('playground')} className="hover:text-orange-500 transition-colors cursor-pointer">Playground</button>
              <button onClick={() => handleNavigate('designer')} className="hover:text-orange-500 transition-colors cursor-pointer">Designer</button>
              <button onClick={() => handleNavigate('cli')} className="hover:text-orange-500 transition-colors cursor-pointer">Artisan CLI</button>
              <button onClick={() => setIsDocsOpen(true)} className="hover:text-orange-500 transition-colors cursor-pointer text-orange-400">Docs</button>
            </div>

            {/* External repository */}
            <a
              href="https://github.com/venelouis/rullst-orm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="h-4.5 w-4.5" />
              <span>View on GitHub</span>
            </a>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center space-x-1">
              <Copyright className="h-3.5 w-3.5" />
              <span>{new Date().getFullYear()} Rullst ORM. Created and maintained by Venelouis.</span>
            </div>

            {/* Sleek status indicators (matches design.html footer) */}
            <div className="flex items-center gap-6">
              <div className="flex gap-4 uppercase tracking-widest text-[10px] font-semibold text-zinc-600">
                <span>MIT License</span>
                <span>Rust 1.70+</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400">Build: Passing</span>
                <span className="bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400">Coverage: 98%</span>
              </div>
              <div className="flex items-center space-x-1 text-zinc-600 pl-2 border-l border-zinc-900">
                <span>With</span>
                <Heart className="h-3 w-3 text-orange-500 fill-orange-500/20" />
                <span>for Rust</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Float: Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl hover:scale-105 z-40 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="h-5 w-5 text-orange-500" />
        </button>
      )}
    </div>
  );
}
