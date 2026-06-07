/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Database, Cpu, HelpCircle, HardDrive, Sparkles, Scale, Check, Minus } from 'lucide-react';

export default function Features() {
  const cards = [
    {
      icon: Database,
      title: 'True ActiveRecord Pattern',
      desc: 'Say goodbye to verbose, bureaucratic query builders. Instantiate your Rust Struct, set your fields, and chain .save().await? or .delete().await? for absolute developer comfort.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Cpu,
      title: 'Zero Runtime Overhead',
      desc: 'Built entirely on top of Rust\'s powerful procedural macros. All mapping and label inference is resolved at compile time, guaranteeing an absolute 0ms execution overhead.',
      color: 'from-rose-500 to-orange-500'
    },
    {
      icon: ShieldCheck,
      title: 'Parameterized SQL Protection',
      desc: 'Bulletproof protection against SQL injection attacks. Rullst compiles each input into secure, parameterized prepared statements on the underlying sqlx engine, staying armored.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Native Redis Caching',
      desc: 'Instantly fast-track repeated paths using the chained .cache(seconds) method. Rullst handles microsecond caching intercept and automated Redis data expiration for you.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Connection Splitting (R/W)',
      desc: 'Enterprise-tier scaling made effortless. Seamlessly dispatch Write operations to primary nodes and Read operations to secondary replicas without refactoring existing codebase.',
      color: 'from-purple-500 to-rose-500'
    },
    {
      icon: HardDrive,
      title: 'Universal Dynamic Drivers',
      desc: 'Connect a single binary dynamically to PostgreSQL, MySQL, or local SQLite pools, avoiding tedious recompilation processes or exhausting feature flag switching.',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  const comparisonData = [
    {
      criterion: 'Learning Curve',
      rullst: 'Extremely Low (Eloquent Inspired)',
      diesel: 'High (Requires complex DSL)',
      seaorm: 'Medium (Dense Entity paradigm)',
      sqlx: 'Low (Just raw SQL queries)'
    },
    {
      criterion: 'Productivity (Boilerplate)',
      rullst: 'Excellent (Fewer lines of code)',
      diesel: 'Low (Write manual schema.rs files)',
      seaorm: 'Medium (Multi-layered trait structures)',
      sqlx: 'Low (Map all structs manually)'
    },
    {
      criterion: 'Active Record Ergonomics',
      rullst: 'Yes, native & expressive',
      diesel: 'No (Query DSL only)',
      seaorm: 'No (Strict Datamapper architecture)',
      sqlx: 'No (Explicit SQL matching)'
    },
    {
      criterion: 'Native Redis Caching',
      rullst: 'Yes, chained via .cache()',
      diesel: 'No (Requires custom wrapper)',
      seaorm: 'No (Third-party packages required)',
      sqlx: 'No'
    },
    {
      criterion: 'Compilation Speeds',
      rullst: 'Fast (Light static macro evaluation)',
      diesel: 'Slow (Rigid type coupling parameters)',
      seaorm: 'Slow (Heavy procedural macros tree)',
      sqlx: 'Extremely Fast'
    }
  ];

  return (
    <section id="features" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Scale className="h-4 w-4" />
            <span>Why Choose Rullst</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight text-glow-orange">
            Powerful Architecture. Unparalleled Ergonomics.
          </h2>
          <p className="text-zinc-400 mt-4 leading-relaxed text-sm md:text-base font-sans font-normal">
            Rullst merges the best of both worlds: streamlining the friction and rigid boilerplates of traditional Rust ORMs while preserving raw compiling speeds and static type guarantees.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Visual hover glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-300 pointer-events-none" />

                <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 mb-5 relative z-10">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-display font-medium text-base text-white mb-3 relative z-10">
                  {card.title}
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison sub-section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-display font-medium text-white tracking-tight">
            Rust ORMs Head-to-Head
          </h3>
          <p className="text-zinc-500 text-xs mt-2">
            Understand the key architectural, speed, and usability differences during active development
          </p>
        </div>

        {/* Comparison grid matrix */}
        <div className="max-w-4xl mx-auto bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-900">
                  <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Criterion</th>
                  <th className="p-4 font-bold text-orange-500 tracking-widest text-[10px] uppercase">Rullst ORM</th>
                  <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Diesel</th>
                  <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">SeaORM</th>
                  <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">SQLx (Raw)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-4 font-semibold text-white text-[11px] md:text-xs">{row.criterion}</td>
                    <td className="p-4 text-orange-400 font-semibold text-[11px] md:text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Check className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{row.rullst}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 text-[11px] md:text-xs">{row.diesel}</td>
                    <td className="p-4 text-zinc-400 text-[11px] md:text-xs">{row.seaorm}</td>
                    <td className="p-4 text-zinc-400 text-[11px] md:text-xs">{row.sqlx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
