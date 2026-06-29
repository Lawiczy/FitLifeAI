export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: "Gerekli" | "İsteğe Bağlı";
  aiReasoning: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  consentExpiry: string;
  status: "Aktif" | "Süresi Doldu" | "Bağlantı Kesildi";
}

export interface BankOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
