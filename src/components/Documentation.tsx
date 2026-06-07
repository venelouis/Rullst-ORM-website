/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, BookOpen, ChevronRight, Hash, Rocket, Code, Sparkles, Layers, ShieldAlert, Cpu } from 'lucide-react';
import CodeHighlight from './CodeHighlight';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

type Block = 
  | { type: 'heading'; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'paragraph'; text: string };

function parseMarkdown(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentParagraphLines.join('\n')
      });
      currentParagraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({
          type: 'code',
          lang: codeLang,
          code: codeLines.join('\n')
        });
        codeLines = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        flushParagraph();
        codeLang = line.slice(3).trim() || 'rust';
        inCodeBlock = true;
      }
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({
        type: 'heading',
        text: line.slice(4).trim()
      });
    } else {
      if (line.trim() === '') {
        flushParagraph();
      } else {
        currentParagraphLines.push(line);
      }
    }
  }

  flushParagraph();
  return blocks;
}

export default function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [activeTab, setActiveTab] = useState<'quick_start' | 'models' | 'queries' | 'enterprise'>('quick_start');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const topics = [
    {
      id: 'quick_start',
      title: 'Quick Start Guide',
      icon: Rocket,
      description: 'Learn how to install, configure the database pool, and execute your first Rullst queries.',
      content: `### Installation

Add **Rullst ORM** to your Rust \`Cargo.toml\` dependencies. It handles asynchronous execution (via Tokio or others) and includes corresponding driver pools from SQLx:

\`\`\`toml
[dependencies]
rullst_orm = "0.1.0"
tokio = { version = "1.35", features = ["full"] }
chrono = { version = "0.4", features = ["serde"] }
serde = { version = "1.0", features = ["derive"] }
\`\`\`

### Environment Variables

Create a standard \`.env\` configuration file at the root of your project containing your database connection parameters. Rullst seamlessly handles PostgreSQL, MySQL, and SQLite drivers:

\`\`\`bash
# PostgreSQL Example:
DATABASE_URL="postgres://postgres:password@localhost:5473/my_db"

# Ultra-fast File-Based SQLite:
# DATABASE_URL="sqlite://local_store.db"
\`\`\`

### Pool Connection Initialization

Set up the global Rullst connection drivers inside your main entry point:

\`\`\`rust
use rullst_orm::prelude::*;

#[tokio::main]
async fn main() -> Result<(), RullstError> {
    // Configure and connect global dynamic connection pools
    Rullst::connect().await?;
    
    println!("Rullst ORM pool connected successfully!");
    Ok(())
}
\`\`\`
`
    },
    {
      id: 'models',
      title: 'ActiveRecord Models',
      icon: Code,
      description: 'Declare your Rust Structs and connect them to databases using procedural macros.',
      content: `### Defining Structs

Models utilize the \`#[derive(ActiveRecord)]\` procedural macro. By default, Rullst maps the struct identifier to plural snake_case database tables, with \`id\` acting as the default primary key.

\`\`\`rust
use rullst_orm::prelude::*;

#[derive(ActiveRecord, Debug, Clone)]
#[table = "vip_users"]               // Custom table name override
#[primary_key = "user_code"]          // Custom primary key column override
pub struct User {
    pub user_code: i32,
    pub name: String,
    pub purchase_balance: f64,
}
\`\`\`

### Basic CRUD Operations

With ActiveRecord patterns, you can query, update, insert, and delete database rows directly through struct instances:

\`\`\`rust
// 1. SELECT (Fetch a row by its Primary Key)
let mut user = User::find(42).await?;

// 2. UPDATE (Mutate properties and save changes)
user.name = "Venelouis".to_string();
user.save().await?;

// 3. CREATE (Instantiate a new struct and persist it)
let mut new_user = User::new();
new_user.name = "Guest User".to_string();
new_user.purchase_balance = 150.50;
new_user.save().await?; // Persists the row, automatically populating user_code

// 4. DELETE (Remove database row)
new_user.delete().await?;
\`\`\`
`
    },
    {
      id: 'queries',
      title: 'Chained Query Builder',
      icon: Layers,
      description: 'Execute advanced filters, sorting, offsets, complex selects, and secure SQL parameterization.',
      content: `### Methods Chaining (DSL)

The Query Builder offers full SQL expressiveness directly inside Rust's static type-safe environment:

\`\`\`rust
let posts = Post::query()
    .where("status", "=", "published")
    .where_not_null("banner_url")
    .where_in("category_id", vec![1, 2, 5])
    .order_by("publish_date", "DESC")
    .limit(15)
    .offset(30)
    .get()
    .await?;
\`\`\`

### SQL Injection Prevention

All filters specified in the Query Builder translate under the hood to parameters of fully prepared database statements (\`$1\`, \`$2\`...), providing solid protection against malicious SQL injections.

\`\`\`rust
// 100% secure! Compiled as: SELECT * FROM users WHERE email = $1
let untrusted_input = get_user_input();
let user = User::query()
    .where("email", "=", untrusted_input)
    .first()
    .await?;
\`\`\`

### Fast Aggregations

\`\`\`rust
let total_sales = Product::query().sum("price").await?;
let max_price = Product::query().max("price").await?;
let total_users = User::query().count().await?;
\`\`\`
`
    },
    {
      id: 'enterprise',
      title: 'Enterprise production',
      icon: Cpu,
      description: 'Leverage database replication read/write split pools, native Redis caching layers, and lazy memory chunking.',
      content: `### Redis Caching Layer

Avoid hammering database connections with repetitive querying on static database entries:

\`\`\`rust
// Automatically caches lookups inside Redis for 120 seconds
let settings = Configs::query()
    .where("group", "=", "global")
    .cache(120) 
    .get()
    .await?;
\`\`\`

### Reading & Writing Pool Splitting

High-throughput applications depend on read-replicas. Rullst splits write pools (INSERT, UPDATE) from read-only pools automatically:

\`\`\`rust
// Configuration inside your .env parameters:
# WRITE_DB_URL="postgres://primary@host/db"
# READ_DB_URL="postgres://replica@host/db"

// Rullst automatically redirects read methods (.get, .first, .count)
// to your replicas, reserving primary pool databases for writes!
\`\`\`

### Huge Dataset Iterations (Chunking)

Process millions of records in lazy memory-safe batches without hitting maximum RAM server allocations:

\`\`\`rust
Post::query()
    .where("processed", "=", false)
    .chunk(1000, |posts_chunk| {
        for mut post in posts_chunk {
            post.processed = true;
            // High efficiency execution loops
            post.save().await.unwrap();
        }
    })
    .await?;
\`\`\`
`
    }
  ];

  // Helper filter search
  const filteredTopics = searchQuery.trim() === ''
    ? topics
    : topics.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-4xl bg-zinc-950 h-full flex flex-col border-l border-zinc-90 w bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-2xl z-10 animate-in slide-in-from-right duration-350">
        
        {/* Detail Panel Head */}
        <div className="px-6 py-5 bg-zinc-900/40 border-b border-zinc-850 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-orange-600/15 flex items-center justify-center text-orange-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-white text-lg leading-normal">Rullst ORM Documentation</h3>
              <p className="text-xs text-zinc-400">Modeling and reference guide for the Rust database library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Outer search layout bar */}
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-850 flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across documentation topics..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs py-2 pl-9 pr-3 text-white focus:border-orange-500 outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Lower Main View Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Quick Chapters Tree - Left side inside drawer */}
          <div className="w-1/3 border-r border-zinc-850/60 h-full overflow-y-auto p-4 space-y-1 bg-zinc-950/30 shrink-0">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2 block mb-2">Main Explanations</span>
            {filteredTopics.map((topic) => {
              const Icon = topic.icon;
              const isSelected = activeTab === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTab(topic.id as any)}
                  className={`w-full flex items-center space-x-2 px-3 py-3 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="flex-1 truncate">{topic.title}</span>
                  <ChevronRight className={`h-3 w-3 shrink-0 opacity-40 transition-transform ${isSelected ? 'translate-x-0.5 opacity-90' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Current Page Content Viewer - Right side */}
          <div className="flex-1 h-full overflow-y-auto p-6 bg-zinc-950/40 text-zinc-200 select-text">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 space-y-3">
                <Search className="h-10 w-10 mx-auto text-zinc-650" />
                <p className="text-sm">No results found for "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="text-xs text-orange-400 hover:underline cursor-pointer">Clear search</button>
              </div>
            ) : (
              (() => {
                const currentTopic = topics.find(t => t.id === activeTab) || topics[0];
                return (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-display font-medium text-white tracking-tight">{currentTopic.title}</h4>
                      <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed font-sans">{currentTopic.description}</p>
                    </div>

                    {/* Simple parser for custom MD style inside react without full bulky engine */}
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed space-y-5 font-sans">
                      {parseMarkdown(currentTopic.content).map((block, bIdx) => {
                        if (block.type === 'heading') {
                          return (
                            <h5 key={bIdx} className="text-xs font-bold uppercase tracking-widest text-orange-500 pt-4 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                              <Hash className="h-4 w-4 shrink-0 text-zinc-550" />
                              {block.text}
                            </h5>
                          );
                        }

                        if (block.type === 'code') {
                          return (
                            <div key={bIdx} className="bg-[#010409] border border-zinc-800/85 rounded-xl overflow-hidden shadow-md my-4">
                              <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-850 font-mono text-[10px] text-zinc-500 font-extrabold uppercase">
                                {block.lang === 'toml' ? 'Cargo.toml' : block.lang === 'bash' ? 'CLI execution' : 'Rust snippet'}
                              </div>
                              <div className="p-4 overflow-x-auto bg-[#010409]">
                                <CodeHighlight code={block.code} language={block.lang as any} />
                              </div>
                            </div>
                          );
                        }

                        // Check inline code backticks highlight
                        const parts = block.text.split('`');
                        if (parts.length > 1) {
                          return (
                            <p key={bIdx} className="text-zinc-300 leading-relaxed">
                              {parts.map((part, partIdx) => {
                                if (partIdx % 2 === 1) {
                                  return (
                                    <code key={partIdx} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-orange-400 font-mono text-xs font-semibold">
                                      {part}
                                    </code>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        }

                        return <p key={bIdx} className="text-zinc-300 leading-relaxed">{block.text}</p>;
                      })}
                    </div>
                  </div>
                );
              })()
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
