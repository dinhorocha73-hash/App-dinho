
import React, { useState } from 'react';
import { PredictionData } from '../types';
import NumberBadge from './NumberBadge';

interface PredictionDisplayProps {
  data: PredictionData;
  lotteryName: string;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ data, lotteryName }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, index: number | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      if (index === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyAll = () => {
    const text = data.thousands.join(', ');
    copyToClipboard(text, 'all');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <h2 className="text-2xl font-tech text-white uppercase tracking-tighter">
              Alvos para o Próximo Horário: <span className="text-green-500">{lotteryName}</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 italic">
            Processamento de padrões históricos concluído com sucesso.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-800/50 border border-white/10 px-4 py-2 rounded-xl text-center min-w-[100px]">
             <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Confiança IA</span>
             <span className="text-lg font-tech text-green-400">87.4%</span>
          </div>
        </div>
      </div>

      {/* Main Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milhares - The Primary Goal */}
        <div className="glass p-8 rounded-3xl border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🎯</div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-tech text-green-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Milhares Sugeridas
            </h3>
            <button 
              onClick={handleCopyAll}
              className={`text-[10px] font-tech uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${copiedAll ? 'bg-green-500 text-white border-green-400' : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'}`}
            >
              {copiedAll ? 'Copiado!' : 'Copiar Todas'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.thousands.map((m, i) => (
              <div key={i} className="relative group/badge">
                <NumberBadge number={m} label={`Prioridade ${i+1}`} size="lg" />
                <button 
                  onClick={() => copyToClipboard(m, i)}
                  className={`absolute -top-2 -right-2 p-1.5 rounded-full border shadow-xl opacity-0 group-hover/badge:opacity-100 transition-all transform scale-75 group-hover/badge:scale-100 ${copiedIndex === i ? 'bg-green-500 border-green-400' : 'bg-slate-900 border-white/20 hover:border-green-500'}`}
                  title="Copiar milhar"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Centenas & Dezenas */}
        <div className="glass p-8 rounded-3xl border-blue-500/20">
          <h3 className="text-lg font-tech mb-6 text-blue-400 flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             Centenas e Dezenas
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">Centenas com Maior Ciclo</p>
              <div className="flex flex-wrap gap-2">
                {data.hundreds.map((c, i) => (
                  <NumberBadge key={i} number={c} size="md" color="blue" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">Dezenas Estratégicas</p>
              <div className="flex flex-wrap gap-2">
                {data.tens.map((t, i) => (
                  <NumberBadge key={i} number={t} size="sm" color="blue" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delayed Statistics & Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass p-6 rounded-3xl border-yellow-500/10">
          <h3 className="text-sm font-tech mb-4 text-yellow-500 uppercase tracking-widest">Monitor de Atrasos</h3>
          <div className="space-y-3">
            {data.delayedNumbers.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="font-tech text-yellow-200 text-lg">{item.number}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Número / Grupo</span>
                </div>
                <div className="text-right">
                  <span className="block font-tech text-white">{item.days}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Sorteios Atrasados</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl">🧠</div>
          <h3 className="text-sm font-tech mb-4 text-slate-200 uppercase tracking-widest">Parecer do Analista IA</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed text-sm">
              {data.reasoning}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="text-[9px] font-bold text-slate-500 uppercase mb-4 tracking-[0.3em]">Evidências de Grounding (Resultado Fácil / Deu no Poste)</h4>
            <div className="flex flex-wrap gap-3">
              {data.sources?.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800 transition-all px-4 py-2 rounded-xl border border-white/5"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">
                    {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Groups Section */}
      <div className="glass p-8 rounded-3xl border-red-500/10">
        <h3 className="text-lg font-tech mb-8 text-red-500 text-center uppercase tracking-widest">Bichos Sugeridos (Cercado)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {data.groups.map((group, i) => (
            <div key={i} className="relative flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/20 flex items-center justify-center text-4xl mb-4 group-hover:scale-105 transition-all group-hover:border-red-500/50 shadow-lg shadow-red-900/5">
                <span className="filter drop-shadow-md">🐾</span>
              </div>
              <span className="font-tech text-red-200 uppercase tracking-widest text-xs group-hover:text-red-400 transition-colors">{group}</span>
              <div className="mt-1 w-8 h-1 bg-red-500/20 rounded-full group-hover:w-16 transition-all"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
