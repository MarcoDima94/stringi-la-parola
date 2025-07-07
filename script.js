document.addEventListener('DOMContentLoaded', () => {
    // Schermate
    const screens = {
        home: document.getElementById('home-screen'),
        modeSelection: document.getElementById('mode-selection-screen'),
        difficulty: document.getElementById('difficulty-screen'),
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('game-over-win-screen'),
        lose: document.getElementById('game-over-lose-screen'),
    };

    // Pulsanti di navigazione
    const goToModeSelectionBtn = document.getElementById('go-to-mode-selection-btn');
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const difficultyBeginnerBtn = document.getElementById('difficulty-beginner-btn');
    const difficultyIntermediateBtn = document.getElementById('difficulty-intermediate-btn');
    const difficultyExpertBtn = document.getElementById('difficulty-expert-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    // Pulsanti Indietro
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const backToDifficultySetupBtn = document.getElementById('back-to-difficulty-setup-btn');
    const backToDifficultyGameBtn = document.getElementById('back-to-difficulty-game-btn');

    // Pulsanti di gioco
    const surrenderBtn = document.getElementById('surrender-btn');
    const submitGuessBtn = document.getElementById('submit-guess-btn');
    const showWordBtn = document.getElementById('show-word-btn');
    
    // Elementi di gioco
    const setupRulesEl = document.getElementById('setup-rules');
    const secretWordInput = document.getElementById('secret-word-input');
    const guessInput = document.getElementById('guess-input');
    const guessesList = document.getElementById('guesses-list');
    const lowerBoundEl = document.getElementById('lower-bound');
    const upperBoundEl = document.getElementById('upper-bound');

    // Elementi Fine Gioco
    const finalWordWinEl = document.getElementById('final-word-win');
    const finalWordLoseEl = document.getElementById('final-word-lose');
    const newGameWinBtn = document.getElementById('new-game-win-btn');
    const newGameLoseBtn = document.getElementById('new-game-lose-btn');

    // Modale
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');

    const wordList = [ "RE", "BLU", "THE", "SCI", "GAS", "GEL", "CASA", "CANE", "GATTO", "MANO", "PANE", "SALE", "SOLE", "LUNA", "MARE", "NEVE", "NASO", "NIDO", "MUSO", "RETE", "RISO", "UVA", "UOMO", "DONNA", "FUOCO", "FUMO", "GIOCO", "GARA", "FILO", "DITO", "DADO", "CUBO", "CAVO", "ARCO", "ARTE", "ANNO", "MELA", "PERA", "FICO", "FAME", "SETE", "NOME", "FOTO", "VIDEO", "TEST", "QUIZ", "LIBRO", "FIORE", "VENTO", "TRENO", "PORTA", "PESCE", "TEMPO", "TERRA", "AMICO", "FORNO", "RADIO", "PIZZA", "PASTA", "PRATO", "PONTE", "PARCO", "PIEDE", "SALTO", "SCALA", "SEDIA", "TAVOLO", "TETTO", "TORRE", "VETRO", "VOLPE", "ZEBRA", "ALBERO", "BANANA", "BARCA", "BOSCO", "CAMPO", "CARTA", "CUORE", "FESTA", "FORTE", "FRIGO", "GABBIA", "MAGLIA", "MUSICA", "NUVOLA", "OCCHI", "PIANTA", "SABBIA", "SCARPA", "SCUOLA", "STRADA", "TEATRO", "UOVO", "ZAINO", "ZUCCHERO", "AEREO", "ANELLO", "ANGURIA", "ANIMALE", "ARMADIO", "BAMBOLA", "BATTITO", "BOTTIGLIA", "BRACCIO", "CACCIA", "CALCIO", "CAMERA", "CANDELA", "CAPELLI", "CASTELLO", "CERVELLO", "CHIAVE", "CHITARRA", "CIELO", "CUCINA", "CUSCINO", "DIAMANTE", "FINESTRA", "FOGLIA", "FORMICA", "FRATELLO", "GIARDINO", "GIORNALE", "LAVAGNA", "LUCERTOLA", "MACCHINA", "MAGAZZINO", "MAPPAMONDO", "MEDICINA", "MONTAGNA", "MOTORE", "MUSEO", "NEGOZIO", "OSPEDALE", "OROLOGIO", "PALAZZO", "PANTERA", "PATATA", "PAVIMENTO", "PENNARELLO", "PIANETA", "PIPISTRELLO", "PIRAMIDE", "PISTOLA", "POMODORO", "QUADRO", "RAGNATELA", "REGALO", "SCATOLA", "SCRIVANIA", "SERPENTE", "SPAZZOLA", "SPECCHIO", "SPIAGGIA", "STAZIONE", "TELEFONO", "TELEVISIONE", "TEMPESTA", "TIGRE", "TRATTORE", "UNIVERSO", "VULCANO"];
    
    // Variabili di stato
    let secretWord = '';
    let lowerBound = 'A';
    let upperBound = 'Z';
    let isSinglePlayer = false;
    let difficultySettings = {};
    
    // Funzione per mostrare le schermate
    const showScreen = (screenKey) => {
        for (const key in screens) {
            if (screens[key]) screens[key].classList.remove('active');
        }
        if (screens[screenKey]) screens[screenKey].classList.add('active');
        
        // Gestisce visibilità dei pulsanti speciali
        surrenderBtn.style.display = (screenKey === 'game' && isSinglePlayer) ? 'inline-flex' : 'none';
        showWordBtn.style.display = (screenKey === 'game' && !isSinglePlayer) ? 'inline-flex' : 'none';
    };
    
    // --- NAVIGAZIONE ---
    goToModeSelectionBtn.addEventListener('click', () => showScreen('modeSelection'));
    backToHomeBtn.addEventListener('click', () => showScreen('home'));
    backToModeBtn.addEventListener('click', () => showScreen('modeSelection'));
    backToDifficultySetupBtn.addEventListener('click', () => showScreen('difficulty'));
    backToDifficultyGameBtn.addEventListener('click', () => showScreen('difficulty'));

    const handleModeSelection = (isSingle) => {
        isSinglePlayer = isSingle;
        showScreen('difficulty');
    };

    singlePlayerBtn.addEventListener('click', () => handleModeSelection(true));
    multiplayerBtn.addEventListener('click', () => handleModeSelection(false));

    const setDifficulty = (settings) => {
        difficultySettings = settings;
        if (isSinglePlayer) {
            const validWords = wordList.filter(word => word.length >= settings.min && word.length <= settings.max);
            if (validWords.length === 0) {
                alert('Nessuna parola disponibile per questa difficoltà!');
                return;
            }
            secretWord = validWords[Math.floor(Math.random() * validWords.length)];
            resetGame();
            showScreen('game');
        } else {
            setupRulesEl.textContent = `Il Master deve inserire una parola da ${settings.min} a ${settings.max} lettere.`;
            if (settings.max === Infinity) {
                 setupRulesEl.textContent = `Il Master deve inserire una parola con ${settings.min} o più lettere.`;
            }
            showScreen('setup');
        }
    };

    difficultyBeginnerBtn.addEventListener('click', () => setDifficulty({ min: 1, max: 4 }));
    difficultyIntermediateBtn.addEventListener('click', () => setDifficulty({ min: 5, max: 6 }));
    difficultyExpertBtn.addEventListener('click', () => setDifficulty({ min: 7, max: Infinity }));

    startGameBtn.addEventListener('click', () => {
        const word = secretWordInput.value.trim().toUpperCase();
        const { min, max } = difficultySettings;

        if (!/^[A-ZÀ-ÙÈ-Ò]+$/.test(word)) {
            alert('Per favore, inserisci una parola valida (solo lettere).');
            return;
        }

        if (word.length < min || word.length > max) {
            let ruleText = `La parola deve avere tra ${min} e ${max} lettere.`;
            if (max === Infinity) ruleText = `La parola deve avere almeno ${min} lettere.`;
            alert(`Regola non rispettata! ${ruleText}`);
            return;
        }
        
        secretWord = word;
        resetGame();
        showScreen('game');
    });

    // --- LOGICA DI GIOCO ---
    submitGuessBtn.addEventListener('click', () => {
        const guess = guessInput.value.trim().toUpperCase();
        if (!guess) return;

        if (guess === secretWord) {
            finalWordWinEl.textContent = secretWord;
            showScreen('win');
            return;
        }
        
        let hint = '';
        if (guess < secretWord) {
            hint = 'Dopo <i class="fa-solid fa-arrow-right"></i>';
            if (guess > lowerBound) {
                lowerBound = guess;
                document.getElementById('lower-bound').textContent = `"${lowerBound}"`;
            }
        } else {
            hint = '<i class="fa-solid fa-arrow-left"></i> Prima';
            if (guess < upperBound || upperBound === 'Z') {
                upperBound = guess;
                document.getElementById('upper-bound').textContent = `"${upperBound}"`;
            }
        }
        const li = document.createElement('li');
        li.innerHTML = `<span>${guess}</span> <strong>${hint}</strong>`;
        guessesList.prepend(li);
        guessInput.value = '';
        guessInput.focus();
    });
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuessBtn.click();
    });

    showWordBtn.addEventListener('click', () => alert(`La parola segreta è: ${secretWord}`));
    surrenderBtn.addEventListener('click', () => {
        finalWordLoseEl.textContent = secretWord;
        showScreen('lose');
    });

    // --- NUOVA PARTITA ---
    const startNewGame = () => {
        resetGame();
        showScreen('modeSelection');
    };
    
    newGameWinBtn.addEventListener('click', startNewGame);
    newGameLoseBtn.addEventListener('click', startNewGame);

    // --- LOGICA MODALE TUTORIAL ---
    const openModal = () => helpModal.classList.add('show');
    const closeModal = () => helpModal.classList.remove('show');

    tutorialBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    closeTutorialBtn.addEventListener('click', closeModal);
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) closeModal();
    });

    const resetGame = () => {
        secretWordInput.value = '';
        guessInput.value = '';
        guessesList.innerHTML = '';
        document.getElementById('lower-bound').textContent = 'A';
        document.getElementById('upper-bound').textContent = 'Z';
        lowerBound = 'A';
        upperBound = 'Z';
    };

    // Inizializza l'app
    showScreen('home');
});