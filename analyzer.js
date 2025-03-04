import axios from 'axios';
import chalk from 'chalk';
import Table from 'cli-table3';

// Recupera i dati delle criptovalute
const getCryptoData = async () => {
    console.log("📡 Recupero dati delle criptovalute...");
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 30, // Analizziamo 30 crypto
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

// Mostra una tabella con i dati crypto
const displayTable = (data, title) => {
    console.log(chalk.blue.bold(`\n📊 ${title} 📊`));
    const table = new Table({
        head: ['Nome', 'Simbolo', 'Prezzo ($)', 'Variazione 24h (%)', 'Volume ($)'],
        colWidths: [20, 10, 15, 20, 20]
    });

    data.forEach(crypto => {
        const changeColor = crypto.price_change_percentage_24h > 0 ? chalk.green : chalk.red;
        table.push([
            chalk.blue(crypto.name),
            chalk.yellow(crypto.symbol.toUpperCase()),
            `$${crypto.current_price.toFixed(2)}`,
            changeColor(`${crypto.price_change_percentage_24h.toFixed(2)}%`),
            `$${crypto.total_volume.toLocaleString()}`
        ]);
    });

    console.log(table.toString());
};

// Seleziona le migliori 5 criptovalute per investimenti sicuri
const suggestSafeInvestments = (data) => {
    const sorted = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    const top5 = sorted.slice(0, 5);

    console.log(chalk.yellow.bold("\n💡 TOP 5 CRIPTOVALUTE PER INVESTIMENTO SICURO 💡"));
    top5.forEach((crypto, index) => {
        console.log(chalk.cyan.bold(`${index + 1}. ${crypto.name} (${crypto.symbol.toUpperCase()})`));
        console.log(`📈 Variazione 24h: ${chalk.green(crypto.price_change_percentage_24h.toFixed(2) + '%')}`);
        console.log(`💲 Prezzo attuale: $${crypto.current_price.toFixed(2)}`);
        console.log(`📊 Volume di scambio: $${crypto.total_volume.toLocaleString()}\n`);
    });

    return top5;
};

// Seleziona le migliori 5 criptovalute per alto rischio e guadagni veloci
const suggestHighRiskInvestments = (data) => {
    let highRisk = data
        .filter(crypto => crypto.total_volume > 100_000_000) // Solo crypto con volume decente
        .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)) // Ordina per volatilità
        .slice(0, 5); // Prendi le 5 più volatili

    console.log(chalk.red.bold("\n🔥 TOP 5 CRIPTOVALUTE AD ALTO RISCHIO PER SOLDI VELOCI 🔥"));
    highRisk.forEach((crypto, index) => {
        const trend = crypto.price_change_percentage_24h > 0 ? "🚀" : "⚠️";
        console.log(chalk.magenta.bold(`${index + 1}. ${crypto.name} (${crypto.symbol.toUpperCase()})`));
        console.log(`${trend} Variazione 24h: ${crypto.price_change_percentage_24h > 0 
            ? chalk.green(`${crypto.price_change_percentage_24h.toFixed(2)}%`) 
            : chalk.red(`${crypto.price_change_percentage_24h.toFixed(2)}%`)}`);
                console.log(`💲 Prezzo attuale: $${crypto.current_price.toFixed(2)}`);
        console.log(`📊 Volume di scambio: $${crypto.total_volume.toLocaleString()}\n`);
    });

    return highRisk;
};

// Funzione principale
const main = async () => {
    console.log("🚀 Avvio dell'analisi del mercato crypto...\n");

    const data = await getCryptoData();
    if (!data) {
        console.log("⚠️ Nessun dato ricevuto. Controlla la tua connessione o l'API.");
        return;
    }

    displayTable(data, "Panoramica del Mercato Crypto");
    suggestSafeInvestments(data);
    suggestHighRiskInvestments(data);

    console.log("🏁 Fine dell'analisi.");
};

// Esegue il programma
main();
