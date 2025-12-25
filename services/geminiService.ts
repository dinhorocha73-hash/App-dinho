
import { GoogleGenAI } from "@google/genai";
import { LotteryType, PredictionData } from "../types";

export class JBService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  async analyzeLottery(lottery: LotteryType, targetDate: string): Promise<PredictionData> {
    const isPastDate = new Date(targetDate).toDateString() !== new Date().toDateString();
    
    const prompt = `
      Atue como um Engenheiro Estatístico Sênior especializado em loterias brasileiras (Jogo do Bicho).
      Seu objetivo é prever as Milhares (4 dígitos) MAIS PROVÁVEIS de saírem no PRÓXIMO HORÁRIO da loteria "${lottery}" para o dia ${targetDate}.

      DIRETRIZES TÉCNICAS:
      1. FONTE DE DADOS: Use o Google Search para extrair o histórico COMPLETO de resultados recentes nos sites "Resultado Fácil" (resultadofacil.com.br) e "Deu no Poste" (deunoposte.com.br).
      2. ANÁLISE DE ATRASO: Identifique milhares, centenas e dezenas que não aparecem há mais de 30 sorteios. Estes são candidatos "quentes".
      3. ANÁLISE DE FREQUÊNCIA: Identifique o "comportamento da banca" - quais dezenas estão saindo repetidamente nos últimos 3 dias.
      4. PREVISÃO DO PRÓXIMO HORÁRIO: Com base no histórico do dia ${targetDate} (ou dias anteriores se for o primeiro horário do dia), calcule as 5 melhores milhares para serem jogadas no próximo horário disponível.
      
      ${isPastDate ? `MODO BACKTEST: Analise APENAS os dados que existiam ANTES de ${targetDate} para sugerir o que seria jogado NAQUELA DATA específica.` : `MODO REAL-TIME: Analise os resultados de hoje até o momento para prever o próximo sorteio.`}

      REQUISITOS DE SAÍDA (JSON):
      - thousands: Array de 5 strings (ex: "1234") com as milhares mais prováveis.
      - hundreds: Array de 5 strings (ex: "234") derivadas das milhares sugeridas.
      - tens: Array de 5 strings (ex: "34") focando na cabeça (1º prêmio).
      - groups: Array de 3 nomes de bichos (ex: "Avestruz").
      - reasoning: Explicação técnica detalhando por que estas milhares foram escolhidas (ex: "A milhar 4567 não sai há 12 dias no Rio e a dezena 67 está em ciclo de retorno").
      - delayedNumbers: Array de objetos {number: string, days: number} com os top 5 mais atrasados encontrados.

      Retorne APENAS o JSON estruturado.
    `;

    try {
      // Re-initialize to ensure we have the correct API context
      const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        ?.map(chunk => ({
          title: chunk.web?.title || "Fonte de Dados",
          uri: chunk.web?.uri || "#"
        })) || [];

      return {
        ...result,
        sources
      };
    } catch (error) {
      console.error("Erro na análise preditiva:", error);
      throw new Error("O robô encontrou uma instabilidade nos dados. Verifique sua conexão e tente novamente.");
    }
  }
}
