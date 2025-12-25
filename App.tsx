
import React, { useState } from 'react';
import { LotteryType, PredictionData } from './types';
import { JBService } from './services/geminiService';
import PredictionDisplay from './components/PredictionDisplay';

const LOTTERIES: LotteryType[] = [
  'Rio de Janeiro',
  'Look de Goiás',
  'Nacional',
  'Bahia',
  'São Paulo',
  'Lotep',
  'Popular'
];

const PARTNER_LINKS = [
  {
    name: "Ellite Apostas",
    url: "https://app.elliteapostas.org/?p=FpeFsgEd",
    color: "bg-green-600 hover:bg-green-500",
    icon: "🎰"
  },
  {
    name: "B2X Bet",
    url: "https://go.aff.b2x.bet.br/PromotorDinho",
    color: "bg-blue-600 hover:bg-blue-500",
    icon: "🔥"
  }
];

const App: React.FC = () => {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jbService = new JBService();

  const handleLotterySelect = async (lottery: LotteryType) => {
    setSelectedLottery(lottery);
    await triggerAnalysis(lottery, selectedDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (selectedLottery) {
      triggerAnalysis(selectedLottery, newDate);
    }
  };

  const triggerAnalysis = async (lottery: LotteryType, date: string) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const data = await jbService.analyzeLottery(lottery, date);
      setPrediction(data);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#050a0f] text-slate-200">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 border border-green-400/50">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-tech tracking-tighter text-white">ROBÔ <span className="text-green-500">JB DINHO</span></h1>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Inteligência Preditiva</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest mr-4">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isToday ? 'bg-green-500' : 'bg-yellow-500'}`}></span> 
              {isToday ? 'Análise em Tempo Real' : 'Modo Backtest'}
            </span>
          </div>
          {PARTNER_LINKS.map((link, idx) => (
            <a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white text-[10px] md:text-xs font-tech px-3 md:px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap`}
            >
              <span className="hidden sm:inline">{link.icon}</span> {link.name.split(' ')[0]}
            </a>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome / Intro */}
        {!selectedLottery && !prediction && (
          <div className="text-center mb-12 animate-in fade-in zoom-in duration-1000">
            <h2 className="text-4xl md:text-6xl font-tech text-white mb-6 leading-tight">
              ESTRATÉGIA <span className="text-green-500">CIENTÍFICA</span> <br />PARA O JOGO DO BICHO
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
              O Robô do Dinho analisa milhares de resultados para encontrar os padrões mais quentes do dia.
            </p>
          </div>
        )}

        {/* Date Selector and Controls */}
        <div className="max-w-4xl mx-auto mb-10 glass p-6 rounded-2xl border-white/5 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Data de Referência</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-tech focus:outline-none focus:border-green-500/50 transition-colors w-full md:w-64"
            />
          </div>
          <div className="hidden md:block w-px h-12 bg-white/5"></div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xs font-tech text-green-400 uppercase mb-1">Status do Analisador</h3>
            <p className="text-sm text-slate-400 italic">
              {isToday 
                ? "Buscando os resultados mais recentes de hoje nos sites Resultado Fácil e Deu no Poste." 
                : `Simulando análise estatística para o dia ${new Date(selectedDate).toLocaleDateString('pt-BR')}.`}
            </p>
          </div>
        </div>

        {/* Lottery Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-12">
          {LOTTERIES.map((lottery) => (
            <button
              key={lottery}
              onClick={() => handleLotterySelect(lottery)}
              disabled={isLoading}
              className={`
                relative overflow-hidden group py-4 px-2 rounded-xl transition-all duration-300 font-tech text-[10px] md:text-xs tracking-wider uppercase
                ${selectedLottery === lottery 
                  ? 'bg-green-600 text-white shadow-xl shadow-green-600/30 border border-green-400' 
                  : 'glass text-slate-400 hover:text-white hover:border-green-500/50 hover:bg-white/5'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-xl transition-transform group-hover:scale-125 duration-300">
                  {lottery === 'Rio de Janeiro' && '🏟️'}
                  {lottery === 'Look de Goiás' && '🌵'}
                  {lottery === 'Nacional' && '🇧🇷'}
                  {lottery === 'Bahia' && '🏖️'}
                  {lottery === 'São Paulo' && '🏙️'}
                  {lottery === 'Lotep' && '💰'}
                  {lottery === 'Popular' && '⭐️'}
                </span>
                {lottery}
              </div>
              {selectedLottery === lottery && (
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-transparent animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-green-500/10 border-t-green-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-green-500 font-tech text-lg animate-pulse uppercase tracking-tighter">
                  {isToday ? 'Processando Tempo Real...' : 'Reconstruindo Histórico...'}
                </p>
                <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  Consultando base de dados: {selectedLottery} | {selectedDate}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="glass border-red-500/30 p-10 rounded-3xl text-center max-w-lg mx-auto shadow-2xl shadow-red-900/10">
              <div className="w-20 h-20 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-tech text-red-400 mb-3">CONEXÃO INTERROMPIDA</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {error}. <br />Pode haver falta de dados para a data ou loteria escolhida.
              </p>
              <button 
                onClick={() => selectedLottery && handleLotterySelect(selectedLottery)}
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                RECONECTAR IA
              </button>
            </div>
          )}

          {prediction && selectedLottery && (
            <div className="space-y-12">
              {!isToday && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-yellow-400 text-xs text-center font-tech tracking-widest uppercase mb-6">
                  ⚠️ MODO TESTE DE EFICÁCIA: Sugestões geradas com base apenas nos dados anteriores a {new Date(selectedDate).toLocaleDateString('pt-BR')}.
                </div>
              )}
              <PredictionDisplay data={prediction} lotteryName={selectedLottery} />
              
              {/* Recommended Platforms Section */}
              <div className="glass p-8 rounded-3xl border-white/10 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-tech text-white mb-4 tracking-tighter uppercase">Onde Apostar com <span className="text-green-500">Confiança?</span></h3>
                <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
                  Aproveite as análises do Robô do Dinho e realize seus jogos nas plataformas parceiras com os melhores bônus e pagamentos garantidos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {PARTNER_LINKS.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link.color} group relative overflow-hidden text-white font-tech py-4 rounded-2xl transition-all shadow-xl shadow-black/50 active:scale-95 flex flex-col items-center justify-center gap-2`}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="uppercase tracking-widest text-sm">{link.name}</span>
                      <span className="text-[8px] opacity-70 uppercase font-bold">Apostar Agora</span>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !prediction && !error && !selectedLottery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-8">
              <div className="p-8 glass rounded-3xl border-white/5 hover:border-green-500/20 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📅</div>
                <h4 className="font-tech text-white text-sm mb-3 tracking-widest">HISTÓRICO FLEXÍVEL</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Selecione datas passadas para validar a assertividade do robô e entender os ciclos de atraso.</p>
              </div>
              <div className="p-8 glass rounded-3xl border-white/5 hover:border-green-500/20 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
                <h4 className="font-tech text-white text-sm mb-3 tracking-widest">BUSCA SEMÂNTICA</h4>
                <p className="text-xs text-slate-500 leading-relaxed">O robô lê os resultados do 'Resultado Fácil' e 'Deu no Poste' como um humano, mas com velocidade de processador.</p>
              </div>
              <div className="p-8 glass rounded-3xl border-white/5 hover:border-green-500/20 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">⚡</div>
                <h4 className="font-tech text-white text-sm mb-3 tracking-widest">PONTOS DE ATRASO</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Milhares e centenas que não aparecem há tempos entram no radar prioritário de nossa análise estatística.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 px-6 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
             <h2 className="text-lg font-tech text-white mb-2">ROBÔ <span className="text-green-500">JB DINHO</span></h2>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Powered by Gemini 3 Analysis Engine</p>
          </div>
          <div className="flex gap-8">
            <a href={PARTNER_LINKS[0].url} className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">Ellite</a>
            <a href={PARTNER_LINKS[1].url} className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">B2X Bet</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">Feedback</a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] text-slate-600 max-w-xs leading-tight">
              Aviso: Este robô é uma ferramenta de auxílio estatístico. Não garantimos ganhos financeiros. Jogue com moderação.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
