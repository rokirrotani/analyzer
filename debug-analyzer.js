import axios from 'axios';

console.log("🚀 Avvio del programma...");

const getCryptoData = async () => {
    console.log("📡 Recupero dati delle criptovalute...");
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5, // Ridotto per test più veloci
                page: 1,
                sparkline: false
            }
        });

        console.log("✅ Dati ricevuti con successo!");
        return response.data;
    } catch (error) {
        console.error("❌ Errore nel recupero dei dati:", error.message);
        return null;
    }
};

// Avvia la funzione
(async () => {
    console.log("🔍 Chiamata all'API...");
    const data = await getCryptoData();
    
    if (!data) {
        console.log("⚠️ Nessun dato ricevuto. Controlla la tua connessione o l'API.");
        return;
    }

    console.log("📊 Stampiamo le criptovalute:");
    data.forEach((crypto, index) => {
        console.log(`${index + 1}. ${crypto.name} (${crypto.symbol.toUpperCase()}) - Prezzo: $${crypto.current_price}`);
    });

    console.log("🏁 Fine del programma.");
})();
