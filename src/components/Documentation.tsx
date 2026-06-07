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

export default function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [activeTab, setActiveTab] = useState<'quick_start' | 'models' | 'queries' | 'enterprise'>('quick_start');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const topics = [
    {
      id: 'quick_start',
      title: 'Guia de Início Rápido',
      icon: Rocket,
      description: 'Aprenda a instalar, configurar o banco de dados e rodar seu primeiro código rullst.',
      content: `### Instalação

Adicione o **Rullst ORM** ao seu arquivo \`Cargo.toml\`. Ele exige suporte assíncrono (geralmente Tokio) e os recursos de driver correspondentes do sqlx:

\`\`\`toml
[dependencies]
rullst_orm = "0.1.0"
tokio = { version = "1.35", features = ["full"] }
chrono = { version = "0.4", features = ["serde"] }
serde = { version = "1.0", features = ["derive"] }
\`\`\`

### Variáveis de Ambiente

Crie um arquivo \`.env\` na raiz do seu projeto contendo a string de conexão do seu banco de dados. O Rullst suporta dinamicamente PostgreSQL, MySQL e SQLite:

\`\`\`bash
# Exemplo PostgreSQL:
DATABASE_URL="postgres://postgres:password@localhost:5473/minha_db"

# Exemplo SQLite (Local de ultra rapidez):
# DATABASE_URL="sqlite://local_store.db"
\`\`\`

### Inicialização do Driver

Defina o pool de conexão do Rullst no início da sua função primordial:

\`\`\`rust
use rullst_orm::prelude::*;

#[tokio::main]
async fn main() -> Result<(), RullstError> {
    // Configura e conecta os pools dinâmicos globais
    Rullst::connect().await?;
    
    println!("Rullst ORM conectado com sucesso!");
    Ok(())
}
\`\`\`
`
    },
    {
      id: 'models',
      title: 'Modelos ActiveRecord',
      icon: Code,
      description: 'Como declarar seus Structs Rust e conectá-los a tabelas usando macros procedurais.',
      content: `### Definindo Structs

Os modelos usam a macro procedural \`#[derive(ActiveRecord)]\`. Por padrão, Rullst assume que a tabela é o plural do nome do struct em letra minúscula e a chave primária é \`id\`.

\`\`\`rust
use rullst_orm::prelude::*;

#[derive(ActiveRecord, Debug, Clone)]
#[table = "usuarios_vip"]          // Sobrescreve o nome da tabela
#[primary_key = "codigo_usuario"] // Sobrescreve a chave primária
pub struct User {
    pub codigo_usuario: i32,
    pub nome: String,
    pub saldo_compras: f64,
}
\`\`\`

### Operações CRUD Básicas

Com o padrão ActiveRecord, você gerencia registros diretamente nas instâncias recuperadas ou geradas:

\`\`\`rust
// 1. SELECT (Buscar por Chave Primária)
let mut user = User::find(42).await?;

// 2. UPDATE (Modificar propriedades e Salvar)
user.nome = "Thiago Venelouis".to_string();
user.save().await?;

// 3. CREATE (Instanciar e persistir)
let mut novo = User::new();
novo.nome = "Visitante".to_string();
novo.saldo_compras = 150.50;
novo.save().await?; // Cria o registro e popula a propriedade codigo_usuario

// 4. DELETE (Remover registro)
novo.delete().await?;
\`\`\`
`
    },
    {
      id: 'queries',
      title: 'Query Builder Encadeado',
      icon: Layers,
      description: 'Buscas parrudas, filtros encadeados, ordenações, selects complexas e prevenção de injeção de SQL.',
      content: `### Encadeamento de Métodos (DSL)

O Query Builder traz flexibilidade completa para buscas dinâmicas com tipagem estática do Rust:

\`\`\`rust
let posts = Post::query()
    .where("status", "=", "publicado")
    .where_not_null("banner_url")
    .where_in("categoria_id", vec![1, 2, 5])
    .order_by("data_publicacao", "DESC")
    .limit(15)
    .offset(30)
    .get()
    .await?;
\`\`\`

### Prevenção de SQL Injection

Todas as cláusulas do Query Builder compilam internamente em **Prepared Statements** parametrizados do driver sqlx (\`$1\`, \`$2\`...), impedindo brechas de injeção acidental.

\`\`\`rust
// 100% seguro! Traduzido para: SELECT * FROM users WHERE email = $1
let email_usuario = obter_entrada_usuario();
let user = User::query()
    .where("email", "=", email_usuario)
    .first()
    .await?;
\`\`\`

### Agregações Rápidas

\`\`\`rust
let total_vendas = Product::query().sum("valor").await?;
let maior_preco = Product::query().max("valor").await?;
let qtde_usuarios = User::query().count().await?;
\`\`\`
`
    },
    {
      id: 'enterprise',
      title: 'Enterprise & Performance',
      icon: Cpu,
      description: 'Conectividade balanceada de Leitura/Escrita, caching nativo em Redis, paginação em chunks e multi-tenancy.',
      content: `### Redis Caching Layer

Evite sobrecarregar seu banco de dados com buscas repetitivas em tabelas estáticas:

\`\`\`rust
// Faz o cacheamento por 120 segundos no Redis
let configuracoes = Configs::query()
    .where("grupo", "=", "global")
    .cache(120) 
    .get()
    .await?;
\`\`\`

### Divisão de Pools de Leitura e Escrita (Read/Write Splitting)

Bancos de dados de grande escala utilizam réplicas de leitura. Configurar o Rullst para separar queries de escrita (INSERT, UPDATE) de réplicas de leitura simples é automático:

\`\`\`rust
// No .env:
# WRITE_DB_URL="postgres://principal@host/db"
# READ_DB_URL="postgres://replica@host/db"

// O Rullst direciona consultas de leitura (.get, .first, .count)
// automaticamente para o pool replica, e operações de mutação para o principal!
\`\`\`

### Processamento de Cláusulas em Lote (Chunking)

Útil para iterar sobre milhões de linhas sem estourar a memória (RAM) do seu servidor em Rust:

\`\`\`rust
Post::query()
    .where("processado", "=", false)
    .chunk(1000, |posts_chunk| {
        for mut post in posts_chunk {
            post.processado = true;
            // Executa eficientemente
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
              <h3 className="font-display font-medium text-white text-lg leading-normal">Documentação Rullst ORM</h3>
              <p className="text-xs text-zinc-400">Guia de modelagem e referência da biblioteca Rust</p>
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
              placeholder="Pesquisar nos tópicos de documentação..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs py-2 pl-9 pr-3 text-white focus:border-orange-500 outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Lower Main View Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Quick Chapters Tree - Left side inside drawer */}
          <div className="w-1/3 border-r border-zinc-850/60 h-full overflow-y-auto p-4 space-y-1 bg-zinc-950/30 shrink-0">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2 block mb-2">Seções Principais</span>
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
                <p className="text-sm">Nenhum resultado para "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="text-xs text-orange-400 hover:underline cursor-pointer">Limpar pesquisa</button>
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
                      {currentTopic.content.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is heading
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h5 key={pIdx} className="text-xs font-bold uppercase tracking-widest text-orange-500 pt-4 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                              <Hash className="h-4 w-4 shrink-0 text-zinc-550" />
                              {paragraph.replace('### ', '')}
                            </h5>
                          );
                        }

                        // Check if paragraph is code block
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n');
                          const lang = lines[0].replace('```', '') || 'rust';
                          const codeText = lines.slice(1, -1).join('\n');
                          return (
                            <div key={pIdx} className="bg-[#010409] border border-zinc-800/85 rounded-xl overflow-hidden shadow-md my-4">
                              <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-850 font-mono text-[10px] text-zinc-500 font-extrabold uppercase">
                                {lang === 'toml' ? 'Cargo.toml' : lang === 'bash' ? 'CLI execution' : 'Rust snippet'}
                              </div>
                              <div className="p-4 overflow-x-auto bg-[#010409]">
                                <CodeHighlight code={codeText} language={lang as any} />
                              </div>
                            </div>
                          );
                        }

                        // Check inline code backticks highlight
                        const parts = paragraph.split('`');
                        if (parts.length > 1) {
                          return (
                            <p key={pIdx} className="text-zinc-300 leading-relaxed">
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

                        return <p key={pIdx} className="text-zinc-300 leading-relaxed">{paragraph}</p>;
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
