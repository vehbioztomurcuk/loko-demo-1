'use client'

import { useState, useEffect } from 'react'

export default function ChatSetupScreen({ config, onConfigUpdate, onScreenChange }) {
  const [options, setOptions] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    // Load options
    fetch('/options.json')
      .then(res => res.json())
      .then(data => {
        setOptions(data)
        startChat()
      })
      .catch(err => {
        console.error('Error loading options:', err)
        // Fallback data
        setOptions({
          scenarios: [{id: "cold_call", name: "Soğuk Arama Senaryosu", description: "Satış temsilcisi, hiç tanımadığı bir potansiyel müşteriyi arayarak sigorta ürünleri hakkında bilgi vermeye çalışıyor."}],
          customer_profiles: [{id: "young_professional", name: "Genç Profesyonel", description: "25-35 yaşlarında, kariyerinin başında veya orta kademesinde çalışan profesyonel."}],
          difficulty_levels: [{id: "easy", name: "Kolay", description: "Temel sorular, sınırlı itiraz; öğrenme odaklı"}],
          call_direction: [{id: "outbound", name: "Sen Müşteriyi Ararsın (Outbound)", description: "Senaryoyu outbound kurgulayarak ilk repliğin satış temsilcisinden geleceğini belirleyin."}]
        })
        startChat()
      })
  }, [])

  const startChat = () => {
    setMessages([])
    setCurrentStep(0)
    setTimeout(() => {
      addMessage("Hi! Let's configure your practice. First: Which scenario do you want to try?", 'bot')
      setShowOptions(true)
    }, 500)
  }

  const addMessage = (content, sender) => {
    setMessages(prev => [...prev, { content, sender, id: Date.now() }])
  }

  const handleOptionSelect = (option, property) => {
    addMessage(option.name, 'user')
    onConfigUpdate({ [property]: option })
    setShowOptions(false)
    
    setTimeout(() => {
      nextStep()
    }, 1000)
  }

  const nextStep = () => {
    const steps = [
      {
        message: "Great choice! Now, what type of customer would you like to practice with?",
        options: options?.customer_profiles || [],
        property: 'customerProfile'
      },
      {
        message: "Perfect! What difficulty level would you prefer?",
        options: options?.difficulty_levels || [],
        property: 'difficulty'
      },
      {
        message: "Finally, who should start the conversation?",
        options: options?.call_direction || [],
        property: 'callDirection'
      }
    ]

    if (currentStep < steps.length) {
      const step = steps[currentStep]
      addMessage(step.message, 'bot')
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setShowOptions(true)
      }, 500)
    } else {
      addMessage("Perfect! All set up. Let's start your role-play session!", 'bot')
      setTimeout(() => onScreenChange('roleplay'), 1500)
    }
  }

  const getCurrentOptions = () => {
    if (!options) return []
    
    const stepOptions = [
      options.scenarios,
      options.customer_profiles,
      options.difficulty_levels,
      options.call_direction
    ]
    
    const stepProperties = ['scenario', 'customerProfile', 'difficulty', 'callDirection']
    
    return {
      options: stepOptions[currentStep] || [],
      property: stepProperties[currentStep]
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden h-96 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Setup Configuration</h2>
        <button 
          onClick={() => onScreenChange('start')}
          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm' 
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Options */}
      {showOptions && (
        <div className="p-4 border-t border-gray-200 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {getCurrentOptions().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option, getCurrentOptions().property)}
                className="w-full text-left p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all"
              >
                <div className="font-semibold text-gray-800">{option.name}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}