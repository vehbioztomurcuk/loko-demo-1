'use client'

import { useState, useEffect } from 'react'

export default function RolePlayScreen({ config, userProfile, onScreenChange }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    startConversation()
  }, [])

  const startConversation = () => {
    const callDirection = config.callDirection || { id: 'outbound' }
    
    if (callDirection.id === 'inbound') {
      // Customer calls first
      setTimeout(() => {
        addMessage(generateCustomerMessage('opening'), 'customer')
      }, 1000)
    } else {
      // Sales representative calls first
      addMessage("The call is connecting... You are calling the customer. Start the conversation!", 'system')
    }
  }

  const addMessage = (content, sender) => {
    const newMessage = {
      id: Date.now(),
      content,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const generateCustomerMessage = (context) => {
    const profile = config.customerProfile || { id: 'young_professional' }
    const difficulty = config.difficulty || { id: 'easy' }
    
    const messages = {
      opening: [
        "Merhaba, sigorta konusunda bilgi almak istiyorum.",
        "Selam, sitenizden bilgi talep etmiştim. Arayacağınızı söylemiştiniz.",
        "İyi günler, bir arkadaşım sizin adınızı verdi. Sigorta konusunda konuşabilir miyiz?"
      ],
      response: [
        "Anladım, biraz daha detay verir misiniz?",
        "Fiyatları nasıl? Başka şirketlerle karşılaştırdınız mı?",
        "Bu poliçe ne kadar süreyle geçerli?",
        "Düşünmem lazım, tekrar arayabilir misiniz?"
      ],
      objection: [
        "Çok pahalı geliyor bana.",
        "Başka şirketten daha uygun teklif aldım.",
        "Şu an bu konuya bütçe ayıramıyorum.",
        "Eşimle konuşmam lazım önce."
      ]
    }
    
    const contextMessages = messages[context] || messages.response
    return contextMessages[Math.floor(Math.random() * contextMessages.length)]
  }

  const generateCustomerResponse = (userMessage) => {
    const difficulty = config.difficulty || { id: 'easy' }
    
    // Simple AI simulation based on user message content
    if (userMessage.toLowerCase().includes('fiyat') || userMessage.toLowerCase().includes('ücret')) {
      if (difficulty.id === 'hard') {
        return generateCustomerMessage('objection')
      } else {
        return "Fiyatlar makul görünüyor, başka seçenekler var mı?"
      }
    } else if (userMessage.toLowerCase().includes('merhaba') || userMessage.toLowerCase().includes('selam')) {
      return "Merhaba, dinliyorum sizi."
    } else {
      return generateCustomerMessage('response')
    }
  }

  const sendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user')
      setInputValue('')
      
      // Generate customer response
      setTimeout(() => {
        const customerResponse = generateCustomerResponse(inputValue)
        addMessage(customerResponse, 'customer')
      }, 1000 + Math.random() * 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const endRolePlay = () => {
    if (confirm('Role-play oturumunu sonlandırmak istediğinizden emin misiniz?')) {
      onScreenChange('start')
    }
  }

  const getSenderLabel = (sender) => {
    const labels = {
      'user': 'Siz (Satış Temsilcisi)',
      'customer': 'Müşteri',
      'system': 'Sistem'
    }
    return labels[sender] || sender
  }

  const scenario = config.scenario || { name: 'Role Play Session', description: 'Practice session in progress' }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden h-96 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{scenario.name}</h3>
          <p className="text-sm opacity-90">{scenario.description}</p>
        </div>
        <button 
          onClick={endRolePlay}
          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
        >
          🛑 End Session
        </button>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map(message => (
          <div key={message.id} className="mb-4 max-w-4xl">
            <div className={`${message.sender === 'user' ? 'ml-auto max-w-xs' : 'mr-auto max-w-xs'} ${message.sender === 'system' ? 'mx-auto text-center max-w-md' : ''}`}>
              <div className="text-xs text-gray-500 mb-1 font-medium">
                {getSenderLabel(message.sender)}
              </div>
              <div className={`p-3 rounded-lg shadow-sm ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : message.sender === 'system'
                  ? 'bg-gray-200 text-gray-700 italic'
                  : 'bg-white text-gray-800 border'
              }`}>
                {message.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your response..."
          rows="2"
          className="flex-1 p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          ✈️ Send
        </button>
      </div>
    </div>
  )
}