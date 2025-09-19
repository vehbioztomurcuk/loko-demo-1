'use client'

import { useState } from 'react'

export default function StartScreen({ onScreenChange }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeWithGemini = async (data, type) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData: data,
          type: type
        }),
      })
      
      const result = await response.json()
      
      // Store the analysis result globally or pass to next screen
      window.geminiAnalysis = result
      
      onScreenChange('cv-processing')
    } catch (error) {
      console.error('Analysis error:', error)
      // Fallback to processing screen anyway
      onScreenChange('cv-processing')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.docx,.txt'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        // For demo purposes, we'll use the sample job posting
        const sampleJobPosting = `
GENEL NİTELİKLER VE İŞ TANIMI
Özak Global Holding, yarım asra yaklaşan köklü ve başarılı geçmişi, farklı ancak hizmet kültürü olarak birbirini tamamlar niteliğe sahip sektörlerdeki yetkinliği, donanımlı insan kaynağı, güçlü istihdam ağı, sağlam finansman yapısı, öngörü ve strateji geliştirme yeteneği gibi değerleriyle ülke ekonomisine nefes veren, yaşama değer katan lider kuruluşlar arasında yer alıyor.

Yazılım Geliştirme Uzmanı pozisyonu için başvurunu bekliyoruz.

Genel Nitelikler:
- Üniversitelerin Bilgisayar Mühendisliği, Yazılım Mühendisliği, Elektrik-Elektronik Mühendisliği veya ilgili bölümlerinden mezun
- C#, ASP.NET MVC, Web API teknolojilerine hakim
- Web servis geliştirme (REST API, JSON, Postman) konularında deneyimli
- MS SQL ve PostGreSQL yönetiminde tecrübeli
- JavaScript ve CSS gibi frontend teknolojilerinde bilgi sahibi
- Mikroservis mimarileri, Restful API mimarisi, SOA ve design pattern'lar hakkında bilgi sahibi
- Yazılım Geliştirme Yaşam Döngüsü (SDLC) süreçlerine hâkim
- SAP ve non-SAP sistemlerle entegrasyon geliştirme deneyimi
- Teknik dokümantasyon hazırlama yetkinliği
- İletişim becerisi yüksek, çözüm odaklı

İş Tanımı:
- Holding bünyesinde kullanılan çeşitli uygulama ve sistemlerin yazılım geliştirme süreçlerinde aktif rol alınması
- SAP, Unifier, Fidelio gibi sistemler arasında entegrasyon geliştirilmesi
- İştirak şirketlerinin yazılım ihtiyaçlarını analiz ederek çözümler üretilmesi
- Teknik analiz dokümanlarının hazırlanması
- İlgili iş birimleri ve analistlerle koordineli çalışarak projelerin tamamlanması
        `
        
        analyzeWithGemini(sampleJobPosting, 'job-posting')
      }
    }
    input.click()
  }

  const handleUrlInput = () => {
    // For demo, we'll use the sample URL and job posting data
    const sampleUrl = 'https://www.kariyer.net/is-ilanlari/yazilim+gelistirme+uzmani'
    const sampleJobPosting = `
Özak Global Holding - Yazılım Geliştirme Uzmanı

GENEL NİTELİKLER:
✨ Bilgisayar/Yazılım Mühendisliği mezunu
💻 C#, ASP.NET MVC, Web API teknolojilerine hakim
🔧 REST API, JSON, Postman deneyimi
📊 MS SQL ve PostGreSQL yönetimi
🎨 JavaScript ve CSS bilgisi
🏗️ Mikroservis mimarileri ve Design Patterns
📋 SDLC süreçlerine hâkim
🔗 SAP entegrasyon deneyimi
📝 Teknik dokümantasyon hazırlama
💬 Yüksek iletişim becerisi

İŞ TANIMI:
🏢 Holding uygulamalarında yazılım geliştirme
🔄 SAP, Unifier, Fidelio sistemler arası entegrasyon  
🎯 İştirak şirketleri için çözüm üretme
📊 Teknik analiz dokümanları hazırlama
👥 İş birimleri ile koordineli proje yürütme

Lokasyon: İstanbul
Deneyim: 3-7 yıl
Maaş: Rekabetçi + Yan haklar
    `
    
    analyzeWithGemini(sampleJobPosting, 'job-posting')
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🤖</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Gemini AI Analiz Ediyor...</h2>
          <p className="text-gray-600">Profil verileriniz yapay zeka ile işleniyor ✨</p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-lokomotif-green rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-lokomotif-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-lokomotif-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
          Anında Role-Play Deneyimi
        </h1>
        <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-6">
          İş ilanınızı yükleyin, 10 saniye içinde gerçek müşteri ile konuşmaya başlayın. 
          AI anlık olarak size özel senaryo ve karakteri oluşturur.
        </p>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl w-full">
          
          {/* Left Side - File Upload */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">📎 İş İlanı Yükle</h2>
            
            <div className="space-y-6">
              <button 
                onClick={handleFileUpload}
                className="w-full py-4 px-6 border-2 border-lokomotif-green rounded-2xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isAnalyzing}
              >
                📄 Dosya Seç
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              PDF, DOC, HTML veya TXT formatında iş ilanı dökümanı yükleyin. 
              AI otomatik özetleyip uygun müşteri profili oluşturacak.
            </p>
          </div>

          {/* Right Side - URL Input */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">🔗 İlan Linkini Yapıştır</h2>
            
            <div className="space-y-6">
              <button 
                onClick={handleUrlInput}
                className="w-full py-4 px-6 border-2 border-lokomotif-green rounded-2xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isAnalyzing}
              >
                🌐 Link Ekle
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              Yenibiriş, SecretCV, Eleman.net, İŞKUR, Jooble, LinkedIn, 
              Toptalent.co, İşin Olsun ve diğer iş sitelerinden link yapıştırın.
            </p>
          </div>

        </div>
      </div>
      
      {/* Bottom Notice */}
      <div className="text-center pb-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 max-w-4xl mx-auto border border-green-200">
          <p className="text-gray-700 font-medium mb-2">
            ⚡ <strong>Hızlı Başlangıç:</strong> İlan yükleme → Dinamik sorular → Canlı konuşma (≤ 10 saniye)
          </p>
          <p className="text-sm text-gray-600">
            Sistem iş ilanınıza göre otomatik olarak uygun soruları seçer, 
            karakterinizi oluşturur ve mikrofonunuzu açarak gerçek müşteri deneyimi başlatır.
          </p>
        </div>
      </div>
    </div>
  )
}