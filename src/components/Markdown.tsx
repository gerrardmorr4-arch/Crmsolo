import React from 'react';

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  // Split content into blocks
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed text-base">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Header h3
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h3 id={id} key={blockIdx} className="font-display font-bold text-xl text-primary mt-6 mb-2 scroll-mt-28">
              {text}
            </h3>
          );
        }

        // Header h4
        if (trimmed.startsWith('#### ')) {
          const text = trimmed.replace('#### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h4 id={id} key={blockIdx} className="font-display font-semibold text-lg text-primary mt-4 mb-2 scroll-mt-28">
              {text}
            </h4>
          );
        }

        // Header h2
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h2 id={id} key={blockIdx} className="font-display font-extrabold text-2xl text-primary mt-8 mb-3 pb-1 border-b border-gray-100 scroll-mt-28">
              {text}
            </h2>
          );
        }

        // Dividers
        if (trimmed === '---') {
          return <hr key={blockIdx} className="border-gray-200 my-6" />;
        }

        // Bullet lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const lines = trimmed.split('\n');
          return (
            <ul key={blockIdx} className="list-disc list-outside pl-5 space-y-2 my-3">
              {lines.map((line, lineIdx) => {
                const itemText = line.replace(/^[\*\-]\s+/, '');
                return <li key={lineIdx} className="text-gray-600">{parseInlineStyles(itemText)}</li>;
              })}
            </ul>
          );
        }

        // Numbered lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <ol key={blockIdx} className="list-decimal list-outside pl-5 space-y-2 my-3">
              {lines.map((line, lineIdx) => {
                const itemText = line.replace(/^\d+\.\s+/, '');
                return <li key={lineIdx} className="text-gray-600">{parseInlineStyles(itemText)}</li>;
              })}
            </ol>
          );
        }

        // Tables
        if (trimmed.startsWith('|')) {
          const lines = trimmed.split('\n');
          const rows = lines.filter(l => l.trim() && !l.includes(':---') && !l.includes('---:'));
          
          return (
            <div key={blockIdx} className="overflow-x-auto my-6 border border-gray-100 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rows.map((row, rowIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
                    const isHeader = rowIdx === 0;
                    
                    return (
                      <tr key={rowIdx} className={isHeader ? 'bg-gray-50' : 'hover:bg-gray-50/50'}>
                        {cells.map((cell, cellIdx) => {
                          const CellTag = isHeader ? 'th' : 'td';
                          return (
                            <CellTag 
                              key={cellIdx} 
                              className={`px-4 py-3 text-left ${
                                isHeader ? 'text-xs font-bold text-gray-500 uppercase font-mono' : 'text-gray-600'
                              }`}
                            >
                              {parseInlineStyles(cell)}
                            </CellTag>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Paragraph fallback
        return (
          <p key={blockIdx} className="leading-relaxed">
            {parseInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Simple bold / italic parser
function parseInlineStyles(text: string): React.ReactNode[] {
  // Regex match bold **text** or code `text`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-red-600">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
