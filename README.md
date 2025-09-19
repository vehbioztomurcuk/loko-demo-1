# 🚀 Lokomotif AI Role-Play Tool

**İş Görüşmesi Simülatörü - Anında Role-Play Deneyimi**

Yapay zeka destekli iş görüşmesi pratik aracı. İş ilanınızı yükleyin, 10 saniye içinde gerçek müşteri deneyimi ile konuşmaya başlayın.

![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-blue)

## 🎯 Özellikler

### ⚡ Hızlı Başlangıç (≤ 10 saniye)
- **İlan Yükleme:** PDF, DOC, HTML veya TXT formatında
- **URL Parser:** Yenibiriş, SecretCV, Eleman.net, İŞKUR, Jooble, LinkedIn, Toptalent.co, İşin Olsun
- **Dinamik Sorular:** AI tarafından seçilen uygun sorular
- **Canlı Konuşma:** Mikrofon entegrasyonu ile gerçek deneyim

### 🤖 AI Entegrasyonu
- **Gemini AI:** Google'ın gelişmiş dil modeli
- **Otomatik Analiz:** İş ilanı ve CV analizi
- **Karakter Oluşturma:** Pozisyona uygun müşteri profilleri
- **Türkçe Destek:** Tam Türkçe lokalizasyon

### 🎨 Modern UI/UX
- **Minimal Tasarım:** Beyaz arkaplan, yeşil vurgular (#70cd70)
- **Responsive Layout:** Mobil ve masaüstü uyumlu
- **İki Sütunlu Grid:** Sol-sağ dosya/URL yükleme
- **Smooth Animasyonlar:** Framer Motion ile

## 🛠️ Teknoloji Stack

```json
{
  "frontend": {
    "framework": "Next.js 14.0.0",
    "ui": "React 18.2.0",
    "styling": "Tailwind CSS 3.3.3",
    "animations": "Framer Motion 10.16.4"
  },
  "backend": {
    "api": "Next.js API Routes",
    "ai": "Google Generative AI (@google/generative-ai)",
    "model": "Gemini Pro"
  },
  "deployment": {
    "platform": "Vercel Ready",
    "environment": "Node.js"
  }
}
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Gemini API Key

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/vehbioztomurcuk/loko-demo-1.git
cd loko-demo-1
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın:**
```bash
# .env.local dosyası oluşturun
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📂 Proje Yapısı

```
loko-demo-1/
├── app/
│   ├── api/
│   │   └── analyze-profile/
│   │       └── route.js          # Gemini AI API endpoint
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Ana sayfa
│   └── globals.css               # Global stiller
├── components/
│   ├── StartScreen.js            # Ana ekran (dosya/URL yükleme)
│   ├── CVProcessingScreen.js     # Dinamik yükleme + sorular
│   └── CVPreviewScreen.js        # AI analiz sonuçları
├── public/
│   └── options.json              # Soru bankası ve konfigürasyonlar
├── package.json
└── README.md
```

## 🔧 API Kullanımı

### Profil Analizi
```javascript
POST /api/analyze-profile
Content-Type: application/json

{
  "profileData": "İş ilanı metni veya CV içeriği",
  "type": "job-posting" | "cv-file" | "url"
}
```

### Yanıt Formatı
```javascript
{
  "candidate": {
    "title": "Yazılım Geliştirme Uzmanı",
    "age": "28",
    "experience": "Mid-level",
    "salary_range": "15.000-25.000 TL",
    "characteristics": "Teknik detaylara odaklı...",
    "needs": "Kariyer gelişimi planları..."
  },
  "scenario": {
    "name": "Genç Profesyonel - Teknoloji Sektörü",
    "description": "28 yaşında yazılım geliştirme uzmanı...",
    "difficulty": "Orta",
    "customer_type": "Araştırmacı ve detay odaklı",
    "objections": ["Karşılaştırma yapmak istiyor", "..."]
  }
}
```

## 🎮 Kullanım Senaryoları

### 1. İş İlanı Analizi
- İş ilanını PDF/DOC olarak yükle
- AI otomatik analiz yapar
- Pozisyona uygun müşteri profili oluşturur

### 2. URL Parser
- İş sitesi linkini yapıştır
- Otomatik içerik çekme
- Anlık analiz ve profil oluşturma

### 3. Dinamik Quiz Sistemi
- Yükleme sırasında pop-up sorular
- İçeriğe göre uygun sorular seçilir
- Güvenli soru bankası kullanımı

## 🎯 Gelecek Özellikler

### 🔄 Planlanan Geliştirmeler
- [ ] **CF Worker URL Parser:** Otomatik site içerik çekme
- [ ] **Ses Entegrasyonu:** Mikrofon ve konuşma tanıma
- [ ] **Genişletilmiş Soru Bankası:** Sektör bazlı sorular
- [ ] **Analytics Dashboard:** Kullanım istatistikleri
- [ ] **Çoklu Dil Desteği:** İngilizce ve diğer diller

### 🚀 Teknik İyileştirmeler
- [ ] **Real-time Voice:** WebRTC entegrasyonu
- [ ] **Advanced AI:** GPT-4 entegrasyonu
- [ ] **Mobile App:** React Native versiyonu
- [ ] **Cloud Storage:** CV ve analiz saklama

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel kullanım için geliştirilmiştir. Tüm hakları saklıdır.

## 👥 Ekip

- **Geliştirici:** [vehbioztomurcuk](https://github.com/vehbioztomurcuk)
- **Proje:** Lokomotif AI Role-Play Tool
- **Repository:** [loko-demo-1](https://github.com/vehbioztomurcuk/loko-demo-1)

## 📞 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**⚡ Anında Role-Play Deneyimi - 10 saniyede başlayın!**

🎯 Demo: `npm run dev` → `http://localhost:3000`