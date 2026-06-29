import { useState } from "react";
import { Server, Database, Shield, Cpu, Code2, GitMerge, FileCode, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function TechStackGuide() {
  const [activeTab, setActiveTab] = useState<"mimari" | "veritabani" | "guvenlik" | "stack">("mimari");

  return (
    <div id="tech-guide" className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 p-6 md:p-8">
      <div className="max-w-3xl mb-8">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3 border border-emerald-100">
          <Shield className="w-3.5 h-3.5" /> Üretim Sınıfı Mimari Kılavuzu
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sistem Mimarisi ve Teknoloji Önerileri
        </h2>
        <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed">
          Uygulamanın BDDK Açık Bankacılık mevzuatlarına, ISO 27001 bilgi güvenliği standartlarına ve yüksek yapay zeka performansı için önerilen üretim mimari şeması.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100/80 rounded-2xl mb-8 max-w-2xl">
        <button
          onClick={() => setActiveTab("mimari")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === "mimari"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <GitMerge className="w-4 h-4 text-emerald-500" />
          Sistem Akışı ve Mimari
        </button>
        <button
          onClick={() => setActiveTab("veritabani")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === "veritabani"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Database className="w-4 h-4 text-blue-500" />
          Veritabanı Şeması
        </button>
        <button
          onClick={() => setActiveTab("guvenlik")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === "guvenlik"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Shield className="w-4 h-4 text-amber-500" />
          Güvenlik Protokolleri
        </button>
        <button
          onClick={() => setActiveTab("stack")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === "stack"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Code2 className="w-4 h-4 text-purple-500" />
          Teknoloji Stack'i
        </button>
      </div>

      {/* Content Container */}
      <div className="min-h-[400px]">
        {/* TAB 1: SYSTEM ARCHITECTURE */}
        {activeTab === "mimari" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-emerald-500" /> 3-Katmanlı Güvenli Veri Akışı
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-none w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-600 border border-emerald-100">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Açık Bankacılık Rızası (OAuth2)</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Kullanıcı, bankanın güvenli redirect veya iframe arayüzünde giriş yapar. Uygulamamıza sadece <b>read-only (salt okunur)</b> hesap geçmişi erişim izni (Consent token) verilir.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-none w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Veri Çekme & Şifreleme</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Backend servisimiz banka API'lerinden hesap hareketlerini çeker. İşlem tutarları ve kullanıcı ID'leri veritabanına kaydedilmeden önce <b>AES-256-GCM</b> ile şifrelenir.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-none w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-xs font-bold text-purple-600 border border-purple-100">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Yapay Zeka Sınıflandırma</h4>
                      <p className="text-slate-500 text-xs mt-0.5">İşlemler Gemini AI modeline gönderilerek harcama kategorisi tayin edilir ve harcama <b>Gerekli/İsteğe Bağlı</b> olarak etiketlenerek asistan veri tabanında indekslenir.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Flowchart rendered in highly stylized CSS and SVGs */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-center font-bold text-slate-400 text-[10px] tracking-wider uppercase mb-4">ÜRETİM VERİ AKIŞ ŞEMASI</div>
                <div className="space-y-4 relative z-10">
                  {/* Step 1 */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏦</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">BKM Geçit / API Portal</div>
                        <div className="text-[10px] text-slate-400">Garanti, İş Bankası, vb.</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">Read-Only</span>
                  </div>

                  {/* Connective Line Down */}
                  <div className="flex justify-center -my-2">
                    <div className="w-0.5 h-6 bg-slate-300 border-dashed border-l"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🛡️</span>
                      <div className="text-left">
                        <div className="text-xs font-bold">ParaYol Güvenli Backend</div>
                        <div className="text-[10px] text-slate-400">NodeJS / Express / AES-256</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase">SSL Proxy</span>
                  </div>

                  {/* Connective Line Down */}
                  <div className="flex justify-center -my-2">
                    <div className="w-0.5 h-6 bg-slate-300 border-dashed border-l"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                      <span className="text-sm">🤖</span>
                      <div className="text-[10px] font-bold text-slate-800 mt-1">Gemini AI Engine</div>
                      <div className="text-[9px] text-emerald-600 font-semibold font-mono">Sınıflandırma</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                      <span className="text-sm">🗄️</span>
                      <div className="text-[10px] font-bold text-slate-800 mt-1">PostgreSQL DB</div>
                      <div className="text-[9px] text-indigo-600 font-semibold font-mono">Veri Şifreleme</div>
                    </div>
                  </div>
                </div>
                
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DATABASE SCHEMA */}
        {activeTab === "veritabani" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <FileCode className="w-5 h-5 text-blue-500" /> PostgreSQL İlişkisel Tablo Tasarımı (Drizzle SQL)
            </h3>
            <p className="text-slate-500 text-xs md:text-sm">
              Tüm hassas bakiye ve işlem miktarları <b>encrypted (AES-256)</b> olarak saklanmalı, işlem açıklamaları maskelenmelidir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Table 1: users & bank_consents */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                  <span>📂 Table: users & bank_consents</span>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Core</span>
                </div>
                {`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bank_id VARCHAR(50) NOT NULL, -- e.g. 'akbank'
  consent_token TEXT NOT NULL, -- OAuth Access Token
  refresh_token TEXT,
  expiry_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, revoked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </div>

              {/* Table 2: transactions */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                  <span>📂 Table: transactions & AI Metadata</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Encrypted</span>
                </div>
                {`CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consent_id UUID REFERENCES bank_consents(id),
  
  -- AES-256-GCM ile şifrelenecek hassas alanlar:
  encrypted_merchant TEXT NOT NULL,
  encrypted_amount TEXT NOT NULL, -- Cihaz bazlı şifreli tutar
  raw_amount NUMERIC(12,2) NOT NULL, -- İndeksleme için maskeli/anonim tutar
  
  transaction_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL, -- AI tarafından atanan
  type VARCHAR(20) NOT NULL, -- 'Gerekli' veya 'İsteğe Bağlı'
  ai_reasoning TEXT, -- Tasarruf tavsiyesi
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SECURITY PROTOCOLS */}
        {activeTab === "guvenlik" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-amber-500" /> Şifreleme ve Güvenlik Altyapısı
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bankacılık verileriyle çalışırken güvenlik lüks değil bir zorunluluktur. BDDK standartları gereğince şunları kurguluyoruz:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Salt Okunur (Read-Only) Token Politikası
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  BKM Geçit veya Plaid entegrasyonunda talep edilen yetki kapsamı (scopes) sadece <code>accounts.readonly</code> ve <code>transactions.readonly</code> ile sınırlandırılır. Uygulama kodunda hiçbir para transferi (wire transfer/ACH) fonksiyonu barındırılmaz.
                </p>
              </div>

              <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Veri Tabanı Seviyesi AES-256-GCM Şifrelemesi
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Kullanıcının harcama açıklamaları ("Migros", "Starbucks") ve işlem miktarları veritabanına doğrudan yazılmaz. NodeJS düzeyinde <code>crypto</code> kütüphanesi ve donanımsal HSM/KMS anahtarları kullanılarak <b>AES-256-GCM</b> algoritmasıyla şifrelenip kaydedilir.
                </p>
              </div>

              <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> 90 Günlük Rıza (Consent) Yenileme Periyodu
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Açık bankacılık yasal standartları gereğince, kullanıcının veri paylaşım rızası maksimum 90 gündür. 90 günün sonunda bankanın API sunucusu tokenı iptal eder ve uygulama kullanıcılardan SMS/Mobil doğrulama ile rızayı yenilemesini talep eder.
                </p>
              </div>

              <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Maskelenmiş Gösterim & SSL Pinning
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Hesap numaraları ve kart numaraları UI katmanına kadar maskelenmiş (Örn: TR93...4102) olarak taşınır. Mobil ve web uygulaması banka sunucularına bağlanırken Man-in-the-Middle (MitM) saldırılarını önlemek için SSL Pinning kullanılır.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: RECOMMENDED TECH STACK */}
        {activeTab === "stack" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Önerilen Üretim Teknolojileri Listesi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Frontend */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="text-emerald-600 bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg">💻</div>
                <div className="font-bold text-slate-800 text-sm">Frontend Arabağlar</div>
                <ul className="text-slate-500 text-xs space-y-1.5 list-disc list-inside">
                  <li>React 19 / Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                  <li>Recharts (Grafik)</li>
                </ul>
              </div>

              {/* Backend */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="text-blue-600 bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg">⚙️</div>
                <div className="font-bold text-slate-800 text-sm">Güvenli Backend</div>
                <ul className="text-slate-500 text-xs space-y-1.5 list-disc list-inside">
                  <li>NodeJS / NestJS</li>
                  <li>Fastify veya Express</li>
                  <li>TypeScript / ts-node</li>
                  <li>Drizzle ORM</li>
                </ul>
              </div>

              {/* Database */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="text-amber-600 bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg">🗄️</div>
                <div className="font-bold text-slate-800 text-sm">Veritabanı / Cache</div>
                <ul className="text-slate-500 text-xs space-y-1.5 list-disc list-inside">
                  <li>PostgreSQL (İlişkisel)</li>
                  <li>Redis Cache</li>
                  <li>Google Cloud KMS</li>
                  <li>AWS Secrets Manager</li>
                </ul>
              </div>

              {/* AI & Integration */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="text-purple-600 bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg">🧠</div>
                <div className="font-bold text-slate-800 text-sm">AI & Finansal API'ler</div>
                <ul className="text-slate-500 text-xs space-y-1.5 list-disc list-inside">
                  <li>@google/genai SDK</li>
                  <li>BKM Geçit (TR)</li>
                  <li>Plaid API (Global)</li>
                  <li>Yodlee / Salt Edge</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2.5 items-center p-4 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100 text-xs md:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span><b>Mühendislik Tavsiyesi:</b> Türkiye pazarını hedefliyorsanız BDDK Açık Bankacılık lisansı olan ve API geçit hizmeti sunan yerel fin-tech entegratörleri (Finartz, Kolay Bi vb.) ile el sıkışmak, Plaid yerine yerel entegrasyon maliyetlerini ciddi oranda düşürecektir.</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
