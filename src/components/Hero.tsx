/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Database, ShieldCheck, Flame, ChevronRight, Zap, Copy, Check } from 'lucide-react';
import CodeHighlight from './CodeHighlight';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'rust' | 'php'>('rust');

  const copyCommand = () => {
    navigator.clipboard.writeText('rullst = "0.1.0"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rustCode = `// The delightful Laravel ActiveRecord style, now fast and compiled in Rust!
use rullst_orm::prelude::*;

#[derive(ActiveRecord, Debug)]
#[table = "users"]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub is_active: bool,
}

#[tokio::main]
async fn main() -> Result<(), RullstError> {
    // 1. Ultra-expressive chained queries
    let vips = User::query()
        .where("is_active", "=", true)
        .where_not_null("email")
        .order_by("name", "ASC")
        .limit(10)
        .get()
        .await?;

    // 2. Instant instance creation (ActiveRecord pattern)
    let mut new_user = User::new();
    new_user.name = "Venelouis".to_string();
    new_user.email = "x@gmail.com".to_string();
    
    // 3. Directly save the record
    new_user.save().await?;
    
    println!("User registered with ID: {}", new_user.id);
    Ok(())
}`;

  const phpCode = `<?php
// The classic Laravel Eloquent that inspired Rullst:
namespace App\\Models;
use Illuminate\\Database\\Eloquent\\Model;

class User extends Model {
    protected $table = 'users';
    public $timestamps = false;
}

// 1. Expressive chained queries
$vips = User::where('is_active', true)
    ->whereNotNull('email')
    ->orderBy('name', 'asc')
    ->limit(10)
    ->get();

// 2. Fast instance creation
$new_user = new User();
$new_user->name = "Venelouis";
$new_user->email = "x@gmail.com";

// 3. Directly save the record
$new_user->save();

echo "User registered with ID: " . $new_user->id;
`;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-zinc-950">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest"
            >
              <Flame className="h-4.5 w-4.5 animate-pulse" />
              <span>Rust's ActiveRecord ORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.05] text-glow-orange"
            >
              The elegance of{' '}
              <span className="text-orange-500">
                Eloquent
              </span>{' '}
              now in{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-extrabold">
                Rust
              </span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans"
            >
              Rullst is an Active Record ORM for high-performance Rust ecosystems. Built on top of procedural macros, it delivers an intuitive, clean, and highly productive syntax without compromising on Rust's legendary speed and memory safety.
            </motion.p>

            {/* Quick action block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Dependency badge copy */}
              <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 w-full sm:w-auto font-mono text-sm group transition-all hover:border-zinc-700">
                <span className="text-zinc-500 font-sans">Cargo:</span>
                <span className="text-zinc-200">rullst = "0.1.0"</span>
                <button
                  onClick={copyCommand}
                  className="ml-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title="Copy dependency"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Database className="h-4 w-4 text-zinc-500" />
                <span>Compatible with Postgres, MySQL & SQLite</span>
              </div>
            </motion.div>

            {/* Micro Highlights Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 text-left border-t border-zinc-900"
            >
              <div className="space-y-1">
                <p className="text-white font-bold text-xl md:text-2xl font-display">⚡ 0ms</p>
                <p className="text-xs text-zinc-500 font-medium font-sans">Zero dynamic driver overhead</p>
              </div>
              <div className="space-y-1 border-l border-zinc-900 pl-4">
                <p className="text-orange-500 font-bold text-xl md:text-2xl font-display">Laravel</p>
                <p className="text-xs text-zinc-500 font-medium font-sans">Inherited expressive syntax</p>
              </div>
              <div className="space-y-1 border-l border-zinc-900 pl-4">
                <p className="text-emerald-500 font-bold text-xl md:text-2xl font-display">Safe</p>
                <p className="text-xs text-zinc-500 font-medium font-sans">SQL injection prevention</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Code Switcher Section */}
          <div className="lg:col-span-7 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full bg-[#010409] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden box-glow-orange"
            >
              {/* Terminal header */}
              <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/25 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/25 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/25 border border-green-500/50" />
                  <span className="text-xs text-zinc-500 font-mono ml-3 font-semibold">src/main.rs</span>
                </div>
                
                {/* Code Tabs Switcher */}
                <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                  <button
                    onClick={() => setActiveCodeTab('rust')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeCodeTab === 'rust' 
                        ? 'bg-orange-600 text-black font-bold shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Rust (Rullst)
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('php')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeCodeTab === 'php' 
                        ? 'bg-zinc-800 text-white shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    PHP (Eloquent)
                  </button>
                </div>
              </div>

              {/* Code Panel */}
              <div className="p-6 max-h-[480px] overflow-y-auto bg-[#010409]">
                {activeCodeTab === 'rust' ? (
                  <CodeHighlight code={rustCode} language="rust" />
                ) : (
                  <CodeHighlight code={phpCode} language="rust" />
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
