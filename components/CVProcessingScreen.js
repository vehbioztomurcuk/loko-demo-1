'use client'

import { useState, useEffect } from 'react'

export default function CVProcessingScreen({ onScreenChange, onProfileGenerated }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  const loadingSteps = [
    "📄 İlan özeti çıkarılıyor...",
    "🔍 Aynı pozisyondaki paralel sorular taranıyor...",
    "� Persona oluşturuluyor...",
    "💼 Kariyer seviyesi analiz ediliyor...",
    "🎯 Müşteri ihtiyaçları belirleniyor...",
    "🎭 Senaryo detayları hazırlanıyor...",
    "✅ Persona oluşturuldu, tercihler bekleniyor..."
  ]

  const questions = [
    {
      id: 'scenario',
      text: 'Hangi satış senaryosunu tercih edersiniz?',
      options: [
        { id: 'cold_call', text: 'Soğuk Arama Senaryosu' },
        { id: 'referral', text: 'Referans Üzerinden Görüşme' },
        { id: 'web_lead', text: 'Webden Gelen Talep' }
      ]
    },
    {
      id: 'difficulty',
      text: 'Zorluk seviyesini nasıl ayarlayalım?',
      options: [
        { id: 'easy', text: 'Kolay - Öğrenme odaklı' },
        { id: 'medium', text: 'Orta - Dengeli challenge' },
        { id: 'hard', text: 'Zor - Gerçek hayat senaryosu' }
      ]
    },
    {
      id: 'call_direction',
      text: 'Görüşmeyi kim başlatacak?',
      options: [
        { id: 'outbound', text: 'Ben müşteriyi ararım' },
        { id: 'inbound', text: 'Müşteri beni arar' }
      ]
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          // Start showing questions after loading is complete
          setTimeout(() => {
            setShowQuestion(true)
            setCurrentQuestion(0)
          }, 1000)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(interval)
  }, [loadingSteps.length])

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }))
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
      setTimeout(() => {
        // Store answers and proceed
        window.userAnswers = answers
        onScreenChange('cv-preview')
      }, 1500)
    }
  }

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
      setTimeout(() => onScreenChange('cv-preview'), 1000)
    }
  }

  const handleSkipAll = () => {
    setIsCompleted(true)
    setTimeout(() => onScreenChange('cv-preview'), 1000)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Hazır! ✨
          </h2>
          <p className="text-gray-600">
            Kişiselleştirilmiş role-play senaryonuz oluşturuldu
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* AI Robot Animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-pulse">🤖</div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Gemini AI Çalışıyor
          </h2>
        </div>

        {/* Loading Steps */}
        <div className="mb-8 min-h-[120px]">
          {loadingSteps.slice(0, currentStep + 1).map((step, index) => (
            <div
              key={index}
              className={`text-lg mb-2 transition-all duration-500 ${
                index === currentStep ? 'text-lokomotif-green font-medium animate-pulse' : 'text-gray-400'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: index === currentStep ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Questions Section */}
        {showQuestion && currentQuestion !== null && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-lokomotif-green animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].text}
            </h3>
            
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.id)}
                  className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-lokomotif-green hover:bg-white transition-all"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSkip}
                className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Bu soruyu atla →
              </button>
              <button
                onClick={handleSkipAll}
                className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Tümünü atla
              </button>
            </div>

            {/* Question Progress */}
            <div className="mt-4 flex justify-center space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentQuestion ? 'bg-lokomotif-green' :
                    index < currentQuestion ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {!showQuestion && (
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-lokomotif-green rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
    </div>
  )
}