/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CodeHighlightProps {
  code: string;
  language: 'rust' | 'sql' | 'toml' | 'bash';
  id?: string;
}

export default function CodeHighlight({ code, language, id }: CodeHighlightProps) {
  // Simple syntax colorizer relying on HTML markup
  const highlightRust = (text: string) => {
    // List of tokens in order of matching priority
    const tokens = [
      // Comments
      { regex: /(\/\/.*)/g, type: 'comment' },
      // Attribute Macros e.g. #[derive(...)]
      { regex: /(#\[[^\]\n]+\])/g, type: 'attribute' },
      // Strings
      { regex: /("[^"\\]*(?:\\.[^"\\]*)*")/g, type: 'string' },
      // Numbers
      { regex: /\b(\d+)\b/g, type: 'number' },
      // Rust Keywords
      { regex: /\b(pub|struct|impl|use|let|mut|fn|async|await|match|return|self|super|for|in|where|as|dyn|static|const|mod|type)\b/g, type: 'keyword' },
      // Common Types
      { regex: /\b(String|i32|i64|f64|bool|NaiveDateTime|Option|Vec|Result|ActiveRecord|ActiveResult|Uuid|DateTime|Utc)\b/g, type: 'type' },
      // Active Record Builder method calls
      { regex: /(\.[a-zA-Z_0-9]+)(?=\()/g, type: 'method' },
      // Function names and macro names
      { regex: /\b([a-zA-Z_0-9]+!)(?=\s*[({])/g, type: 'macro' },
      { regex: /\b([a-zA-Z_0-9]+)(?=\s*\()/g, type: 'function' },
    ];

    // Build a map of matches to replace sequentially with placeholders to preserve structures
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const replacements: { [key: string]: string } = {};
    let keyCount = 0;

    // We tokenize using temporary tokens and then restore, protecting already highlighted parts
    tokens.forEach((token) => {
      html = html.replace(token.regex, (match, p1) => {
        const key = `___TOKEN_${keyCount++}___`;
        let className = '';
        switch (token.type) {
          case 'comment': className = 'text-neutral-500 italic'; break;
          case 'attribute': className = 'text-amber-500 font-medium'; break;
          case 'string': className = 'text-emerald-400'; break;
          case 'number': className = 'text-orange-400'; break;
          case 'keyword': className = 'text-rose-400 font-medium'; break;
          case 'type': className = 'text-cyan-400'; break;
          case 'method': className = 'text-blue-400 font-medium'; break;
          case 'macro': className = 'text-purple-400'; break;
          case 'function': className = 'text-sky-300'; break;
        }
        replacements[key] = `<span class="${className}">${match}</span>`;
        return key;
      });
    });

    // Restore tokens in reverse or normal order recursively
    let changed = true;
    while (changed) {
      const prevHtml = html;
      Object.keys(replacements).forEach((key) => {
        html = html.replace(key, replacements[key]);
      });
      changed = prevHtml !== html;
    }

    return html;
  };

  const highlightSql = (text: string) => {
    const tokens = [
      // Comments
      { regex: /(\-\-.*)/g, type: 'comment' },
      // Strings
      { regex: /('[^'\\]*(?:\\.[^'\\]*)*')/g, type: 'string' },
      // Numbers
      { regex: /\b(\d+)\b/g, type: 'number' },
      // SQL Keywords
      { regex: /\b(SELECT|FROM|WHERE|INNER\s+JOIN|LEFT\s+JOIN|ON|ORDER\s+BY|LIMIT|OFFSET|INSERT\s+INTO|VALUES|UPDATE|SET|DELETE|CREATE\s+TABLE|PRIMARY\s+KEY|UNIQUE|NOT\s+NULL|DEFAULT|REFERENCES|FOREIGN\s+KEY|AND|OR|IN|NULL|IS|AS|EXISTS|ANY|ALL)\b/gi, type: 'keyword' },
      // Data types
      { regex: /\b(BIGINT|INT|INTEGER|VARCHAR|TEXT|BOOLEAN|TIMESTAMP|UUID|SMALLINT|DECIMAL|NUMERIC)\b/gi, type: 'type' },
    ];

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const replacements: { [key: string]: string } = {};
    let keyCount = 0;

    tokens.forEach((token) => {
      // Use flag 'i' to match case insensitively if required, but match in place
      const regex = new RegExp(token.regex.source, 'gi');
      html = html.replace(regex, (match) => {
        const key = `___SQLTOKEN_${keyCount++}___`;
        let className = '';
        switch (token.type) {
          case 'comment': className = 'text-neutral-500 italic'; break;
          case 'string': className = 'text-emerald-400'; break;
          case 'number': className = 'text-amber-400'; break;
          case 'keyword': className = 'text-rose-400 font-bold'; break;
          case 'type': className = 'text-cyan-400'; break;
        }
        replacements[key] = `<span class="${className}">${match}</span>`;
        return key;
      });
    });

    let changed = true;
    while (changed) {
      const prevHtml = html;
      Object.keys(replacements).forEach((key) => {
        html = html.replace(key, replacements[key]);
      });
      changed = prevHtml !== html;
    }

    return html;
  };

  const highlightToml = (text: string) => {
    const tokens = [
      // Comments
      { regex: /(#.*)/g, type: 'comment' },
      // Headers
      { regex: /(\[[^\]\n]+\])/g, type: 'header' },
      // Values (strings)
      { regex: /("[^"]*")/g, type: 'value' },
      // Keys
      { regex: /\b([a-zA-Z_-]+)(?=\s*=)/g, type: 'key' },
    ];

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const replacements: { [key: string]: string } = {};
    let keyCount = 0;

    tokens.forEach((token) => {
      html = html.replace(token.regex, (match) => {
        const key = `___TOMLTOKEN_${keyCount++}___`;
        let className = '';
        switch (token.type) {
          case 'comment': className = 'text-neutral-500 italic'; break;
          case 'header': className = 'text-rose-400 font-bold'; break;
          case 'value': className = 'text-emerald-400'; break;
          case 'key': className = 'text-sky-300 font-medium'; break;
        }
        replacements[key] = `<span class="${className}">${match}</span>`;
        return key;
      });
    });

    let changed = true;
    while (changed) {
      const prevHtml = html;
      Object.keys(replacements).forEach((key) => {
        html = html.replace(key, replacements[key]);
      });
      changed = prevHtml !== html;
    }

    return html;
  };

  const highlightBash = (text: string) => {
    const tokens = [
      // Comments
      { regex: /(#.*)/g, type: 'comment' },
      // Commands
      { regex: /\b(cargo|rullst|docker|git|cd|npm)\b/g, type: 'command' },
      // Subcommands or flags
      { regex: /(-\w+|--\w+)/g, type: 'flag' },
    ];

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const replacements: { [key: string]: string } = {};
    let keyCount = 0;

    tokens.forEach((token) => {
      html = html.replace(token.regex, (match) => {
        const key = `___BASHTOKEN_${keyCount++}___`;
        let className = '';
        switch (token.type) {
          case 'comment': className = 'text-neutral-500 italic'; break;
          case 'command': className = 'text-rose-400 font-bold'; break;
          case 'flag': className = 'text-sky-400'; break;
        }
        replacements[key] = `<span class="${className}">${match}</span>`;
        return key;
      });
    });

    let changed = true;
    while (changed) {
      const prevHtml = html;
      Object.keys(replacements).forEach((key) => {
        html = html.replace(key, replacements[key]);
      });
      changed = prevHtml !== html;
    }

    return html;
  };

  let highlighted = code;
  if (language === 'rust') highlighted = highlightRust(code);
  else if (language === 'sql') highlighted = highlightSql(code);
  else if (language === 'toml') highlighted = highlightToml(code);
  else if (language === 'bash') highlighted = highlightBash(code);

  return (
    <pre id={id} className="font-mono text-xs md:text-sm leading-relaxed overflow-x-auto select-text text-neutral-200">
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
