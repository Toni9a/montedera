export interface Phrase {
  en: string;
  local: string;
  category: "greetings" | "dining" | "shopping" | "fun";
}

export const phrases: Phrase[] = [
  { en: "Hi", local: "Zdravo", category: "greetings" },
  { en: "Thank you", local: "Hvala", category: "greetings" },
  { en: "Please", local: "Molim", category: "greetings" },
  { en: "Cheers!", local: "Živjeli!", category: "fun" },
  { en: "Table for 3, please", local: "Sto za troje, molim", category: "dining" },
  { en: "The bill, please", local: "Račun, molim", category: "dining" },
  { en: "How much is this?", local: "Koliko ovo košta?", category: "shopping" },
  { en: "How many calories?", local: "Koliko kalorija ima?", category: "dining" },
  { en: "One more, please", local: "Još jedno, molim", category: "dining" },
  { en: "Delicious!", local: "Ukusno!", category: "fun" },
  { en: "Where's the bathroom?", local: "Gdje je toalet?", category: "greetings" },
  { en: "My friend is amazing", local: "Moja drugarica je nevjerovatna", category: "fun" },
  { en: "What's your number?", local: "Koji je tvoj broj?", category: "fun" },
  { en: "We're on a girls trip!", local: "Mi smo na djevojačkom putovanju!", category: "fun" },
  { en: "Beautiful!", local: "Prelijepo!", category: "fun" },
];
