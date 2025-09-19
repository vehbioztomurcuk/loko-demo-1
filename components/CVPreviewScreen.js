'use client'

import { useEffect, useState } from 'react'

export default function CVPreviewScreen({ userProfile, onScreenChange, onProfileUpdate }) {
  const [analysisData, setAnalysisData] = useState(null)

  useEffect(() => {
    // Get the Gemini analysis result
    if (window.geminiAnalysis) {
      setAnalysisData(window.geminiAnalysis)
      
      // Convert Gemini format to our userProfile format
      const geminiData = window.geminiAnalysis
      const userAnswers = window.userAnswers || {}
      
      if (geminiData.candidate && geminiData.scenario) {
        const convertedProfile = {
          title: geminiData.candidate.title,
          age: parseInt(geminiData.candidate.age) || 28,
          characteristics: geminiData.candidate.characteristics,
          scenario: geminiData.scenario.description,
          difficulty: getDifficultyFromAnswer(userAnswers.difficulty) || geminiData.scenario.difficulty || 'Orta',
          salary_range: geminiData.candidate.salary_range,
          needs: geminiData.candidate.needs,
          objections: geminiData.scenario.objections || [],
          selectedScenario: getScenarioFromAnswer(userAnswers.scenario),
          callDirection: userAnswers.call_direction
        }
        onProfileUpdate(convertedProfile)
      }
    }
  }, [onProfileUpdate])

  const getDifficultyFromAnswer = (difficultyId) => {
    const difficultyMap = {
      'easy': 'Kolay',
      'medium': 'Orta', 
      'hard': 'Zor'
    }
    return difficultyMap[difficultyId] || 'Orta'
  }

  const getScenarioFromAnswer = (scenarioId) => {
    const scenarioMap = {
      'cold_call': 'Soğuk Arama Senaryosu',
      'referral': 'Referans Üzerinden Görüşme',
      'web_lead': 'Webden Gelen Talep'
    }
    return scenarioMap[scenarioId] || 'Genel Senaryo'
  }

  const regeneratePersona = () => {
    onScreenChange('start')
  }

  const startSimulation = () => {
    onScreenChange('roleplay')
  }

  if (!analysisData && !userProfile) return null

  const displayData = analysisData || {}
  const candidate = displayData.candidate || {}
  const scenario = displayData.scenario || {}

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            🤖 Gemini AI Analiz Sonucu
          </h2>
          <p className="text-gray-600">Yapay zeka tarafından oluşturulan müşteri profili</p>
        </div>
        
        {/* Candidate Profile */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-lokomotif-green">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            👤 Aday Profili
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p><strong className="text-gray-700">Pozisyon:</strong> {candidate.title || 'Belirtilmemiş'}</p>
              <p><strong className="text-gray-700">Yaş:</strong> {candidate.age || 'Belirtilmemiş'}</p>
              <p><strong className="text-gray-700">Deneyim:</strong> {candidate.experience || 'Belirtilmemiş'}</p>
              {candidate.salary_range && (
                <p><strong className="text-gray-700">Maaş Beklentisi:</strong> {candidate.salary_range}</p>
              )}
            </div>
            <div className="space-y-3">
              <p><strong className="text-gray-700">Özellikler:</strong></p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                {candidate.characteristics || 'Analiz edilemedi'}
              </p>
            </div>
          </div>
          
          {candidate.needs && (
            <div className="mt-4">
              <p><strong className="text-gray-700">Sigorta İhtiyaçları:</strong></p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg mt-2">
                {candidate.needs}
              </p>
            </div>
          )}
        </div>

        {/* User Preferences */}
        {(window.userAnswers && Object.keys(window.userAnswers).length > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              ⚙️ Seçtiğiniz Tercihler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {window.userAnswers.scenario && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Senaryo</p>
                  <p className="font-medium text-gray-800">{getScenarioFromAnswer(window.userAnswers.scenario)}</p>
                </div>
              )}
              {window.userAnswers.difficulty && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Zorluk</p>
                  <p className="font-medium text-gray-800">{getDifficultyFromAnswer(window.userAnswers.difficulty)}</p>
                </div>
              )}
              {window.userAnswers.call_direction && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Görüşme Türü</p>
                  <p className="font-medium text-gray-800">
                    {window.userAnswers.call_direction === 'outbound' ? 'Siz ararsınız' : 'Müşteri arar'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scenario Details */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🎭 Senaryo Detayları
          </h3>
          <div className="space-y-3">
            <p><strong className="text-gray-700">Senaryo:</strong> {scenario.name || 'Genel Senaryo'}</p>
            <p><strong className="text-gray-700">Zorluk:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                scenario.difficulty === 'Kolay' ? 'bg-green-100 text-green-800' :
                scenario.difficulty === 'Zor' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {scenario.difficulty || 'Orta'}
              </span>
            </p>
            <p><strong className="text-gray-700">Açıklama:</strong></p>
            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
              {scenario.description || 'Senaryo açıklaması mevcut değil'}
            </p>
            
            {scenario.objections && scenario.objections.length > 0 && (
              <div className="mt-4">
                <p><strong className="text-gray-700">Olası İtirazlar:</strong></p>
                <ul className="text-sm text-gray-600 bg-white p-3 rounded-lg mt-2 space-y-1">
                  {scenario.objections.map((objection, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {objection}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* AI Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
            <span className="text-2xl mr-2">✨</span>
            <span className="text-sm font-medium text-gray-700">
              Google Gemini AI tarafından oluşturuldu
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={regeneratePersona}
            className="px-8 py-3 border-2 border-lokomotif-green text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
          >
            🔄 Yeni Analiz Yap
          </button>
          <button 
            onClick={startSimulation}
            className="px-8 py-3 bg-lokomotif-green text-white font-medium rounded-2xl hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🚀</span>
            Role-Play Başlat
          </button>
        </div>
      </div>
    </div>
  )
}