import { useState, useEffect, useRef, FormEvent, TouchEvent } from "react";
import {
  Activity,
  User,
  Heart,
  Sparkles,
  ChevronRight,
  Calculator,
  MessageSquare,
  RefreshCw,
  Info,
  Apple,
  TrendingUp,
  Award,
  BookOpen,
  Copy,
  Check,
  Send,
  Sliders,
  AlertCircle,
  Clock,
  ExternalLink,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// List of health tips in Turkish
const ALL_HEALTH_TIPS = [
  {
    id: 1,
    title: "Su Tüketimi ve Metabolizma",
    desc: "Günde en az 2.5 - 3 litre su tüketmek, metabolizmanızı %24'e varan oranda hızlandırabilir ve ödem atmanıza yardımcı olur.",
    tag: "Hidrasyon",
    color: "from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-500/20"
  },
  {
    id: 2,
    title: "Lifli Beslenmenin Önemi",
    desc: "Lifli gıdalar (yulaf, yeşil sebzeler, kuru baklagiller) sindirimi yavaşlatarak kan şekerini dengeler ve daha uzun süre tok hissetmenizi sağlar.",
    tag: "Beslenme",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    id: 3,
    title: "Kas Kütlesi ve Yağ Yakımı",
    desc: "Düzenli güç egzersizleri (ağırlık antrenmanı veya vücut ağırlığı) kas kütlesini artırarak dinlenme halindeki bazal metabolizma hızınızı yükseltir.",
    tag: "Egzersiz",
    color: "from-indigo-500/10 to-violet-500/10 text-indigo-600 border-indigo-500/20"
  },
  {
    id: 4,
    title: "Uyku ve İştah Hormonları",
    desc: "Günde 7-8 saat kaliteli uyku, iştahı düzenleyen leptin ve ghrelin hormonlarını dengeler, gereksiz tatlı krizlerinin önüne geçer.",
    tag: "Uyku",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20"
  },
  {
    id: 5,
    title: "Yarısı Yeşil Tabaklar",
    desc: "Tabağınızın yarısını mevsim yeşillikleri ve sebzeleriyle doldurmak, düşük kaloriyle yüksek hacimde doymanıza ve bol vitamin almanıza katkıda bulunur.",
    tag: "Diyet",
    color: "from-green-500/10 to-emerald-500/10 text-green-600 border-green-500/20"
  },
  {
    id: 6,
    title: "Aktif Esneme Molaları",
    desc: "Hareketsiz geçen her 1 saatlik süreçten sonra 5 dakikalık hafif esneme hareketleri veya yürüyüş yapmak kan dolaşımını ve odaklanmayı artırır.",
    tag: "Yaşam Tarzı",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-500/20"
  },
  {
    id: 7,
    title: "Yeşil Çay ve Yağ Yakımı",
    desc: "Yeşil çay içerdiği yüksek antioksidanlar (özellikle EGCG) sayesinde hücresel yenilenmeyi destekler ve egzersiz sırasında yağ yakımına katkı sağlar.",
    tag: "Detoks",
    color: "from-teal-500/10 to-green-500/10 text-teal-600 border-teal-500/20"
  },
  {
    id: 8,
    title: "Yavaş Çiğnemenin Gücü",
    desc: "Yemeklerinizi yavaş çiğnemek, tokluk sinyallerinin beyninize ulaşması için gereken 20 dakikalık sürede gereksiz fazla yemeyi engeller.",
    tag: "Alışkanlık",
    color: "from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-500/20"
  },
  {
    id: 9,
    title: "Omega-3 Yağ Asitleri",
    desc: "Haftada 2 gün yağlı balıklar (somon, uskumru, ton balığı) tüketmek, beyin ve kalp sağlığınızı destekleyen Omega-3 yağ asitlerini almanızı sağlar.",
    tag: "Sağlık",
    color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20"
  },
  {
    id: 10,
    title: "Yüksek Proteinli Başlangıç",
    desc: "Yüksek proteinli bir kahvaltı yapmak, gün boyunca yaşayacağınız yeme ataklarını azaltır ve kas onarımını destekler.",
    tag: "Kahvaltı",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/20"
  }
];

export default function App() {
  // Input fields
  const [height, setHeight] = useState<string>("175");
  const [weight, setWeight] = useState<string>("70");
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("moderate");

  // Calculated Results
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiColor, setBmiColor] = useState<string>("");
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Daily random tips
  const [randomTips, setRandomTips] = useState<typeof ALL_HEALTH_TIPS>([]);

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Merhaba! Ben FitLife AI Sağlık ve Fitness Asistanınız. Boy, kilo ve aktivite değerlerinizi girdikten sonra sizin için tamamen özelleştirilmiş beslenme tüyoları ve egzersiz rehberleri hazırlayabilirim. Nasıl yardımcı olabilirim?"
    }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Export HTML tab
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "calculator" | "chatbot" | "export">("dashboard");

  // Generate 3 random tips
  const generateTips = () => {
    const shuffled = [...ALL_HEALTH_TIPS].sort(() => 0.5 - Math.random());
    setRandomTips(shuffled.slice(0, 3));
  };

  useEffect(() => {
    generateTips();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle calculation
  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    const hNum = parseFloat(height);
    const wNum = parseFloat(weight);
    const aNum = parseInt(age, 10);

    if (isNaN(hNum) || hNum <= 0 || isNaN(wNum) || wNum <= 0 || isNaN(aNum) || aNum <= 0) {
      alert("Lütfen tüm alanları geçerli sayılarla doldurun.");
      return;
    }

    // 1. BMI (VKE) Calculation
    const bmiVal = wNum / ((hNum / 100) * (hNum / 100));
    setBmi(bmiVal);

    let cat = "";
    let color = "";
    if (bmiVal < 18.5) {
      cat = "Zayıf";
      color = "text-amber-500 bg-amber-50 border-amber-200";
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      cat = "Normal (İdeal Kilo)";
      color = "text-emerald-600 bg-emerald-50 border-emerald-200";
    } else if (bmiVal >= 25 && bmiVal < 30) {
      cat = "Fazla Kilolu";
      color = "text-orange-500 bg-orange-50 border-orange-200";
    } else {
      cat = "Obez";
      color = "text-rose-600 bg-rose-50 border-rose-200";
    }
    setBmiCategory(cat);
    setBmiColor(color);

    // 2. BMR (Harris-Benedict Formula)
    let bmrVal = 0;
    if (gender === "male") {
      bmrVal = 88.362 + (13.397 * wNum) + (4.799 * hNum) - (5.677 * aNum);
    } else {
      bmrVal = 447.593 + (9.247 * wNum) + (3.098 * hNum) - (4.330 * aNum);
    }
    setBmr(bmrVal);

    // 3. TDEE Calculation (Daily Calorie Needs)
    let multiplier = 1.2;
    if (activity === "light") multiplier = 1.375;
    if (activity === "moderate") multiplier = 1.55;
    if (activity === "active") multiplier = 1.725;

    const tdeeVal = bmrVal * multiplier;
    setTdee(tdeeVal);
    setHasCalculated(true);

    // Add automated helpful system prompt notification into the chat to prompt Gemini updates
    const autoTip = `Fiziksel profiliniz başarıyla güncellendi! VKE: ${bmiVal.toFixed(1)} (${cat}), Günlük Kalori İhtiyacınız: ${Math.round(tdeeVal)} kcal. Sohbet kısmından bu profil üzerinden tamamen size özel diyet listeleri talep edebilirsiniz.`;
    setChatMessages((prev) => [
      ...prev,
      { sender: "ai", text: `Hesaplamalarınız tamamlandı!\n\n📊 **VKE:** ${bmiVal.toFixed(1)} (${cat})\n🔥 **Günlük Kalori İhtiyacınız (TDEE):** ${Math.round(tdeeVal)} kcal\n\nBu veriler asistanımıza aktarıldı. Sağlık Asistanına sormak istediğiniz her şeyi alt kısımdan iletebilirsiniz.` }
    ]);
  };

  // Handle chatbot query
  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isSending) return;

    const query = userQuery;
    setUserQuery("");
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setIsSending(true);

    // Prepare profile context for API
    const userContext = hasCalculated ? {
      bmi,
      bmr,
      tdee,
      weight,
      height,
      age,
      gender,
      activity: activity === "sedentary" ? "Hareketsiz" : activity === "light" ? "Az Aktif" : activity === "moderate" ? "Orta Aktif" : "Çok Aktif"
    } : null;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { sender: "user", text: query }],
          userContext
        })
      });

      const data = await response.json();
      if (data.success) {
        setChatMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
      } else {
        setChatMessages((prev) => [...prev, { sender: "ai", text: "Özür dilerim, yapay zeka servisine bağlanırken bir sorun oluştu. Lütfen tekrar deneyiniz." }]);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Bağlantı hatası oluştu. Lütfen ağınızı kontrol edip tekrar deneyiniz." }]);
    } finally {
      setIsSending(false);
    }
  };

  // Standalone index.html complete single-file code for copy/paste
  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitLife AI - Sağlık ve Fitness Asistanı</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            500: '#22c55e',
                            600: '#16a34a',
                            700: '#15803d',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
        }
    </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col justify-between">

    <!-- NAV BAR -->
    <header class="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">FitLife <span class="text-emerald-500">AI</span></span>
                        <span class="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Sağlık & Fitness Asistanı</span>
                    </div>
                </div>
                <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <a href="#dashboard" class="hover:text-emerald-500 transition-all">Giriş</a>
                    <a href="#hesaplayici" class="hover:text-emerald-500 transition-all">VKE & Kalori</a>
                    <a href="#asistan" class="hover:text-emerald-500 transition-all">AI Asistan</a>
                    <a href="#ipuclari" class="hover:text-emerald-500 transition-all">Sağlık İpuçları</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        <!-- DASHBOARD HERO SECTION -->
        <section id="dashboard" class="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-3xl p-6 sm:p-10 border border-emerald-100/50 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div class="space-y-6 max-w-xl">
                <span class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    ✨ Kişiselleştirilmiş Sağlık Danışmanı
                </span>
                <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                    Daha Sağlıklı, Güçlü ve <br>
                    <span class="text-emerald-500">Zinde Bir Yaşama</span> Adım Atın
                </h1>
                <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Boy, kilo ve aktivite düzeyinizi girerek Vücut Kitle Endeksinizi ve günlük kalori ihtiyacınızı anında hesaplayın. Gelişmiş yapay zeka asistanımızla sağlıklı tarifler ve antrenman tüyoları konuşun!
                </p>
                <div class="flex flex-wrap gap-4">
                    <a href="#hesaplayici" class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/10 text-sm flex items-center gap-2">
                        Hesaplamaya Başla
                    </a>
                    <a href="#asistan" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2">
                        AI Sohbetine Git
                    </a>
                </div>
            </div>
            
            <!-- Quick metrics overview card -->
            <div class="w-full lg:w-80 bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                <h3 class="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    ⚡ Günün Motivasyonu
                </h3>
                <blockquote class="text-xs text-slate-500 italic border-l-2 border-emerald-500 pl-3">
                    "Bugün yapacağınız küçük sağlıklı seçimler, yarınki harika hislerin temelini oluşturur. Adım atın!"
                </blockquote>
                <hr class="border-slate-100">
                <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="bg-slate-50 rounded-xl p-3">
                        <span class="text-[10px] text-slate-400 block font-semibold uppercase">Hedef Adım</span>
                        <span class="text-sm font-bold text-emerald-600">10,000</span>
                    </div>
                    <div class="bg-slate-50 rounded-xl p-3">
                        <span class="text-[10px] text-slate-400 block font-semibold uppercase">Su Hedefi</span>
                        <span class="text-sm font-bold text-blue-500">2.5 L</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- BMI AND CALORIE CALCULATORS SECTION -->
        <section id="hesaplayici" class="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-20">
            
            <!-- Dynamic Form Inputs (Left side) -->
            <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-150/80 shadow-sm space-y-6">
                <div class="flex items-center gap-3">
                    <span class="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="5" y1="9" x2="5.01" y2="9"/><line x1="5" y1="13" x2="5.01" y2="13"/><line x1="5" y1="17" x2="5.01" y2="17"/></svg>
                    </span>
                    <div>
                        <h2 class="font-bold text-slate-950 text-base">Metrik Hesaplama Alanı</h2>
                        <p class="text-xs text-slate-400">VKE ve Kalori İhtiyacı İçin Bilgilerinizi Girin</p>
                    </div>
                </div>

                <form id="calcForm" onsubmit="calculateAll(event)" class="space-y-4">
                    
                    <!-- Gender selection toggle -->
                    <div>
                        <label class="text-xs font-semibold text-slate-500 block mb-2">Cinsiyet</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" id="genderMale" onclick="setGender('male')" class="py-2.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                                👨 Erkek
                            </button>
                            <button type="button" id="genderFemale" onclick="setGender('female')" class="py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                                👩 Kadın
                            </button>
                        </div>
                    </div>

                    <!-- Age, Height, Weight row -->
                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="text-xs font-semibold text-slate-500 block mb-1.5">Boy (cm)</label>
                            <input type="number" id="height" value="175" required class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-500 block mb-1.5">Kilo (kg)</label>
                            <input type="number" id="weight" value="70" required class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-500 block mb-1.5">Yaş</label>
                            <input type="number" id="age" value="25" required class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <!-- Activity Level -->
                    <div>
                        <label class="text-xs font-semibold text-slate-500 block mb-1.5">Günlük Aktivite Seviyesi</label>
                        <select id="activity" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white font-medium focus:outline-none focus:border-emerald-500">
                            <option value="sedentary">Hareketsiz (Ofis işi, egzersiz yok)</option>
                            <option value="light">Az Aktif (Hafif tempolu egzersiz, haftada 1-2 gün)</option>
                            <option value="moderate" selected>Orta Aktif (Haftada 3-5 gün spor/koşu)</option>
                            <option value="active">Çok Aktif (Ağır egzersiz, her gün spor)</option>
                        </select>
                    </div>

                    <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10">
                        Hesaplamaları Yap
                    </button>
                </form>
            </div>

            <!-- Calculated Output Results (Right side) -->
            <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-150/80 shadow-sm flex flex-col justify-between">
                <div>
                    <h2 class="font-bold text-slate-950 text-base mb-1">Analiz Sonuçları</h2>
                    <p class="text-xs text-slate-400 mb-6">Boyunuza, kilonuza ve yaşınıza göre hesaplanan detaylı vücut analizi.</p>

                    <!-- Empty state before first calculation -->
                    <div id="resultsPlaceholder" class="py-12 text-center space-y-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-slate-300 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9.09 9 1-1a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <p class="text-xs text-slate-500">Hesapla butonuna basarak VKE ve günlük kalori ihtiyacı sonuçlarınızı anında görüntüleyin.</p>
                    </div>

                    <!-- Active Calculation View -->
                    <div id="resultsView" class="hidden space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- BMI Metric -->
                            <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                                <span class="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Vücut Kitle Endeksi (VKE)</span>
                                <div class="flex items-baseline gap-2">
                                    <span id="bmiVal" class="text-2xl font-extrabold text-slate-900">22.9</span>
                                    <span id="bmiCat" class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Normal</span>
                                </div>
                                <p class="text-[11px] text-slate-500">Normal ve sağlıklı bir kilodasınız. Dengeli beslenmeye devam edin.</p>
                            </div>

                            <!-- Calories Metric -->
                            <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                                <span class="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Günlük Kalori İhtiyacı (TDEE)</span>
                                <div class="flex items-baseline gap-1">
                                    <span id="tdeeVal" class="text-2xl font-extrabold text-emerald-600">2450</span>
                                    <span class="text-xs font-semibold text-slate-400">kcal/gün</span>
                                </div>
                                <p class="text-[11px] text-slate-500">Mevcut kilonuzu korumak için almanız gereken tahmini enerji miktarıdır.</p>
                            </div>
                        </div>

                        <!-- Target suggestions -->
                        <div class="space-y-3 pt-2">
                            <span class="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Hedeflerinize Göre Kalori Dağılımları</span>
                            <div class="grid grid-cols-3 gap-3 text-center">
                                <div class="p-3 bg-rose-50/40 border border-rose-100 rounded-xl">
                                    <span class="text-[9px] text-rose-500 font-bold block">Kilo Verme</span>
                                    <span id="valLose" class="text-sm font-extrabold text-slate-900">1950 kcal</span>
                                </div>
                                <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span class="text-[9px] text-slate-500 font-bold block">Kilo Koruma</span>
                                    <span id="valMaintain" class="text-sm font-extrabold text-slate-900 font-semibold text-slate-800">2450 kcal</span>
                                </div>
                                <div class="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                                    <span class="text-[9px] text-emerald-500 font-bold block">Kilo Alma</span>
                                    <span id="valGain" class="text-sm font-extrabold text-slate-900">2750 kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/40 flex items-start gap-3">
                    <span class="text-emerald-500 mt-0.5">💡</span>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                        <b>Harris-Benedict</b> formülüne göre bazal metabolizma hızınız hesaplanmıştır. Kilo yönetim hedefleriniz için yukarıdaki kalori sınırlarına sadık kalarak, öğünlerinizi sağlıklı karbonhidrat ve protein kaynaklarından oluşturmaya özen gösterin.
                    </p>
                </div>
            </div>
        </section>

        <!-- AI CHATBOT HEALTH ASSISTANT SECTION -->
        <section id="asistan" class="bg-white rounded-3xl border border-slate-150/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 scroll-mt-20">
            <!-- Left Info Panel -->
            <div class="lg:col-span-4 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-150 flex flex-col justify-between">
                <div class="space-y-4">
                    <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-950 text-base">Yapay Zeka Sağlık Asistanı</h3>
                        <p class="text-xs text-slate-500 leading-relaxed mt-1">
                            FitLife AI, uzman bir diyetisyen ve fitness koçu gibi davranarak beslenme düzeniniz, haftalık egzersiz programınız ve ideal vücut yapınız hakkında size yol gösterir.
                        </p>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-200 space-y-3">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sık Sorulan Sorular</p>
                    <div class="space-y-2">
                        <button onclick="fillChatQuery('Sağlıklı ve hızlı bir şekilde kilo vermek için ideal bir protein kahvaltısı nasıl olmalı?')" class="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-600 border border-slate-100 p-2.5 rounded-lg transition-all truncate block">
                            👉 İdeal protein kahvaltısı nasıl olmalı?
                        </button>
                        <button onclick="fillChatQuery('Haftada 3 gün tüm vücut (full-body) ev antrenman programı önerebilir misin?')" class="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-600 border border-slate-100 p-2.5 rounded-lg transition-all truncate block">
                            👉 Evde full-body egzersiz programı
                        </button>
                    </div>
                </div>
            </div>

            <!-- Active Chatbox (Right side) -->
            <div class="lg:col-span-8 flex flex-col h-[420px] bg-white justify-between">
                <!-- Messages List -->
                <div id="chatMessages" class="flex-1 p-6 overflow-y-auto space-y-4 text-sm scrollbar">
                    <!-- AI message -->
                    <div class="flex gap-3">
                        <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">AI</div>
                        <div class="bg-slate-50 p-3 rounded-2xl max-w-[85%] border border-slate-100 text-xs sm:text-sm">
                            Merhaba! Ben FitLife AI Sağlık ve Fitness Asistanınız. Boy, kilo ve aktivite değerlerinizi yukarıdaki forma girdikten sonra sizin için tamamen özelleştirilmiş beslenme tüyoları ve egzersiz rehberleri hazırlayabilirim. Nasıl yardımcı olabilirim?
                        </div>
                    </div>
                </div>

                <!-- Input box -->
                <form id="chatForm" onsubmit="sendChatMessage(event)" class="p-4 border-t border-slate-100 flex gap-3">
                    <input type="text" id="chatInput" placeholder="Sorunuzu buraya yazın... (Örn: Günde kaç bardak su içmeliyim?)" required class="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500">
                    <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/15">
                        Gönder
                    </button>
                </form>
            </div>
        </section>

        <!-- RANDOM DAILY HEALTH TIPS -->
        <section id="ipuclari" class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-extrabold text-slate-950 text-xl tracking-tight">Günlük Sağlık İpuçları</h2>
                    <p class="text-xs text-slate-500">Her gün zindeliğinize zindelik katacak uzman beslenme ve sağlıklı yaşam tavsiyeleri.</p>
                </div>
                <button onclick="refreshTips()" class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all border border-emerald-100">
                    🔄 Değiştir
                </button>
            </div>

            <div id="tipsGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Tips are populated dynamically -->
            </div>
        </section>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800 text-xs">
        <div class="max-w-7xl mx-auto px-4 space-y-2">
            <p class="font-semibold text-white">FitLife AI © 2026 - Her Hakkı Saklıdır.</p>
            <p class="max-w-lg mx-auto text-slate-500 text-[11px] leading-relaxed">
                Yapay zeka asistanı tarafından verilen tüm bilgiler genel sağlık, beslenme ve spor bilgilendirme amaçlıdır. Ciddi tıbbi durumlarda lütfen doktorunuza başvurun.
            </p>
        </div>
    </footer>

    <!-- INTERACTIVE SCRIPT -->
    <script>
        // Global gender and calculation state variables
        let selectedGender = 'male';
        let calculatedBmi = null;
        let calculatedTdee = null;

        // Tips Database
        const tipsDb = [
            { title: "Su Tüketimi ve Metabolizma", tag: "Hidrasyon", bg: "bg-blue-50/70 border-blue-100", text: "text-blue-600", desc: "Günde en az 2.5 - 3 litre su tüketmek, metabolizmanızı %24'e varan oranda hızlandırabilir ve ödem atmanıza yardımcı olur." },
            { title: "Lifli Beslenmenin Önemi", tag: "Beslenme", bg: "bg-emerald-50/70 border-emerald-100", text: "text-emerald-600", desc: "Lifli gıdalar (yulaf, yeşil sebzeler, kuru baklagiller) sindirimi yavaşlatarak kan şekerini dengeler ve daha uzun süre tok hissetmenizi sağlar." },
            { title: "Kas Kütlesi ve Yağ Yakımı", tag: "Egzersiz", bg: "bg-indigo-50/70 border-indigo-100", text: "text-indigo-600", desc: "Düzenli güç egzersizleri (ağırlık antrenmanı veya vücut ağırlığı) kas kütlesini artırarak dinlenme halindeki bazal metabolizma hızınızı yükseltir." },
            { title: "Uyku ve İştah Hormonları", tag: "Uyku", bg: "bg-amber-50/70 border-amber-100", text: "text-amber-600", desc: "Günde 7-8 saat kaliteli uyku, iştahı düzenleyen leptin ve ghrelin hormonlarını dengeler, gereksiz tatlı krizlerinin önüne geçer." },
            { title: "Yarısı Yeşil Tabaklar", tag: "Diyet", bg: "bg-green-50/70 border-green-100", text: "text-green-600", desc: "Tabağınızın yarısını mevsim yeşillikleri ve sebzeleriyle doldurmak, düşük kaloriyle yüksek hacimde doymanıza ve bol vitamin almanıza katkıda bulunur." },
            { title: "Aktif Esneme Molaları", tag: "Yaşam Tarzı", bg: "bg-rose-50/70 border-rose-100", text: "text-rose-600", desc: "Hareketsiz geçen her 1 saatlik süreçten sonra 5 dakikalık hafif esneme hareketleri veya yürüyüş yapmak kan dolaşımını ve odaklanmayı artırır." }
        ];

        // Set gender UI toggles
        function setGender(gender) {
            selectedGender = gender;
            const maleBtn = document.getElementById('genderMale');
            const femaleBtn = document.getElementById('genderFemale');
            if (gender === 'male') {
                maleBtn.className = "py-2.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all";
                femaleBtn.className = "py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all";
            } else {
                maleBtn.className = "py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all";
                femaleBtn.className = "py-2.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all";
            }
        }

        // Calculate BMI and Harris-Benedict BMR + TDEE
        function calculateAll(e) {
            e.preventDefault();
            const h = parseFloat(document.getElementById('height').value);
            const w = parseFloat(document.getElementById('weight').value);
            const a = parseInt(document.getElementById('age').value);
            const act = document.getElementById('activity').value;

            if (!h || !w || !a) return;

            // BMI
            const bmi = w / ((h / 100) * (h / 100));
            calculatedBmi = bmi;
            document.getElementById('bmiVal').innerText = bmi.toFixed(1);

            let cat = "";
            let catClass = "";
            if (bmi < 18.5) {
                cat = "Zayıf";
                catClass = "text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md";
            } else if (bmi >= 18.5 && bmi < 25) {
                cat = "Normal (İdeal)";
                catClass = "text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md";
            } else if (bmi >= 25 && bmi < 30) {
                cat = "Fazla Kilolu";
                catClass = "text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md";
            } else {
                cat = "Obez";
                catClass = "text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md";
            }
            const bmiCatEl = document.getElementById('bmiCat');
            bmiCatEl.innerText = cat;
            bmiCatEl.className = catClass;

            // BMR (Harris-Benedict)
            let bmr = 0;
            if (selectedGender === 'male') {
                bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
            } else {
                bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
            }

            // TDEE multiplier
            let multiplier = 1.2;
            if (act === 'light') multiplier = 1.375;
            if (act === 'moderate') multiplier = 1.55;
            if (act === 'active') multiplier = 1.725;

            const tdee = bmr * multiplier;
            calculatedTdee = tdee;

            document.getElementById('tdeeVal').innerText = Math.round(tdee);
            document.getElementById('valMaintain').innerText = Math.round(tdee) + " kcal";
            document.getElementById('valLose').innerText = Math.round(tdee - 500) + " kcal";
            document.getElementById('valGain').innerText = Math.round(tdee + 300) + " kcal";

            document.getElementById('resultsPlaceholder').className = "hidden";
            document.getElementById('resultsView').className = "space-y-6";

            // Push notification to chat list
            const messagesBox = document.getElementById('chatMessages');
            messagesBox.innerHTML += \`
                <div class="flex gap-3">
                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">AI</div>
                    <div class="bg-emerald-50/50 p-3 rounded-2xl max-w-[85%] border border-emerald-100 text-xs">
                        📊 <b>Profiliniz Başarıyla Güncellendi:</b><br>
                        • Vücut Kitle Endeksi: \${bmi.toFixed(1)} (\${cat})<br>
                        • Günlük Kalori İhtiyacı: \${Math.round(tdee)} kcal<br><br>
                        Asistanınız olarak diyet ve spor planınızı buna uygun düzenleyebilirim! Ne sormak istersiniz?
                    </div>
                </div>
            \`;
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        // Fill chat input with question
        function fillChatQuery(text) {
            document.getElementById('chatInput').value = text;
        }

        // Send Chat message and respond with offline/mock flow safely
        function sendChatMessage(e) {
            e.preventDefault();
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (!text) return;

            input.value = "";
            const messagesBox = document.getElementById('chatMessages');

            // Append user msg
            messagesBox.innerHTML += \`
                <div class="flex gap-3 justify-end">
                    <div class="bg-emerald-500 text-white p-3 rounded-2xl max-w-[85%] text-xs sm:text-sm shadow-md shadow-emerald-500/10">
                        \${text}
                    </div>
                </div>
            \`;

            // Auto reply generator helper
            let reply = "Harika bir soru! Sağlıklı bir yaşam için düzenli fiziksel aktivite, günde en az 2.5 litre su tüketimi ve dengeli beslenme (protein-karbonhidrat dengesi) büyük önem taşır.";
            const textLower = text.toLowerCase();

            if (textLower.includes("kahvaltı") || textLower.includes("yemek")) {
                reply = "Yüksek proteinli bir kahvaltı gün boyunca tokluk sürenizi uzatır. Örnek tarif: 2 haşlanmış yumurta, 1 dilim süzme peynir, bol maydanoz-salatalık, 1 dilim tam buğday ekmeği ve yeşil çay.";
            } else if (textLower.includes("ev") || textLower.includes("antrenman") || textLower.includes("spor")) {
                reply = "Haftada 3 gün evde yapabileceğiniz mükemmel bir full-body (tüm vücut) rutini: squat (3 set 12 tekrar), şınav (3 set 10 tekrar), lunge (3 set 12 tekrar) ve plank (3 set 45 saniye).";
            } else if (calculatedBmi && (textLower.includes("kilo") || textLower.includes("vke"))) {
                reply = \`Hesaplanan Vücut Kitle Endeksiniz **\${calculatedBmi.toFixed(1)}**. Bu sonuca göre sağlıklı kiloyu korumak ve yağ kütlesini azaltmak için kardiyo antrenmanlarına ağırlık vermenizi ve şekerli içecekleri tamamen hayatınızdan çıkarmanızı öneririm.\`;
            }

            // Append loader
            const loaderId = "loader_" + Date.now();
            messagesBox.innerHTML += \`
                <div id="\${loaderId}" class="flex gap-3">
                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">AI</div>
                    <div class="bg-slate-50 p-3 rounded-2xl max-w-[85%] border border-slate-100 text-xs text-slate-400 italic">
                        Asistan yanıt yazıyor...
                    </div>
                </div>
            \`;
            messagesBox.scrollTop = messagesBox.scrollHeight;

            setTimeout(() => {
                const loader = document.getElementById(loaderId);
                if (loader) loader.remove();

                messagesBox.innerHTML += \`
                    <div class="flex gap-3">
                        <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">AI</div>
                        <div class="bg-slate-50 p-3 rounded-2xl max-w-[85%] border border-slate-100 text-xs sm:text-sm">
                            \${reply}<br><br><span class="text-[10px] text-slate-400 font-semibold">💡 (Not: Kendi API anahtarınız ile tam GPT/Claude modelini bağladığınızda bu asistan tamamen dinamik akıllı yanıtlar üretir.)</span>
                        </div>
                    </div>
                \`;
                messagesBox.scrollTop = messagesBox.scrollHeight;
            }, 800);
        }

        // Refresh health tips
        function refreshTips() {
            const grid = document.getElementById('tipsGrid');
            const shuffled = [...tipsDb].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            grid.innerHTML = "";
            selected.forEach(tip => {
                grid.innerHTML += \`
                    <div class="bg-white rounded-2xl p-6 border border-slate-150/80 shadow-xs hover:shadow-md transition-all space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md \${tip.bg} \${tip.text}">
                                \${tip.tag}
                            </span>
                        </div>
                        <h3 class="font-bold text-slate-900 text-sm sm:text-base">\${tip.title}</h3>
                        <p class="text-xs text-slate-500 leading-relaxed">\${tip.desc}</p>
                    </div>
                \`;
            });
        }

        // Initialize elements
        refreshTips();
    </script>
</body>
</html>`;

  const copyStandaloneCode = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased flex flex-col justify-between selection:bg-emerald-500/10 selection:text-emerald-700">
      
      {/* 1. NAVIGATION BAR */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10 hover:rotate-6 transition-all">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-950 tracking-tight">
                  FitLife <span className="text-emerald-500">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest leading-none mt-0.5">
                  Sağlık ve Fitness Asistanı
                </span>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "dashboard" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Giriş Paneli
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "calculator" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                VKE & Kalori
              </button>
              <button
                onClick={() => setActiveTab("chatbot")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "chatbot" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                AI Asistanı
              </button>
              <button
                onClick={() => setActiveTab("export")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "export" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Tek Dosya HTML Al
              </button>
            </nav>

            {/* Mobile / Responsive helper */}
            <div className="flex md:hidden items-center">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-bold border border-emerald-100">
                Mobil Aktif
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* 2. DYNAMIC MAIN BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* HERO HERO SECTION */}
            <section className="bg-gradient-to-br from-emerald-50 to-teal-50/20 rounded-3xl p-6 sm:p-10 border border-emerald-100/50 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-400/5 rounded-full blur-3xl"></div>
              
              <div className="space-y-6 max-w-xl relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Kişiselleştirilmiş Sağlık Danışmanı
                </span>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                  Daha Sağlıklı, Enerjik ve <br />
                  <span className="text-emerald-500">Zinde Bir Yaşama</span> Başlayın
                </h1>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Gelişmiş hesaplama modülleriyle vücudunuzun ihtiyaçlarını saniyeler içinde analiz edin. Harris-Benedict formülüyle kalori gereksinimlerinizi öğrenin ve size özel diyet tavsiyeleri için entegre yapay zekamızla hemen sohbet edin.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab("calculator")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/10 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" /> VKE & Kalori Hesapla
                  </button>
                  <button
                    onClick={() => setActiveTab("chatbot")}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-6 rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" /> AI Sohbetine Başla
                  </button>
                </div>
              </div>

              {/* Status Mini Grid widgets */}
              <div className="w-full lg:w-80 space-y-4 shrink-0">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                    <Sparkle className="w-4 h-4 text-amber-500 fill-current" /> Günün Motivasyonu
                  </h3>
                  <blockquote className="text-xs text-slate-600 italic border-l-2 border-emerald-500 pl-3 leading-relaxed">
                    "Bugün yapacağınız küçük, sağlıklı tercihler; yarın kendinize teşekkür etmenizi sağlayacak güçlü adımlardır."
                  </blockquote>
                  <hr className="border-slate-100" />
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hedef Adım</span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-600">10,000 adım</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Su Alımı</span>
                      <span className="text-xs sm:text-sm font-extrabold text-blue-500">2.5 Litre</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TWO COLUMN INTERACTION PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Profile setup card */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-150/85 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Sliders className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-950 text-base">Metrik Hesaplama Alanı</h2>
                    <p className="text-xs text-slate-400">Ölçümlerinizi girip anında sonuç alın</p>
                  </div>
                </div>

                <form onSubmit={handleCalculate} className="space-y-4">
                  {/* Gender toggles */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-2">Cinsiyet</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          gender === "male"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        👨 Erkek
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          gender === "female"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        👩 Kadın
                      </button>
                    </div>
                  </div>

                  {/* Input variables */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1.5">Boy (cm)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="175"
                        required
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1.5">Kilo (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        required
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1.5">Yaş</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        required
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Physical activity level */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Günlük Aktivite Seviyesi</label>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="sedentary">Hareketsiz (Ofis çalışanı, hiç spor yapmıyor)</option>
                      <option value="light">Az Aktif (Hafif tempolu yürüyüşler, haftada 1-2 gün spor)</option>
                      <option value="moderate">Orta Aktif (Haftada 3-5 gün düzenli egzersiz)</option>
                      <option value="active">Çok Aktif (Ağır direnç/hiit antrenmanları, her gün spor)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" /> Hesaplamayı Tamamla
                  </button>
                </form>
              </div>

              {/* Calculations response grid on right */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-150/85 shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-slate-950 text-base mb-1">Analiz Sonuçları</h2>
                  <p className="text-xs text-slate-400 mb-6">Mevcut fiziksel ölçümleriniz esas alınarak oluşturulan detaylı analiz.</p>

                  <AnimatePresence mode="wait">
                    {!hasCalculated ? (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 text-center space-y-3"
                      >
                        <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Lütfen sol taraftan boy, kilo ve yaş bilgilerinizi girerek "Hesaplamayı Tamamla" butonuna basın.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* BMI Card */}
                          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Vücut Kitle Endeksi (VKE)</span>
                            <div className="flex items-baseline gap-2.5">
                              <span className="text-2xl font-extrabold text-slate-900">{bmi?.toFixed(1)}</span>
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${bmiColor}`}>
                                {bmiCategory}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {bmi && bmi < 18.5
                                ? "Kilo aralığınız idealin altında. Besleyici makrolar ve direnç sporları ile sağlıklı kilo alımı önerilir."
                                : bmi && bmi >= 18.5 && bmi < 25
                                ? "Tebrikler, ideal kilo aralığındasınız! Sağlıklı formunuzu korumak için dengeli beslenmeye devam edin."
                                : bmi && bmi >= 25 && bmi < 30
                                ? "İdeal kilonuzun hafif üzerindesiniz. Günlük kalori açığı ve aktif kardiyolar faydalı olacaktır."
                                : "Kilo aralığınız sağlık riskleri taşıyabilecek seviyede. Profesyonel bir kontrolle zayıflama programı önerilir."}
                            </p>
                          </div>

                          {/* Daily Calories Card */}
                          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider font-mono">Günlük Kalori Gereksinimi (TDEE)</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-extrabold text-emerald-600">{tdee && Math.round(tdee)}</span>
                              <span className="text-xs font-semibold text-slate-400 font-mono">kcal / gün</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Mevcut vücut ağırlığınızı ve kas yapınızı sabit tutmak için almanız gereken tahmini günlük enerji miktarıdır.
                            </p>
                          </div>
                        </div>

                        {/* Different goal suggestions */}
                        <div className="space-y-3 pt-2">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hedeflerinize Göre Kalori Dağılımı</span>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl">
                              <span className="text-[9px] text-rose-500 font-extrabold block">Zayıflama</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">{tdee && Math.round(tdee - 500)} kcal</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <span className="text-[9px] text-slate-500 font-extrabold block">Kilo Koruma</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">{tdee && Math.round(tdee)} kcal</span>
                            </div>
                            <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                              <span className="text-[9px] text-emerald-500 font-extrabold block">Kilo Alma</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">{tdee && Math.round(tdee + 300)} kcal</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/40 flex items-start gap-3">
                  <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hesaplama sonuçları bilimsel kabul gören <b>Harris-Benedict</b> formülüne dayanmaktadır. Bu verileri sayfanın altındaki yapay zeka asistanına ileterek, hedefinize özel haftalık örnek diyet planı oluşturtabilirsiniz.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: EXCLUSIVELY CALCULATORS PANEL (For focused users) */}
        {activeTab === "calculator" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left side inputs */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-150/85 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-950 text-base">Metrik Hesaplama Alanı</h2>
                  <p className="text-xs text-slate-400">VKE ve Kalori İhtiyacı İçin Bilgilerinizi Girin</p>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-4">
                
                {/* Gender selections */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-2">Cinsiyet</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        gender === "male"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      👨 Erkek
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        gender === "female"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      👩 Kadın
                    </button>
                  </div>
                </div>

                {/* Main numbers */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Boy (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="175"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Kilo (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Yaş</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Activity level selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Günlük Aktivite Seviyesi</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sedentary">Hareketsiz (Ofis çalışanı, hiç spor yapmıyor)</option>
                    <option value="light">Az Aktif (Hafif tempolu yürüyüşler, haftada 1-2 gün spor)</option>
                    <option value="moderate">Orta Aktif (Haftada 3-5 gün düzenli egzersiz)</option>
                    <option value="active">Çok Aktif (Ağır direnç/hiit antrenmanları, her gün spor)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> Hesapla ve Kaydet
                </button>
              </form>
            </div>

            {/* Calculations right metrics display */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-150/85 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-slate-950 text-base mb-1">Analiz Sonuçları</h2>
                <p className="text-xs text-slate-400 mb-6">Harris-Benedict formülüyle bazal metabolizma hızınız hesaplanmıştır.</p>

                <AnimatePresence mode="wait">
                  {!hasCalculated ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center space-y-3"
                    >
                      <Calculator className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Hesapla butonuna basarak VKE ve günlük kalori ihtiyacı sonuçlarınızı anında görüntüleyin.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* BMI */}
                        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider font-mono">Vücut Kitle Endeksi (VKE)</span>
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-2xl font-extrabold text-slate-900">{bmi?.toFixed(1)}</span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${bmiColor}`}>
                              {bmiCategory}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Normal aralık 18.5 - 24.9 arasıdır. Sağlığınız için ideal kilonuzu koruyun.
                          </p>
                        </div>

                        {/* TDEE */}
                        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider font-mono font-bold">Günlük Toplam Kalori İhtiyacı (TDEE)</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{tdee && Math.round(tdee)}</span>
                            <span className="text-xs font-semibold text-slate-400 font-mono">kcal/gün</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Aktiviteniz dahil edilerek yakılan toplam günlük kalori miktarınızdır.
                          </p>
                        </div>
                      </div>

                      {/* Calorie distribution grid */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hedeflerinize Göre Kalori Dağılımları</span>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl">
                            <span className="text-[9px] text-rose-500 font-bold block">Kilo Verme</span>
                            <span className="text-sm font-extrabold text-slate-900 font-mono">{tdee && Math.round(tdee - 500)} kcal</span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-[9px] text-slate-500 font-bold block">Kilo Koruma</span>
                            <span className="text-sm font-extrabold text-slate-950 font-mono">{tdee && Math.round(tdee)} kcal</span>
                          </div>
                          <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                            <span className="text-[9px] text-emerald-500 font-bold block">Kilo Alma</span>
                            <span className="text-sm font-extrabold text-slate-900 font-mono">{tdee && Math.round(tdee + 300)} kcal</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/40 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <b>FitLife AI</b> üzerinde oluşturduğunuz bu fiziksel profil, yapay zeka asistanımızla konuştuğunuzda otomatik olarak asistanın belleğine aktarılmaktadır.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: HEALTH CHATBOT ASSISTANT */}
        {activeTab === "chatbot" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Info panel on left */}
            <div className="lg:col-span-4 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-150 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 text-base">Yapay Zeka Destekli Sağlık Asistanı</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Uzman bir diyetisyen ve egzersiz koçu rolüne bürünmüş asistanımızla sağlıklı tarifler, antrenman planları ve yaşam tarzı alışkanlıkları üzerine konuşun.
                  </p>
                </div>
              </div>

              {/* Quick suggestions questions to tap */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hızlı Başlangıç Önerileri</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setUserQuery("Hızlı yağ yakımı için haftalık ideal bir kardiyo rutini önerebilir misin?")}
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-600 border border-slate-100 p-2.5 rounded-lg transition-all truncate block cursor-pointer font-medium"
                  >
                    🏃‍♂️ İdeal yağ yakıcı kardiyo rutini?
                  </button>
                  <button
                    onClick={() => setUserQuery("Tatlı krizlerini önlemek için sağlıklı, masum atıştırmalık alternatifleri nelerdir?")}
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-600 border border-slate-100 p-2.5 rounded-lg transition-all truncate block cursor-pointer font-medium"
                  >
                    🥗 Tatlı krizine masum atıştırmalıklar?
                  </button>
                  <button
                    onClick={() => setUserQuery("Masa başı çalışanlar için duruş (postür) bozukluğunu önleyecek esneme egzersizleri nelerdir?")}
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-600 border border-slate-100 p-2.5 rounded-lg transition-all truncate block cursor-pointer font-medium"
                  >
                    🧘‍♂️ Masa başı çalışanlar için postür egzersizleri?
                  </button>
                </div>
              </div>
            </div>

            {/* Conversational Screen area */}
            <div className="lg:col-span-8 flex flex-col h-[480px] bg-white justify-between">
              
              {/* Chat list */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm border leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 text-slate-800 border-slate-100"
                      }`}
                    >
                      {msg.text.split("\n").map((line, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold animate-pulse">
                      ...
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-2xl max-w-[85%] border border-slate-100 text-xs text-slate-400 italic">
                      Yapay zeka asistanı yanıt yazıyor...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input layout */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 flex gap-3">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Sağlık Asistanına bir soru sorun... (Örn: Bugün başım ağrıyor, ne yapmalıyım?)"
                  required
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/15 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" /> Gönder
                </button>
              </form>

            </div>
          </motion.div>
        )}

        {/* TAB 4: CODE EXPORTER PRE-RENDER */}
        {activeTab === "export" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 border border-slate-150/80 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h2 className="font-extrabold text-slate-950 text-base sm:text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" /> Tek Dosya (index.html) Dışa Aktarımı
                </h2>
                <p className="text-xs text-slate-400">
                  CSS, HTML ve JavaScript mantığının tamamını içeren bağımsız tek bir dosya. Bilgisayarınızda çift tıklayarak çalıştırabilirsiniz.
                </p>
              </div>

              <button
                onClick={copyStandaloneCode}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/15 cursor-pointer flex items-center gap-2 self-start sm:self-center"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" /> Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Kodu Kopyala
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[400px] leading-relaxed scrollbar">
              <pre>{standaloneHtmlCode}</pre>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <p className="text-xs text-emerald-800 leading-relaxed">
                <b>Nasıl Çalıştırılır?</b> Yukarıdaki kodu kopyalayın, bilgisayarınızda yeni bir metin belgesi oluşturun ve adını <code>index.html</code> olarak kaydedin. Tarayıcınızla (Chrome, Edge, Safari vb.) dosyayı açıp dilediğiniz gibi kullanabilirsiniz.
              </p>
            </div>
          </motion.div>
        )}

        {/* GÜNLÜK SAĞLIK İPUÇLARI BÖLÜMÜ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-950 text-xl tracking-tight flex items-center gap-2">
                <Apple className="w-5 h-5 text-emerald-500" /> Günlük Sağlık İpuçları
              </h2>
              <p className="text-xs text-slate-500">
                Sağlıklı bir yaşam sürdürmeniz için rastgele değişen pratik, bilimsel tavsiyeler.
              </p>
            </div>
            
            <button
              onClick={generateTips}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all border border-emerald-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" /> İpuçlarını Yenile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {randomTips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-slate-150/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${tip.color}`}>
                        {tip.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-950 text-sm sm:text-base">{tip.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Günlük Güncel Bilgi
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* 3. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800 text-xs text-center select-none">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">FL</div>
            <span className="font-extrabold text-white tracking-tight">FitLife AI</span>
          </div>
          <p className="max-w-md mx-auto text-slate-500 text-[11px] leading-relaxed">
            FitLife AI platformu sağlıklı yaşam ve spor aktivitelerinize yardımcı olmak amacıyla tasarlanmıştır. Bu platformdaki bilgiler tıbbi tanı veya tedavi niteliği taşımaz. Şiddetli şikayetlerinizde hekiminize danışınız.
          </p>
          <div className="text-slate-600 text-[10px] pt-4 border-t border-slate-800/80 max-w-xs mx-auto flex items-center justify-center gap-1.5">
            <span>Powered by Gemini 3.5 & React 18</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
