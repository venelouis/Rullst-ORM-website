/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code2, Braces, Plus, Trash2, Database, Info, RefreshCw } from 'lucide-react';
import CodeHighlight from './CodeHighlight';

type FilterType = 'where' | 'where_in' | 'where_null' | 'order_by' | 'limit' | 'cache';

interface QueryItem {
  id: string;
  type: FilterType;
  params: string[];
}

export default function InteractiveSandbox() {
  const [model, setModel] = useState<'User' | 'Post' | 'Product'>('User');
  const [queryItems, setQueryItems] = useState<QueryItem[]>([
    { id: '1', type: 'where', params: ['is_active', '=', 'true'] },
    { id: '2', type: 'order_by', params: ['created_at', 'DESC'] },
    { id: '3', type: 'limit', params: ['10'] }
  ]);

  const [rustOutput, setRustOutput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');

  // Fields catalog for user ease of simulation
  const FieldsCatalog = {
    User: ['id', 'name', 'email', 'is_active', 'role', 'created_at'],
    Post: ['id', 'title', 'slug', 'body', 'user_id', 'status', 'created_at'],
    Product: ['id', 'title', 'price', 'inventory', 'sku', 'created_at'],
  };

  const addQueryItem = (type: FilterType) => {
    let params: string[] = [];
    const fields = FieldsCatalog[model];
    switch (type) {
      case 'where':
        params = [fields[0] || 'id', '=', 'true'];
        break;
      case 'where_in':
        params = [fields[0] || 'id', '1, 2, 3'];
        break;
      case 'where_null':
        params = [fields[0] || 'id'];
        break;
      case 'order_by':
        params = [fields[0] || 'id', 'DESC'];
        break;
      case 'limit':
        params = ['10'];
        break;
      case 'cache':
        params = ['60'];
        break;
    }
    setQueryItems([...queryItems, { id: Date.now().toString(), type, params }]);
  };

  const removeQueryItem = (id: string) => {
    setQueryItems(queryItems.filter((item) => item.id !== id));
  };

  const updateParam = (id: string, index: number, value: string) => {
    setQueryItems(
      queryItems.map((item) => {
        if (item.id === id) {
          const newParams = [...item.params];
          newParams[index] = value;
          return { ...item, params: newParams };
        }
        return item;
      })
    );
  };

  // Reset query chain
  const resetQueries = () => {
    setQueryItems([
      { id: '1', type: 'where', params: ['is_active', '=', 'true'] },
      { id: '2', type: 'limit', params: ['10'] }
    ]);
  };

  // Re-generate code output on change
  useEffect(() => {
    // 1. Rust Code Generation
    let rust = `${model}::query()`;
    queryItems.forEach((item) => {
      switch (item.type) {
        case 'where':
          // check if numeric or boolean or standard value
          const val = item.params[2];
          const isNumOrBool = val === 'true' || val === 'false' || !isNaN(Number(val));
          const formattedVal = isNumOrBool ? val : `"${val}"`;
          rust += `\n    .where("${item.params[0]}", "${item.params[1]}", ${formattedVal})`;
          break;
        case 'where_in':
          const valuesArr = item.params[1].split(',').map(s => s.trim());
          const isNumIn = valuesArr.every(v => !isNaN(Number(v)));
          const arrStr = isNumIn 
            ? `vec![${valuesArr.join(', ')}]` 
            : `vec![${valuesArr.map(v => `"${v}"`).join(', ')}]`;
          rust += `\n    .where_in("${item.params[0]}", ${arrStr})`;
          break;
        case 'where_null':
          rust += `\n    .where_null("${item.params[0]}")`;
          break;
        case 'order_by':
          rust += `\n    .order_by("${item.params[0]}", "${item.params[1]}")`;
          break;
        case 'limit':
          rust += `\n    .limit(${item.params[0] || '10'})`;
          break;
        case 'cache':
          rust += `\n    .cache(${item.params[0] || '60'})`;
          break;
      }
    });
    rust += '\n    .get()\n    .await?;';
    setRustOutput(rust);

    // 2. SQL Code Generation
    const table = model.toLowerCase() + 's';
    let sql = `SELECT * FROM ${table}`;
    let whereClauses: string[] = [];
    let orderBy = '';
    let limit = '';
    let cacheComment = '';

    queryItems.forEach((item) => {
      switch (item.type) {
        case 'where':
          const sqlVal = isNaN(Number(item.params[2])) && item.params[2] !== 'true' && item.params[2] !== 'false'
            ? `'${item.params[2]}'`
            : item.params[2];
          whereClauses.push(`${item.params[0]} ${item.params[1]} ${sqlVal}`);
          break;
        case 'where_in':
          const sqlValues = item.params[1].split(',').map(s => {
            const trimmed = s.trim();
            return isNaN(Number(trimmed)) ? `'${trimmed}'` : trimmed;
          }).join(', ');
          whereClauses.push(`${item.params[0]} IN (${sqlValues})`);
          break;
        case 'where_null':
          whereClauses.push(`${item.params[0]} IS NULL`);
          break;
        case 'order_by':
          orderBy = ` ORDER BY ${item.params[0]} ${item.params[1]}`;
          break;
        case 'limit':
          limit = ` LIMIT ${item.params[0]}`;
          break;
        case 'cache':
          cacheComment = `-- Cached via Redis Cache layer for ${item.params[0]}s\n`;
          break;
      }
    });

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }
    sql += orderBy + limit + ';';
    
    setSqlOutput(cacheComment + sql);
  }, [model, queryItems]);

  return (
    <section id="playground" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Code2 className="h-4 w-4" />
            <span>Interactive Workspace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight text-glow-orange">
            Query Builder Playground
          </h2>
          <p className="text-zinc-400 mt-4 leading-relaxed text-sm md:text-base font-sans">
            Configure seu modelo e adicione filtros de forma visual. Veja instantaneamente o código Rust gerado usando as macros da Rullst e a consulta SQL otimizada resultante.
          </p>
        </div>

        {/* Sandbox Board Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls - Left side (Span 5) */}
          <div className="lg:col-span-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-6 box-glow-orange">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <h3 className="font-display font-medium text-lg text-white">Configurar Query</h3>
              <button
                onClick={resetQueries}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/50 transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Resetar</span>
              </button>
            </div>

            {/* Model select */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Modelo Base (Struct)</label>
              <div className="grid grid-cols-3 gap-2">
                {(['User', 'Post', 'Product'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModel(m);
                      resetQueries();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                      model === m
                        ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 font-extrabold'
                        : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700/80'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Configured Queries List */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Filtros Correntes (Query DSL)</label>
              
              {queryItems.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl">
                  <p className="text-xs text-zinc-550">Nenhum filtro aplicado. Carrega todos os registros.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {queryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-3 bg-zinc-950/70 rounded-lg border border-zinc-900 group"
                    >
                      <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-orange-400 font-bold uppercase shrink-0">
                        {item.type.replace('_', ' ')}
                      </div>

                      {/* Dynamic Inputs based on type */}
                      <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                        {item.type === 'where' && (
                          <>
                            <select
                              value={item.params[0]}
                              onChange={(e) => updateParam(item.id, 0, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 focus:border-orange-500 outline-none cursor-pointer"
                            >
                              {FieldsCatalog[model].map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                            <select
                              value={item.params[1]}
                              onChange={(e) => updateParam(item.id, 1, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-1 py-1 focus:border-orange-500 outline-none cursor-pointer"
                            >
                              <option value="=">=</option>
                              <option value="&gt;">&gt;</option>
                              <option value="&lt;">&lt;</option>
                              <option value="!=">!=</option>
                              <option value="LIKE">LIKE</option>
                            </select>
                            <input
                              type="text"
                              value={item.params[2]}
                              onChange={(e) => updateParam(item.id, 2, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 w-20 focus:border-orange-500 outline-none"
                            />
                          </>
                        )}

                        {item.type === 'where_in' && (
                          <>
                            <select
                              value={item.params[0]}
                              onChange={(e) => updateParam(item.id, 0, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 focus:border-orange-500 outline-none cursor-pointer"
                            >
                              {FieldsCatalog[model].map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                            <span className="text-zinc-500 text-xs">in</span>
                            <input
                              type="text"
                              value={item.params[1]}
                              onChange={(e) => updateParam(item.id, 1, e.target.value)}
                              placeholder="1,2,3"
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 w-24 focus:border-orange-500 outline-none"
                            />
                          </>
                        )}

                        {item.type === 'where_null' && (
                          <select
                            value={item.params[0]}
                            onChange={(e) => updateParam(item.id, 0, e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 focus:border-orange-500 outline-none cursor-pointer"
                          >
                            {FieldsCatalog[model].map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        )}

                        {item.type === 'order_by' && (
                          <>
                            <select
                              value={item.params[0]}
                              onChange={(e) => updateParam(item.id, 0, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 focus:border-orange-500 outline-none cursor-pointer"
                            >
                              {FieldsCatalog[model].map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                            <select
                              value={item.params[1]}
                              onChange={(e) => updateParam(item.id, 1, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-1.5 py-1 focus:border-orange-500 outline-none cursor-pointer"
                            >
                              <option value="ASC">ASC</option>
                              <option value="DESC">DESC</option>
                            </select>
                          </>
                        )}

                        {item.type === 'limit' && (
                          <input
                            type="number"
                            value={item.params[0]}
                            onChange={(e) => updateParam(item.id, 0, e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 w-16 focus:border-orange-500 outline-none"
                          />
                        )}

                        {item.type === 'cache' && (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={item.params[0]}
                              onChange={(e) => updateParam(item.id, 0, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white px-2 py-1 w-16 focus:border-orange-500 outline-none"
                            />
                            <span className="text-zinc-500 text-[11px]">segundos de cache Redis</span>
                          </div>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeQueryItem(item.id)}
                        className="text-zinc-500 hover:text-rose-500 p-1 rounded hover:bg-zinc-900 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remover filtro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add action buttons */}
            <div className="space-y-2 pt-4 border-t border-zinc-850">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Adicionar Filtro</span>
              <div className="grid grid-cols-2 gap-2">
                {(['where', 'where_in', 'where_null', 'order_by', 'limit', 'cache'] as const).map((type) => {
                  // Disable if duplicate for limit/cache or order_by
                  const isDuplicate = (type === 'limit' || type === 'cache') && queryItems.some(i => i.type === type);
                  return (
                    <button
                      key={type}
                      disabled={isDuplicate}
                      onClick={() => addQueryItem(type)}
                      className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                        isDuplicate
                          ? 'bg-zinc-950 border-zinc-900 text-zinc-650 cursor-not-allowed'
                          : 'bg-zinc-900 border-zinc-800/80 text-zinc-300 hover:bg-zinc-950 hover:border-zinc-700 cursor-pointer'
                      }`}
                    >
                      <Plus className="h-3 w-3 text-orange-500" />
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Code outputs - Right side (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Rust Output panel */}
            <div className="bg-[#010409] border border-zinc-800/85 rounded-xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Braces className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-semibold text-zinc-400 font-mono">rullst_dsl_code.rs</span>
                </div>
                <div className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Rullst ORM syntax
                </div>
              </div>
              <div className="p-4 bg-[#010409] font-mono text-sm leading-relaxed max-h-[220px] overflow-y-auto">
                <CodeHighlight code={rustOutput} language="rust" />
              </div>
            </div>

            {/* SQL Output panel */}
            <div className="bg-[#010409] border border-zinc-800/85 rounded-xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-zinc-400 font-mono">compiled_query.sql</span>
                </div>
                <div className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Target: SQL Database
                </div>
              </div>
              <div className="p-4 bg-[#010409] font-mono text-sm leading-relaxed max-h-[160px] overflow-y-auto">
                <CodeHighlight code={sqlOutput} language="sql" />
              </div>
            </div>

            {/* Playground hint banner */}
            <div className="p-4 bg-zinc-900/10 border border-zinc-800 rounded-xl flex items-start space-x-3">
              <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Você Sabia?</p>
                <p className="text-xs text-zinc-400 leading-normal font-sans">
                  Chamar o método <code className="font-mono text-xs text-orange-400">.cache(60)</code> ativa a inteligência de caching direto no Redis. Se a rota possuir cache, o driver interceptará a consulta antes do banco e lerá o cache em microssegundos, idêntico aos robustos caching drivers do Laravel!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
