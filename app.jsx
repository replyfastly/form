import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Zap, Download, Copy, Check } from 'lucide-react';

export default function ReplyFastlyValidationSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [contactInfo, setContactInfo] = useState({ whatsapp: '+55', name: '', country: 'BR' });

  const countryPrefixes = {
    'BR': '+55',
    'PT': '+351',
    'ES': '+34',
    'AU': '+61',
    'IN': '+91',
    'OTHER': '+'
  };

  const handleCountryChange = (newCountry) => {
    setContactInfo({
      ...contactInfo,
      country: newCountry,
      whatsapp: countryPrefixes[newCountry]
    });
  };
  const [copied, setCopied] = useState(false);

  const questions = [
    {
      id: 'q1',
      question: 'Como você gerencia conversas com clientes hoje?',
      type: 'single',
      options: [
        { id: 'a', text: 'Eu mesma respondo tudo', value: 'self_manage' },
        { id: 'b', text: 'Tenho alguém que ajuda', value: 'has_help' },
        { id: 'c', text: 'Uso alguma ferramenta', value: 'uses_tool' },
        { id: 'd', text: 'Outro', value: 'other', hasInput: true }
      ]
    },
    {
      id: 'q2',
      question: 'Qual o MAIOR problema em atender clientes pelo WhatsApp?',
      type: 'single',
      options: [
        { id: 'a', text: 'Não consigo responder rápido (perco clientes)', value: 'slow_response' },
        { id: 'b', text: 'Interrompe meu trabalho/vida pessoal', value: 'interruptions' },
        { id: 'c', text: 'Difícil agendar sem conflitos', value: 'scheduling' },
        { id: 'd', text: 'Clientes perguntam sempre a mesma coisa', value: 'repetitive' },
        { id: 'e', text: 'Outro', value: 'other', hasInput: true }
      ]
    },
    {
      id: 'q3',
      question: 'Você paga alguém para atender por você?',
      type: 'single',
      options: [
        { id: 'a', text: 'Sim', value: 'yes', hasInput: true, inputLabel: 'Quanto? (só número)' },
        { id: 'b', text: 'Não, mas gostaria', value: 'would_like' },
        { id: 'c', text: 'Não, atendo eu mesma', value: 'no' },
        { id: 'd', text: 'Já tentei mas não deu certo', value: 'tried_failed' }
      ]
    },
    {
      id: 'q4',
      question: 'Se existisse uma assistente inteligente (IA) que respondesse seus clientes 24/7, agendasse automaticamente e nunca errasse, você usaria?',
      type: 'single',
      options: [
        { id: 'a', text: 'Com certeza', value: 'definitely' },
        { id: 'b', text: 'Talvez, depende do preço', value: 'depends_price' },
        { id: 'c', text: 'Não confio em IA', value: 'no_trust' },
        { id: 'd', text: 'Prefiro pessoa real', value: 'prefer_human' }
      ]
    },
    {
      id: 'q5',
      question: 'Quanto você pagaria por mês por isso?',
      type: 'single',
      options: [
        { id: 'a', text: 'R$ 0-50', value: '0-50' },
        { id: 'b', text: 'R$ 50-100', value: '50-100' },
        { id: 'c', text: 'R$ 100-200', value: '100-200' },
        { id: 'd', text: 'R$ 200-500', value: '200-500' },
        { id: 'e', text: 'R$ 500+', value: '500+' }
      ]
    },
    {
      id: 'q6',
      question: 'O que seria ESSENCIAL nessa ferramenta?',
      type: 'multiple',
      options: [
        { id: 'a', text: 'Responder perguntas básicas', value: 'auto_reply' },
        { id: 'b', text: 'Agendar sem conflitos', value: 'scheduling' },
        { id: 'c', text: 'Coletar informações do cliente antes', value: 'client_info' },
        { id: 'd', text: 'Nunca vazar minhas informações pessoais', value: 'privacy' },
        { id: 'e', text: 'Parecer que sou EU respondendo', value: 'personalization' },
        { id: 'f', text: 'Outro', value: 'other', hasInput: true }
      ]
    },
    {
      id: 'q7',
      question: 'Você testaria isso GRATUITAMENTE por 30 dias e me daria feedback?',
      type: 'single',
      options: [
        { id: 'a', text: 'Sim, quando estiver pronto me avise', value: 'yes_notify' },
        { id: 'b', text: 'Sim, mas só se for fácil de usar', value: 'yes_if_easy' },
        { id: 'c', text: 'Não tenho interesse', value: 'no_interest' }
      ]
    }
  ];

  const handleAnswer = (questionId, optionId, customValue) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question.type === 'single') {
      setAnswers({
        ...answers,
        [questionId]: { option: optionId, custom: customValue !== undefined ? customValue : answers[questionId]?.custom }
      });
    } else {
      const current = answers[questionId] || { options: {}, customs: {} };
      
      if (customValue === undefined) {
        const newOptions = { ...current.options, [optionId]: !current.options[optionId] };
        setAnswers({
          ...answers,
          [questionId]: { options: newOptions, customs: current.customs }
        });
      } else {
        const newCustoms = { ...current.customs, [optionId]: customValue };
        setAnswers({
          ...answers,
          [questionId]: { options: current.options, customs: newCustoms }
        });
      }
    }
  };

  const isAnswered = (questionId) => {
    const answer = answers[questionId];
    if (!answer) return false;
    
    const question = questions.find(q => q.id === questionId);
    if (question.type === 'single') {
      return !!answer.option;
    } else {
      return Object.values(answer.options || {}).some(v => v);
    }
  };

  const canGoNext = () => isAnswered(questions[currentQuestion].id);
  
  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getResultsData = () => {
    const q3 = answers['q3'];
    const q4 = answers['q4'];
    const q5 = answers['q5'];
    const q7 = answers['q7'];

    const paysForHelp = q3?.option === 'a';
    const wouldUse = q4?.option === 'a' || q4?.option === 'b';
    const goodPrice = q5?.option === 'c' || q5?.option === 'd' || q5?.option === 'e';
    const wantsToTest = q7?.option === 'a' || q7?.option === 'b';

    return { paysForHelp, wouldUse, goodPrice, wantsToTest };
  };

  const generateStructuredData = () => {
    const timestamp = new Date().toISOString();
    const { paysForHelp, wouldUse, goodPrice, wantsToTest } = getResultsData();
    const score = [paysForHelp, wouldUse, goodPrice, wantsToTest].filter(Boolean).length;

    const structured = {
      metadata: {
        timestamp,
        respondent: {
          name: contactInfo.name || 'Não informado',
          whatsapp: contactInfo.whatsapp || 'Não informado',
          country: contactInfo.country
        },
        score,
        quality: score === 4 ? 'HOT_LEAD' : score === 3 ? 'WARM_LEAD' : score === 2 ? 'COLD_LEAD' : 'LOW_INTEREST'
      },
      responses: {}
    };

    questions.forEach(q => {
      const answer = answers[q.id];
      if (q.type === 'single' && answer?.option) {
        const opt = q.options.find(o => o.id === answer.option);
        structured.responses[q.id] = {
          question: q.question,
          answer: opt?.value || 'unknown',
          text: opt?.text,
          custom: answer.custom || null
        };
      } else if (q.type === 'multiple' && answer?.options) {
        const selected = Object.keys(answer.options).filter(k => answer.options[k]);
        structured.responses[q.id] = {
          question: q.question,
          answers: selected.map(optId => {
            const opt = q.options.find(o => o.id === optId);
            return {
              value: opt?.value,
              text: opt?.text,
              custom: answer.customs?.[optId] || null
            };
          })
        };
      }
    });

    return structured;
  };

  const generateWhatsAppMessage = () => {
    const data = generateStructuredData();
    let msg = `*REPLYFASTLY - Nova Resposta*\n\n`;
    msg += `📅 ${new Date(data.metadata.timestamp).toLocaleString('pt-BR')}\n`;
    msg += `🌍 ${data.metadata.country}\n`;
    msg += `📱 ${data.metadata.respondent.whatsapp}\n`;
    msg += `👤 ${data.metadata.respondent.name}\n`;
    msg += `⭐ Score: ${data.metadata.score}/4 (${data.metadata.quality})\n\n`;
    msg += `---\n\n`;

    questions.forEach((q, idx) => {
      const resp = data.responses[q.id];
      if (resp) {
        msg += `*${idx + 1}. ${q.question}*\n`;
        if (resp.answer) {
          msg += `→ ${resp.text}`;
          if (resp.custom) msg += ` (${resp.custom})`;
          msg += '\n';
        } else if (resp.answers) {
          resp.answers.forEach(ans => {
            msg += `✓ ${ans.text}`;
            if (ans.custom) msg += ` (${ans.custom})`;
            msg += '\n';
          });
        }
        msg += '\n';
      }
    });

    return encodeURIComponent(msg);
  };

  const sendViaWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    const phoneNumber = '5582999299818';
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank');
  };

  if (showResults) {
    const { paysForHelp, wouldUse, goodPrice, wantsToTest } = getResultsData();
    const score = [paysForHelp, wouldUse, goodPrice, wantsToTest].filter(Boolean).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-12 h-12 text-indigo-400" />
              <h1 className="text-4xl font-bold text-white">ReplyFastly</h1>
            </div>
            <p className="text-slate-300">Obrigado por suas respostas valiosas!</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Pontuação de Interesse</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded ${i <= score ? 'bg-emerald-400' : 'bg-slate-600'}`}
                />
              ))}
            </div>
            <p className="text-slate-200 text-sm">
              {score === 4 && "🔥 Perfil ideal! Você é exatamente nosso público-alvo."}
              {score === 3 && "✅ Muito promissor! Grande potencial de uso."}
              {score === 2 && "💡 Interessante. Há demanda mas precisa refinamento."}
              {score <= 1 && "📊 Obrigado pelo feedback. Vamos analisar."}
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Informações de contato (opcional)</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Seu nome"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={contactInfo.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BR">🇧🇷 Brasil</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Espanha</option>
                <option value="AU">🇦🇺 Austrália</option>
                <option value="IN">🇮🇳 Índia</option>
                <option value="OTHER">🌍 Outro</option>
              </select>
              <input
                type="text"
                placeholder="WhatsApp (com código do país)"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={sendViaWhatsApp}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-6 h-6" />
              ENVIAR RESPOSTA
            </button>

            <p className="text-center text-slate-400 text-sm">
              Suas respostas serão enviadas via WhatsApp de forma organizada
            </p>
          </div>

          <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-center">
            <p className="text-slate-300 text-sm">
              {wantsToTest ? '🎉 Você será avisada quando o ReplyFastly estiver pronto!' : 'Obrigado pelo seu tempo e feedback!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">ReplyFastly</h2>
              </div>
              <span className="text-slate-400 text-sm">
                {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option) => {
                const isSelected = currentQ.type === 'single'
                  ? currentAnswer?.option === option.id
                  : currentAnswer?.options?.[option.id];

                return (
                  <div key={option.id}>
                    <button
                      onClick={() => handleAnswer(currentQ.id, option.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-500/30 border-2 border-indigo-400'
                          : 'bg-slate-700/30 border-2 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {currentQ.type === 'single' ? (
                        isSelected ? (
                          <CheckCircle2 className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500 flex-shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-500 border-indigo-400' : 'border-slate-500'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      )}
                      <span className={`${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {option.text}
                      </span>
                    </button>

                    {option.hasInput && isSelected && (
                      <input
                        type="text"
                        placeholder={option.inputLabel || "Especifique..."}
                        value={currentQ.type === 'single' ? (currentAnswer?.custom || '') : (currentAnswer?.customs?.[option.id] || '')}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleAnswer(currentQ.id, option.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 ml-9 w-[calc(100%-2.25rem)] bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            
            <button
              onClick={goNext}
              disabled={!canGoNext()}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                canGoNext()
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ReplyFastlyValidationSurvey />);
