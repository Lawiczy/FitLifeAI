import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Initialize Google GenAI securely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key-if-not-provided",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Chatbot endpoint with context integration
app.post("/api/chat", async (req, res) => {
  const { messages, userContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mesaj geçmişi zorunludur." });
  }

  // Build a context block to append as system instruction
  let contextBlock = "";
  if (userContext) {
    const { bmi, bmr, tdee, weight, height, age, gender, activity } = userContext;
    contextBlock = `
    Kullanıcının Mevcut Sağlık ve Fiziksel Profili:
    - Boy: ${height || "Belirtilmedi"} cm
    - Kilo: ${weight || "Belirtilmedi"} kg
    - Yaş: ${age || "Belirtilmedi"}
    - Cinsiyet: ${gender === "male" ? "Erkek" : gender === "female" ? "Kadın" : "Belirtilmedi"}
    - Aktivite Seviyesi: ${activity || "Belirtilmedi"}
    - Vücut Kitle Endeksi (VKE): ${bmi ? parseFloat(bmi).toFixed(1) : "Hesaplanmadı"}
    - Bazal Metabolizma Hızı (BMR): ${bmr ? Math.round(bmr) : "Hesaplanmadı"} kcal
    - Günlük Toplam Kalori İhtiyacı (TDEE): ${tdee ? Math.round(tdee) : "Hesaplanmadı"} kcal
    `;
  }

  const systemInstruction = `Sen "FitLife AI" uygulamasının uzman yapay zeka diyetisyeni, egzersiz koçu ve sağlık asistanısın.
  Görevin, kullanıcılara beslenme, sağlıklı yaşam, kilo yönetimi, egzersiz planları ve genel zindelik konularında bilimsel, motive edici, nazik ve anlaşılır Türkçe tavsiyeler vermektir.
  Kullanıcının hesapladığı Vücut Kitle Endeksi (VKE) veya Kalori değerlerini biliyorsan (aşağıda bağlamda verilmiştir), yanıtlarında bu verileri referans alarak kişiselleştirilmiş öneriler sun.
  
  ÖNEMLİ SAĞLIK UYARISI: Herhangi bir ciddi şikayette ("başım ağrıyor", "göğsüm sıkışıyor" vb.) veya tıbbi tanı/tedavi gerektiren durumlarda, bir hekime veya hastaneye başvurmaları gerektiğini her zaman nazikçe hatırlat. Tıbbi teşhis koyma, reçete yazma.

  ${contextBlock}
  `;

  try {
    const hasApiKey = process.env.GEMINI_API_KEY && 
                      process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && 
                      process.env.GEMINI_API_KEY !== "dummy-key-if-not-provided";

    if (hasApiKey) {
      try {
        // Map message history to Gemini contents structure
        const chatContents = messages.map((m: any) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: chatContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        res.json({
          success: true,
          text: response.text || "Üzgünüm, şu an yanıt üretemiyorum. Lütfen tekrar deneyiniz."
        });
      } catch (geminiError: any) {
        console.error("Gemini API Error, falling back:", geminiError);

        // High-quality smart static Turkish fallbacks with key error explanation
        const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
        let reply = "";

        if (lastMsg.includes("merhaba") || lastMsg.includes("selam")) {
          reply = "Merhaba! Ben FitLife AI Sağlık ve Fitness Asistanınız. Bugün size sağlıklı beslenme, kalori hesaplama veya egzersiz planlama konularında nasıl yardımcı olabilirim?";
        } else if (lastMsg.includes("vke") || lastMsg.includes("vücut kitle") || lastMsg.includes("zayıf") || lastMsg.includes("obez") || lastMsg.includes("kilo")) {
          if (userContext && userContext.bmi) {
            reply = `Hesaplamış olduğunuz Vücut Kitle Endeksiniz: **${parseFloat(userContext.bmi).toFixed(1)}**. Bu sonuca göre sağlıklı bir kiloda kalabilmek için dengeli protein alımı, haftada en az 150 dakika orta düzey kardiyo ve düzenli su tüketimi (günde en az 2.5-3 litre) öneririm. Kişiye özel bir diyet programı hazırlamamı ister misiniz?`;
          } else {
            reply = "Vücut Kitle Endeksiniz (VKE), boyunuz ile kilonuz arasındaki dengeyi gösteren önemli bir ölçüttür. Soldaki hesaplayıcıyı kullanarak VKE değerinizi hesaplarsanız, size çok daha spesifik beslenme ve egzersiz tavsiyeleri verebilirim!";
          }
        } else if (lastMsg.includes("kalori") || lastMsg.includes("bmr") || lastMsg.includes("tdee") || lastMsg.includes("ne kadar yemeli")) {
          if (userContext && userContext.tdee) {
            reply = `Günlük kalori ihtiyacınız (TDEE) yaklaşık **${Math.round(userContext.tdee)} kcal** olarak hesaplanmıştır. Eğer kilo vermek istiyorsanız günlük **${Math.round(userContext.tdee - 500)} kcal** (hafif kalori açığı), kilo almak istiyorsanız **${Math.round(userContext.tdee + 300)} kcal** civarı beslenmelisiniz. Makro besinlerinizi %40 Karbonhidrat, %30 Protein, %30 Sağlıklı Yağlar olarak dengelemek harika bir başlangıçtır!`;
          } else {
            reply = "Günlük kalori ihtiyacınız, bazal metabolizma hızınız (BMR) ile günlük aktivite düzeyinizin çarpımıyla bulunur. Soldaki hesaplayıcıyı kullanarak kalori ihtiyacınızı ölçün, böylece hedefinize (kilo verme, koruma, kilo alma) uygun bir makro dağılımı yapalım!";
          }
        } else if (lastMsg.includes("başım") || lastMsg.includes("ağrı") || lastMsg.includes("hasta") || lastMsg.includes("ilaç")) {
          reply = "Geçmiş olsun! Baş ağrısı dehidrasyondan (susuzluk), uykusuzluktan, stresten veya tansiyon değişimlerinden kaynaklanabilir. Öncelikle büyük bir bardak su içip karanlık ve sessiz bir odada dinlenmenizi öneririm.\n\n⚠️ *Önemli Uyarı: Ben bir yapay zeka asistanıyım, tıbbi teşhis koyamam. Şiddetli veya geçmeyen ağrılar için lütfen bir hekime başvurunuz.*";
        } else if (lastMsg.includes("diyet") || lastMsg.includes("zayıflamak") || lastMsg.includes("kilo vermek")) {
          reply = "Sağlıklı kilo vermenin temel kuralı kalori açığı oluşturmaktır. Size rehberlik edecek 3 temel öneri:\n\n1. **İşlenmiş Gıdaları Azaltın:** Şekerli, unlu ve paketli gıdalar yerine lif oranı yüksek sebze, bakliyat ve tam tahılları tercih edin.\n2. **Proteini Artırın:** Yumurta, tavuk, balık veya yoğurt gibi kaliteli protein kaynakları tokluk sürenizi uzatır.\n3. **Aktif Kalın:** Günlük adım sayınızı 8.000 - 10.000 arasına çıkarmak ve haftada 3 gün direnç egzersizleri yapmak kas kütlenizi korur.";
        } else {
          reply = "Harika bir soru! Sağlıklı bir yaşam sürdürmek için yeterli uyku, dengeli beslenme ve aktif kalmak altın kurallardır. Sormuş olduğunuz konuda size daha detaylı bilgi verebilmem veya günlük bir beslenme menüsü hazırlamamı ister misiniz?";
        }

        reply += `\n\n---
⚠️ **API Bağlantı Durumu:** Girdiğiniz \`GEMINI_API_KEY\` ile bağlantı kurulamadı. *(Hata: ${geminiError.message || geminiError})*

💡 **Çözüm:** Sağ üstteki **Settings (Ayarlar) > Secrets** menüsüne tıklayarak \`GEMINI_API_KEY\` değişkeninin doğru girildiğinden emin olun. Geçerli bir anahtar girdiğinizde asistanınız tamamen akıllı ve dinamik cevaplar vermeye başlayacaktır.`;

        res.json({ success: true, text: reply });
      }
    } else {
      // High-quality smart static Turkish fallbacks if Gemini API key is missing
      const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "";

      if (lastMsg.includes("merhaba") || lastMsg.includes("selam")) {
        reply = "Merhaba! Ben FitLife AI Sağlık ve Fitness Asistanınız. Bugün size sağlıklı beslenme, kalori hesaplama veya egzersiz planlama konularında nasıl yardımcı olabilirim?";
      } else if (lastMsg.includes("vke") || lastMsg.includes("vücut kitle") || lastMsg.includes("zayıf") || lastMsg.includes("obez") || lastMsg.includes("kilo")) {
        if (userContext && userContext.bmi) {
          reply = `Hesaplamış olduğunuz Vücut Kitle Endeksiniz: **${parseFloat(userContext.bmi).toFixed(1)}**. Bu sonuca göre sağlıklı bir kiloda kalabilmek için dengeli protein alımı, haftada en az 150 dakika orta düzey kardiyo ve düzenli su tüketimi (günde en az 2.5-3 litre) öneririm. Kişiye özel bir diyet programı hazırlamamı ister misiniz?`;
        } else {
          reply = "Vücut Kitle Endeksiniz (VKE), boyunuz ile kilonuz arasındaki dengeyi gösteren önemli bir ölçüttür. Soldaki hesaplayıcıyı kullanarak VKE değerinizi hesaplarsanız, size çok daha spesifik beslenme ve egzersiz tavsiyeleri verebilirim!";
        }
      } else if (lastMsg.includes("kalori") || lastMsg.includes("bmr") || lastMsg.includes("tdee") || lastMsg.includes("ne kadar yemeli")) {
        if (userContext && userContext.tdee) {
          reply = `Günlük kalori ihtiyacınız (TDEE) yaklaşık **${Math.round(userContext.tdee)} kcal** olarak hesaplanmıştır. Eğer kilo vermek istiyorsanız günlük **${Math.round(userContext.tdee - 500)} kcal** (hafif kalori açığı), kilo almak istiyorsanız **${Math.round(userContext.tdee + 300)} kcal** civarı beslenmelisiniz. Makro besinlerinizi %40 Karbonhidrat, %30 Protein, %30 Sağlıklı Yağlar olarak dengelemek harika bir başlangıçtır!`;
        } else {
          reply = "Günlük kalori ihtiyacınız, bazal metabolizma hızınız (BMR) ile günlük aktivite düzeyinizin çarpımıyla bulunur. Soldaki hesaplayıcıyı kullanarak kalori ihtiyacınızı ölçün, böylece hedefinize (kilo verme, koruma, kilo alma) uygun bir makro dağılımı yapalım!";
        }
      } else if (lastMsg.includes("başım") || lastMsg.includes("ağrı") || lastMsg.includes("hasta") || lastMsg.includes("ilaç")) {
        reply = "Geçmiş olsun! Baş ağrısı dehidrasyondan (susuzluk), uykusuzluktan, stresten veya tansiyon değişimlerinden kaynaklanabilir. Öncelikle büyük bir bardak su içip karanlık ve sessiz bir odada dinlenmenizi öneririm.\n\n⚠️ *Önemli Uyarı: Ben bir yapay zeka asistanıyım, tıbbi teşhis koyamam. Şiddetli veya geçmeyen ağrılar için lütfen bir hekime başvurunuz.*";
      } else if (lastMsg.includes("diyet") || lastMsg.includes("zayıflamak") || lastMsg.includes("kilo vermek")) {
        reply = "Sağlıklı kilo vermenin temel kuralı kalori açığı oluşturmaktır. Size rehberlik edecek 3 temel öneri:\n\n1. **İşlenmiş Gıdaları Azaltın:** Şekerli, unlu ve paketli gıdalar yerine lif oranı yüksek sebze, bakliyat ve tam tahılları tercih edin.\n2. **Proteini Artırın:** Yumurta, tavuk, balık veya yoğurt gibi kaliteli protein kaynakları tokluk sürenizi uzatır.\n3. **Aktif Kalın:** Günlük adım sayınızı 8.000 - 10.000 arasına çıkarmak ve haftada 3 gün direnç egzersizleri yapmak kas kütlenizi korur.";
      } else {
        reply = "Harika bir soru! Sağlıklı bir yaşam sürdürmek için yeterli uyku, dengeli beslenme ve aktif kalmak altın kurallardır. Sormuş olduğunuz konuda size daha detaylı bilgi verebilmem veya günlük bir beslenme menüsü hazırlamamı ister misiniz?";
      }

      reply += "\n\n*(💡 Not: Gemini API anahtarınızı Settings > Secrets panelinden eklediğinizde, asistanımız tamamen dinamik, profesyonel cevaplar üretecektir.)*";
      res.json({ success: true, text: reply });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Yapay zeka asistanı yanıt veremedi.", details: err.message });
  }
});

export default app;
