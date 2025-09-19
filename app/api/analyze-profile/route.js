import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { profileData, type } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    let prompt = ''
    
    if (type === 'job-posting') {
      prompt = `
Aşağıdaki iş ilanına göre, bu pozisyona başvuran bir adayın mülakat senaryosunu oluştur. Sen işveren/müdür olarak mülakat yapacaksın.

İş İlanı:
${profileData}

Lütfen şu formatta bir JSON yanıt ver:
{
  "position": {
    "title": "Pozisyon adı",
    "department": "Departman",
    "level": "Junior/Mid/Senior",
    "salary_range": "Maaş aralığı",
    "requirements": "Ana gereksinimler",
    "company_info": "Şirket hakkında kısa bilgi"
  },
  "interviewer": {
    "name": "Müdür/İK uzmanı adı",
    "title": "Pozisyon",
    "personality": "Mülakat tarzı (dostane/resmi/detaylı)",
    "focus_areas": ["Odaklanacağı ana konular"]
  },
  "scenario": {
    "name": "Mülakat senaryosu adı",
    "description": "Mülakat ortamı ve beklentiler",
    "difficulty": "Kolay/Orta/Zor",
    "duration": "Tahmini süre",
    "key_questions": ["Sorulacak ana sorular"]
  }
}

Türkçe yanıt ver. Sen işveren rolünde olacaksın, kullanıcı ise iş başvurusunda bulunan aday.
`
    } else if (type === 'cv-file') {
      prompt = `
Bu CV verisine göre, kişinin iş mülakatı için senaryo oluştur. Sen işveren rolünde olacaksın.

CV Verisi:
${profileData}

Lütfen şu formatta bir JSON yanıt ver:
{
  "position": {
    "title": "Uygun pozisyon",
    "level": "Junior/Mid/Senior",
    "department": "Departman"
  },
  "interviewer": {
    "name": "Müdür adı",
    "title": "Pozisyon",
    "personality": "Mülakat tarzı"
  },
  "scenario": {
    "name": "Mülakat senaryosu",
    "description": "Senaryo açıklaması",
    "difficulty": "Kolay/Orta/Zor",
    "key_questions": ["Ana sorular"]
  }
}

Türkçe yanıt ver. Sen işveren, kullanıcı iş başvurusu yapan aday.
`
    } else {
      prompt = `
Bu URL'den elde edilen iş ilanı verisine göre mülakat senaryosu oluştur:

${profileData}

JSON formatında Türkçe yanıt ver. Sen işveren, kullanıcı başvuru sahibi.
`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Clean the response to extract JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      const parsedResponse = JSON.parse(text)
      return Response.json(parsedResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      return Response.json({
        position: {
          title: "Yazılım Geliştirici",
          department: "Teknoloji",
          level: "Mid-level",
          salary_range: "15.000-25.000 TL",
          requirements: "React, Node.js, veritabanı bilgisi",
          company_info: "Teknoloji odaklı dinamik şirket"
        },
        interviewer: {
          name: "Ahmet Yılmaz",
          title: "Teknoloji Müdürü",
          personality: "Dostane ve teknik odaklı",
          focus_areas: ["Teknik beceriler", "Problem çözme", "Takım çalışması"]
        },
        scenario: {
          name: "Yazılım Geliştirici Mülakatı",
          description: "Orta seviye yazılım geliştirici pozisyonu için teknik mülakat",
          difficulty: "Orta",
          duration: "45 dakika",
          key_questions: ["React deneyiminizden bahsedin", "Zorlandığınız bir proje örneği", "Neden bizimle çalışmak istiyorsunuz?"]
        }
      })
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error)
    return Response.json({ 
      error: 'Profil analizi sırasında bir hata oluştu.',
      fallback: {
        position: {
          title: "Genel Pozisyon",
          department: "İnsan Kaynakları",
          level: "Mid-level"
        },
        interviewer: {
          name: "İK Uzmanı",
          title: "İnsan Kaynakları Müdürü",
          personality: "Profesyonel ve anlayışlı"
        },
        scenario: {
          name: "Genel İş Mülakatı",
          description: "Standart iş mülakatı süreci",
          difficulty: "Orta",
          key_questions: ["Kendinizden bahsedin", "Neden bu pozisyonu istiyorsunuz?"]
        }
      }
    }, { status: 200 })
  }
}