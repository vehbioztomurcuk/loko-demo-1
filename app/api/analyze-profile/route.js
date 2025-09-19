import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { profileData, type } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    let prompt = ''
    
    if (type === 'job-posting') {
      prompt = `
Aşağıdaki iş ilanına göre, bu pozisyona başvuracak bir adayın profilini analiz et ve onun için uygun bir müşteri senaryosu oluştur. Sigorta satışı role-play için kullanılacak.

İş İlanı:
${profileData}

Lütfen şu formatta bir JSON yanıt ver:
{
  "candidate": {
    "title": "Aday pozisyonu (örn: Yazılım Geliştirme Uzmanı)",
    "age": "Yaş tahmini (25-45 arası)",
    "experience": "Deneyim seviyesi (Junior/Mid/Senior)",
    "salary_range": "Maaş beklentisi",
    "characteristics": "Kişilik özellikleri ve davranış kalıpları",
    "needs": "Sigorta ihtiyaçları"
  },
  "scenario": {
    "name": "Senaryo adı",
    "description": "Detaylı senaryo açıklaması",
    "difficulty": "Kolay/Orta/Zor",
    "customer_type": "Müşteri tipi",
    "objections": ["Olası itirazlar listesi"]
  }
}

Türkçe yanıt ver ve gerçekçi bir profil oluştur. Sigorta satışında kullanılacak, bu yüzden adayın yaşam durumu, gelir seviyesi ve risk algısını dikkate al.
`
    } else if (type === 'cv-file') {
      prompt = `
Bu CV verisine göre, kişinin profilini analiz et ve onun için uygun bir müşteri senaryosu oluştur. Sigorta satışı role-play için kullanılacak.

CV Verisi:
${profileData}

Lütfen şu formatta bir JSON yanıt ver:
{
  "candidate": {
    "title": "Pozisyon/Meslek",
    "age": "Yaş tahmini",
    "experience": "Deneyim seviyesi",
    "characteristics": "Kişilik özellikleri",
    "needs": "Sigorta ihtiyaçları"
  },
  "scenario": {
    "name": "Senaryo adı", 
    "description": "Senaryo açıklaması",
    "difficulty": "Kolay/Orta/Zor"
  }
}

Türkçe yanıt ver.
`
    } else {
      prompt = `
Bu URL'den elde edilen profil verisine göre bir müşteri senaryosu oluştur:

${profileData}

JSON formatında Türkçe yanıt ver.
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
        candidate: {
          title: "Yazılım Geliştirme Uzmanı",
          age: "28",
          experience: "Mid-level",
          salary_range: "15.000-25.000 TL",
          characteristics: "Teknik detaylara odaklı, analitik düşünen, yenilikçi çözümler arayan, stabil gelir sahibi profesyonel",
          needs: "Kariyer gelişimi ile birlikte artan gelir için tasarruf planları, sağlık güvencesi, emeklilik planlaması"
        },
        scenario: {
          name: "Genç Profesyonel - Teknoloji Sektörü",
          description: "28 yaşında yazılım geliştirme uzmanı. Kariyerinde yükselme döneminde, gelecek planları yapıyor. Teknik detaylara hakim, araştırmacı kişiliğe sahip.",
          difficulty: "Orta",
          customer_type: "Araştırmacı ve detay odaklı müşteri",
          objections: ["Başka şirketlerle karşılaştırma yapmak istiyor", "Teknik detayları merak ediyor", "Uzun vadeli yatırım getirisi hesaplıyor"]
        }
      })
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error)
    return Response.json({ 
      error: 'Profil analizi sırasında bir hata oluştu.',
      fallback: {
        candidate: {
          title: "Profesyonel",
          age: "30",
          characteristics: "Başarılı, hedef odaklı",
          needs: "Güvenli gelecek planlaması"
        },
        scenario: {
          name: "Genel Profesyonel Senaryo",
          description: "Kariyer sahibi profesyonel ile sigorta görüşmesi",
          difficulty: "Orta"
        }
      }
    }, { status: 200 })
  }
}