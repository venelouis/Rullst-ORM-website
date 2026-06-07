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
      title: 'Padrão ActiveRecord Real',
      desc: 'Diga adeus a sintaxes extensas de query builders burocráticos. Instancie seu Struct em Rust, preencha as variáveis e chame diretamente `.save().await?` ou `.delete().await?`. Praticidade máxima.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Cpu,
      title: 'Zero Runtime Overhead',
      desc: 'Construído inteiramente sobre as poderosas macros procedurais do Rust. Toda a inteligência de mapeamento e rotulagem é compilada estaticamente. Latência de execução absoluta de 0ms.',
      color: 'from-rose-500 to-orange-500'
    },
    {
      icon: ShieldCheck,
      title: 'Proteção SQL Parametrizada',
      desc: 'Proteção inabalável contra SQL Injection. O motor do Rullst traduz cada argumento em prepared statements parametrizados do driver sqlx base, mantendo sua aplicação sempre blindada.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Redis Caching Integrado',
      desc: 'Acelere rotas repetitivas chamando o método encadeável `.cache(segundos)`. O Rullst lida com a interceptação e expiração automática dos dados no Redis em microssegundos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Connection Splitting (R/W)',
      desc: 'Escalonamento empresarial nativo. Divida de forma transparente conexões de Escrita (para servidores primários) e conexões de Leitura (para réplicas secundárias) sem alterar uma linha de código.',
      color: 'from-purple-500 to-rose-500'
    },
    {
      icon: HardDrive,
      title: 'Drivers Dinâmicos Universais',
      desc: 'Um único binário pode conectar-se de forma dinâmica a bases PostgreSQL, MySQL ou instâncias leves de SQLite local sem a necessidade de recompilar com flags de features exaustivas.',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  const comparisonData = [
    {
      criterion: 'Curva de Aprendizado',
      rullst: 'Baixíssima (Inspirado no Eloquent)',
      diesel: 'Alta (Exige DSL complexa)',
      seaorm: 'Média (Entity paradigm denso)',
      sqlx: 'Baixa (Apenas SQL puro)'
    },
    {
      criterion: 'Produtividade (Boilerplate)',
      rullst: 'Excelente (Menos linhas de código)',
      diesel: 'Baixa (Escreve arquivos schema.rs)',
      seaorm: 'Média (Múltiplas camadas de trait)',
      sqlx: 'Baixa (Precisa mapear structs manualmente)'
    },
    {
      criterion: 'Ergonomia Active Record',
      rullst: 'Sim, nativa e expressiva',
      diesel: 'Não (Somente Query DSL)',
      seaorm: 'Não (Datamapper stricto-sensu)',
      sqlx: 'Não'
    },
    {
      criterion: 'Suporte a Cache (Redis) nativo',
      rullst: 'Sim, encadeado via .cache()',
      diesel: 'Não (Exige lib customizada)',
      seaorm: 'Não',
      sqlx: 'Não'
    },
    {
      criterion: 'Velocidade de Compilação',
      rullst: 'Rápida (Inference estática leve)',
      diesel: 'Lenta (Forte acoplamento de tipos)',
      seaorm: 'Lenta (Macros procedurais gigantes)',
      sqlx: 'Extremamente rápida'
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
            <span>Por que escolher o Rullst</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight text-glow-orange">
            Arquitetura Poderosa. Ergonomia Imbatível.
          </h2>
          <p className="text-zinc-400 mt-4 leading-relaxed text-sm md:text-base font-sans font-normal">
            O Rullst une o melhor de dois mundos: elimina a rigidez e complexidade excessiva de ORMs de Rust convencionais enquanto mantém a velocidade bruta e segurança estática da linguagem.
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
            Comparativo entre ORMs de Rust
          </h3>
          <p className="text-zinc-500 text-xs mt-2">
            Veja a diferença de arquitetura e ergonomia prática no desenvolvimento diário
          </p>
        </div>

        {/* Comparison grid matrix */}
        <div className="max-w-4xl mx-auto bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-900">
                  <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Critério</th>
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
