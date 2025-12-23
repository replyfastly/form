const { useState } = React;

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    whatsapp: '+55',
    country: 'BR'
  });

  // WhatsApp do ReplyFastly para receber respostas
  const REPLYFASTLY_WHATSAPP = '5582999299818';

  const countries = [
    { code: 'BR', name: '🇧🇷 Brasil', phone: '+55' },
    { code: 'PT', name: '🇵🇹 Portugal', phone: '+351' },
    { code: 'ES', name: '🇪🇸 Espanha', phone: '+34' },
    { code: 'AU', name: '🇦🇺 Austrália', phone: '+61' },
    { code: 'IN', name: '🇮🇳 Índia', phone: '+91' },
    { code: 'OTHER', name: '🌍 Outro', phone: '+' }
  ];

  const questions = [
    {
      id: 'q1',
      text: 'Como você gerencia conversas com clientes hoje?',
      type: 'single',
      options: [
        { value: 'self_manage', label: 'Eu mesma respondo tudo' },
        { value: 'has_help', label: 'Tenho alguém que ajuda' },
        { value: 'uses_tool', label: 'Uso alguma ferramenta' },
        { value: 'other', label: 'Outro', hasInput: true }
      ]
    },
    {
      id: 'q2',
      text: 'Qual o MAIOR problema em atender clientes pelo WhatsApp?',
      type: 'single',
      options: [
        { value: 'slow_response', label: 'Não consigo responder rápido (perco clientes)' },
        { value: 'interruptions', label: 'Interrompe meu trabalho/vida pessoal' },
        { value: 'scheduling', label: 'Difícil agendar sem conflitos' },
        { value: 'repetitive', label: 'Clientes perguntam sempre a mesma coisa' },
        { value: 'other', label: 'Outro', hasInput: true }
      ]
    },
    {
      id: 'q3',
      text: 'Você paga alguém para atender por você?',
      type: 'single',
      options: [
        { value: 'yes', label: 'Sim', hasInput: true, inputLabel: 'Quanto por mês? (R$)', inputType: 'number' },
        { value: 'would_like', label: 'Não, mas gostaria' },
        { value: 'self_only', label: 'Não, atendo eu mesma' },
        { value: 'tried_failed', label: 'Já tentei mas não deu certo' }
      ]
    },
    {
      id: 'q4',
      text: 'Se existisse uma assistente inteligente (IA) que respondesse seus clientes 24/7, agendasse automaticamente e nunca errasse, você usaria?',
      type: 'single',
      options: [
        { value: 'definitely', label: 'Com certeza' },
        { value: 'depends_price', label: 'Talvez, depende do preço' },
        { value: 'no_trust', label: 'Não confio em robô' },
        { value: 'prefer_human', label: 'Prefiro pessoa real' }
      ]
    },
    {
      id: 'q5',
      text: 'Quanto você pagaria por mês por isso?',
      type: 'single',
      options: [
        { value: '0-50', label: 'R$0-50' },
        { value: '50-100', label: 'R$50-100' },
        { value: '100-200', label: 'R$100-200' },
        { value: '200-500', label: 'R$200-500' },
        { value: '500+', label: 'R$500+' }
      ]
    },
    {
      id: 'q6',
      text: 'O que seria ESSENCIAL nessa ferramenta?',
      type: 'multiple',
      options: [
        { value: 'answer_basic', label: 'Responder perguntas básicas' },
        { value: 'schedule', label: 'Agendar sem conflitos' },
        { value: 'qualify', label: 'Coletar informações do cliente antes' },
        { value: 'privacy', label: 'Nunca vazar minhas informações pessoais' },
        { value: 'personalization', label: 'Parecer que sou EU respondendo' },
        { value: 'other', label: 'Outro', hasInput: true }
      ]
    },
    {
      id: 'q7',
      text: 'Você testaria isso GRATUITAMENTE por 30 dias e me daria feedback?',
      type: 'single',
      options: [
        { value: 'yes_notify', label: 'Sim, quando estiver pronto me avise' },
        { value: 'yes_easy', label: 'Sim, mas só se for fácil de usar' },
        { value: 'no_interest', label: 'Não tenho interesse' }
      ]
    }
  ];

  const getOptionLabel = (questionId, value) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.options) return value;
    
    const option = question.options.find(o => o.value === value);
    return option ? option.label : value;
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    const selectedCountry = countries.find(c => c.code === country);
    setRespondentInfo({
      ...respondentInfo,
      country: country,
      whatsapp: selectedCountry ? selectedCountry.phone : '+'
    });
  };

  const handleAnswer = (questionId, value, customInput = null) => {
    setAnswers({
      ...answers,
      [questionId]: {
        value: value,
        custom: customInput,
        text: getOptionLabel(questionId, value)
      }
    });
  };

  const handleMultipleAnswer = (questionId, value, isChecked, customInput = null) => {
    const currentAnswers = answers[questionId]?.value || [];
    let newAnswers;
    
    if (isChecked) {
      newAnswers = [...currentAnswers, value];
    } else {
      newAnswers = currentAnswers.filter(v => v !== value);
    }
    
    const labels = newAnswers.map(v => getOptionLabel(questionId, v));
    
    setAnswers({
      ...answers,
      [questionId]: {
        value: newAnswers,
        custom: customInput,
        text: labels.join(', ')
      }
    });
  };

  const calculateScore = () => {
    let score = 0;
    
    if (answers.q3?.value === 'yes') score += 1;
    if (answers.q4?.value === 'definitely') score += 1;
    if (['100-200', '200-500', '500+'].includes(answers.q5?.value)) score += 1;
    if (['yes_notify', 'yes_easy'].includes(answers.q7?.value)) score += 1;
    
    return score;
  };

  const getQualityLabel = (score) => {
    if (score >= 4) return 'HOT_LEAD';
    if (score === 3) return 'WARM_LEAD';
    if (score === 2) return 'COLD_LEAD';
    return 'LOW_INTEREST';
  };

  const formatWhatsAppMessage = () => {
    const score = calculateScore();
    const quality = getQualityLabel(score);
    const timestamp = new Date().toISOString();
    const selectedCountry = countries.find(c => c.code === respondentInfo.country);
    
    let message = `📋 *RESPOSTA QUESTIONÁRIO REPLYFASTLY*\n\n`;
    message += `👤 *Dados:*\n`;
    message += `Nome: ${respondentInfo.name}\n`;
    message += `WhatsApp: ${respondentInfo.whatsapp}\n`;
    message += `País: ${selectedCountry ? selectedCountry.name : respondentInfo.country}\n\n`;
    message += `📊 *Score: ${score}/4 - ${quality}*\n\n`;
    message += `---\n\n`;
    
    questions.forEach((q, index) => {
      const answer = answers[q.id];
      if (answer) {
        message += `*${index + 1}. ${q.text}*\n`;
        if (Array.isArray(answer.value)) {
          message += `R: ${answer.text || 'Não respondido'}\n`;
        } else {
          message += `R: ${answer.text || 'Não respondido'}\n`;
          if (answer.custom) {
            message += `Detalhes: ${answer.custom}\n`;
          }
        }
        message += `\n`;
      }
    });
    
    message += `---\n`;
    message += `🕒 ${timestamp}\n`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = () => {
    const message = formatWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${REPLYFASTLY_WHATSAPP}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setShowResults(true);
  };

  const canProceed = () => {
    const current = questions[currentQuestion];
    if (!current) return false;
    
    const answer = answers[current.id];
    if (!answer) return false;
    
    if (current.type === 'multiple') {
      return Array.isArray(answer.value) && answer.value.length > 0;
    }
    
    return true;
  };

  const canSubmit = () => {
    return (
      respondentInfo.name.trim() !== '' &&
      respondentInfo.whatsapp.length > 3 &&
      Object.keys(answers).length === questions.length &&
      canProceed()
    );
  };

  if (showResults) {
    const score = calculateScore();
    const quality = getQualityLabel(score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Resposta Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado por participar! Sua mensagem foi enviada via WhatsApp.
          </p>
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Seu score de qualificação:</p>
            <p className="text-3xl font-bold text-purple-600">{score}/4</p>
            <p className="text-sm text-gray-500 mt-2">{quality}</p>
          </div>
          <p className="text-sm text-gray-500">
            Entraremos em contato em breve! 🚀
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ ReplyFastly
          </h1>
          <p className="text-gray-600">Questionário de Validação</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options && currentQ.options.map((option) => {
              const isMultiple = currentQ.type === 'multiple';
              const isSelected = isMultiple
                ? (answers[currentQ.id]?.value || []).includes(option.value)
                : answers[currentQ.id]?.value === option.value;
              const showInput = isSelected && option.hasInput;

              return (
                <div key={option.value}>
                  <label
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type={isMultiple ? 'checkbox' : 'radio'}
                      name={currentQ.id}
                      checked={isSelected}
                      onChange={(e) => {
                        if (isMultiple) {
                          handleMultipleAnswer(currentQ.id, option.value, e.target.checked);
                        } else {
                          handleAnswer(currentQ.id, option.value);
                        }
                      }}
                      className="mt-1 mr-3"
                    />
                    <span className="flex-1 text-gray-700">{option.label}</span>
                  </label>

                  {showInput && (
                    <input
                      type={option.inputType || 'text'}
                      placeholder={option.inputLabel || 'Digite aqui...'}
                      className="mt-2 ml-7 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (isMultiple) {
                          handleMultipleAnswer(currentQ.id, option.value, true, e.target.value);
                        } else {
                          handleAnswer(currentQ.id, option.value, e.target.value);
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Voltar
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima →
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(questions.length)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continuar →
              </button>
            )}
          </div>
        </div>

        {/* Final Info Collection */}
        {currentQuestion === questions.length && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Últimas informações
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={respondentInfo.name}
                  onChange={(e) => setRespondentInfo({ ...respondentInfo, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  value={respondentInfo.country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp * (opcional)
                </label>
                <input
                  type="tel"
                  value={respondentInfo.whatsapp}
                  onChange={(e) => setRespondentInfo({ ...respondentInfo, whatsapp: e.target.value })}
                  placeholder="+55 82 99999-9999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para recebermos seu PIX de R$30 pelo feedback! 💰
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
              >
                📱 ENVIAR RESPOSTA
              </button>

              <button
                onClick={() => setCurrentQuestion(questions.length - 1)}
                className="w-full px-6 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Voltar
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>🔒 Seus dados estão seguros conosco</p>
          <p className="mt-2">
            Dúvidas? WhatsApp:{' '}
            <a href="https://wa.me/5582999299818" className="text-purple-600 hover:underline">
              +55 82 99929-9818
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
