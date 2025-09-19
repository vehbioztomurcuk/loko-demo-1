'use client'

import { useState } from 'react'
import StartScreen from '../components/StartScreen'
import CVProcessingScreen from '../components/CVProcessingScreen'
import CVPreviewScreen from '../components/CVPreviewScreen'
import ChatSetupScreen from '../components/ChatSetupScreen'
import RolePlayScreen from '../components/RolePlayScreen'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('start')
  const [config, setConfig] = useState({
    scenario: null,
    customerProfile: null,
    difficulty: null,
    callDirection: null,
  })
  const [userProfile, setUserProfile] = useState(null)

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen)
  }

  const handleConfigUpdate = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  const handleUserProfileUpdate = (profile) => {
    setUserProfile(profile)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onScreenChange={handleScreenChange} />
      case 'cv-processing':
        return (
          <CVProcessingScreen 
            onScreenChange={handleScreenChange}
            onProfileGenerated={handleUserProfileUpdate}
          />
        )
      case 'cv-preview':
        return (
          <CVPreviewScreen 
            userProfile={userProfile}
            onScreenChange={handleScreenChange}
            onProfileUpdate={handleUserProfileUpdate}
          />
        )
      case 'roleplay':
        return (
          <RolePlayScreen 
            config={config}
            userProfile={userProfile}
            onScreenChange={handleScreenChange}
          />
        )
      default:
        return <StartScreen onScreenChange={handleScreenChange} />
    }
  }

  return (
    <main className="min-h-screen">
      <div className="w-full">
        {renderScreen()}
      </div>
    </main>
  )
}