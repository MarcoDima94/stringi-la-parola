document.addEventListener('DOMContentLoaded', () => {
    // Contenitore principale
    const gameContainer = document.querySelector('.game-container');

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

    // Pulsanti
    const goToModeSelectionBtn = document.getElementById('go-to-mode-selection-btn');
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const difficultyBeginnerBtn = document.getElementById('difficulty-beginner-btn');
    const difficultyIntermediateBtn = document.getElementById('difficulty-intermediate-btn');
    const difficultyExpertBtn = document.getElementById('difficulty-expert-btn');
    
    // Toolbar
    const toolbarBackBtn = document.getElementById('toolbar-back-btn');
    const toolbarSurrenderBtn = document.getElementById('toolbar-surrender-btn');

    // Elementi di gioco e altri
    const setupRulesEl = document.getElementById('setup-rules');
    const secretWordInput = document.getElementById('secret-word-input');
    const startGameBtn = document.getElementById('start-game-btn');
    const guessInput = document.getElementById('guess-input');
    const submitGuessBtn = document.getElementById('submit-guess-btn');
    const guessesList = document.getElementById('guesses-list');
    const lowerBoundEl = document.getElementById('lower-bound');
    const upperBoundEl = document.getElementById('upper-bound');
    const showWordBtn = document.getElementById('show-word-btn');
    const finalWordWinEl = document.getElementById('final-word-win');
    const finalWordLoseEl = document.getElementById('final-word-lose');
    const newGameWinBtn = document.getElementById('new-game-win-btn');
    const newGameLoseBtn = document.getElementById('new-game-lose-btn');
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');

    const wordList = [
        // Parole Corte (Principiante)
        "RE", "BLU", "THE", "SCI", "GAS", "GEL", "GIA", "SUA", "MIA", "NEI", "TRE",
        "CASA", "CANE", "GATTO", "MANO", "PANE", "SALE", "SOLE", "LUNA", "MARE", "NEVE", 
        "NASO", "NIDO", "MUSO", "RETE", "RISO", "UVA", "UOMO", "DONNA", "FUOCO", "FUMO",
        "GIOCO", "GARA", "FILO", "DITO", "DADO", "CUBO", "CAVO", "ARCO", "ARTE", "ANNO", 
        "MELA", "PERA", "FICO", "FAME", "SETE", "NOME", "FOTO", "VIDEO", "TEST", "QUIZ", 

        // Parole Medie (Intermedio)
        "LIBRO", "FIORE", "VENTO", "TRENO", "PORTA", "PESCE", "TEMPO", "TERRA", "AMICO",
        "FORNO", "RADIO", "PIZZA", "PASTA", "PRATO", "PONTE", "PARCO", "PIEDE", "SALTO",
        "SCALA", "SEDIA", "TAVOLO", "TETTO", "TORRE", "VETRO", "VOLPE", "ZEBRA",
        "ALBERO", "BANANA", "BARCA", "BOSCO", "CAMPO", "CARTA", "CUORE", "FESTA",
        "FORTE", "FRIGO", "GABBIA", "MAGLIA", "MUSICA", "NUVOLA", "OCCHI", "PIANTA", 
        "SABBIA", "SCARPA", "SCUOLA", "STRADA", "TEATRO", "UOVO",

        // Parole Lunghe (Esperto)
        "ZAINO", "ZUCCHERO", "AEREO", "ANELLO", "ANGURIA", "ANIMALE", "ARMADIO",
        "BAMBOLA", "BATTITO", "BOTTIGLIA", "BRACCIO", "CACCIA", "CALCIO", "CAMERA",
        "CANDELA", "CAPELLI", "CASTELLO", "CERVELLO", "CHIAVE", "CHITARRA", "CIELO",
        "CUCINA", "CUSCINO", "DIAMANTE", "FINESTRA", "FOGLIA", "FORMICA", "FRATELLO",
    
        "GIARDINO", "GIORNALE", "LAVAGNA", "LUCERTOLA", "MACCHINA", "MAGAZZINO",
        "MAPPAMONDO", "MEDICINA", "MONTAGNA", "MOTORE", "MUSEO", "NEGOZIO",
        "OSPEDALE", "OROLOGIO", "PALAZZO", "PANTERA", "PATATA", "PAVIMENTO",
        "PENNARELLO", "PIANETA", "PIPISTRELLO", "PIRAMIDE", "PISTOLA", "POMODORO",
        "QUADRO", "RAGNATELA", "REGALO", "SCATOLA", "SCRIVANIA", "SERPENTE",
        "SPAZZOLA", "SPECCHIO", "SPIAGGIA", "STAZIONE", "TELEFONO", "TELEVISIONE",
        "TEMPESTA", "TIGRE", "TRATTORE", "UNIVERSO", "VULCANO"
    ];
    
    // Variabili di stato
    let secretWord = '';
    let lowerBound = 'A';
    let upperBound = 'Z';
    let isSinglePlayer = false;
    let activeScreenKey = 'home';
    let difficultySettings = {};
    
    // Funzione per mostrare le schermate
    const showScreen = (screenKey) => {
        // Applica o rimuove lo stile trasparente al contenitore
        if (screenKey === 'home') {
            gameContainer.classList.add('is-home');
        } else {
            gameContainer.classList.remove('is-home');
        }

        // Nascondi tutte le schermate
        for (const key in screens) {
            screens[key].classList.remove('active');
        }
        // Mostra solo quella desiderata
        screens[screenKey].classList.add('active');
        
        activeScreenKey = screenKey;
        updateToolbar();
    };

    // Funzione per aggiornare la barra degli strumenti
    const updateToolbar = () => {
        toolbarBackBtn.classList.remove('visible');
        toolbarSurrenderBtn.classList.remove('visible');

        switch (activeScreenKey) {
            case 'modeSelection':
            case 'difficulty':
            case 'setup':
            case 'game':
                toolbarBackBtn.classList.add('visible');
                break;
        }

        if (activeScreenKey === 'game' && isSinglePlayer) {
            toolbarSurrenderBtn.classList.add('visible');
        }
    };
    
    // --- NAVIGAZIONE ---
    goToModeSelectionBtn.addEventListener('click', () => {
        // **MODIFICA QUI: Aggiunto ritardo di 500ms (mezzo secondo)**
        setTimeout(() => {
            showScreen('modeSelection');
        }, 500);
    });
    
    toolbarBackBtn.addEventListener('click', () => {
        switch (activeScreenKey) {
            case 'modeSelection': showScreen('home'); break;
            case 'difficulty': showScreen('modeSelection'); break;
            case 'setup':
            case 'game': showScreen('difficulty'); break;
        }
    });

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
                alert('Nessuna parola disponibile per questa difficoltà! Scegline un\'altra.');
                showScreen('difficulty');
                return;
            }
            secretWord = validWords[Math.floor(Math.random() * validWords.length)];
            resetGame();
            showWordBtn.style.display = 'none';
            showScreen('game');
        } else {
            setupRulesEl.textContent = `Il Master deve inserire una parola da ${settings.min} a ${settings.max} lettere.`;
            if (settings.max === Infinity) {
                 setupRulesEl.textContent = `Il Master deve inserire una parola con più di ${settings.min - 1} lettere.`;
            }
            showWordBtn.style.display = 'inline-block';
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
                lowerBoundEl.textContent = `"${lowerBound}"`;
            }
        } else {
            hint = '<i class="fa-solid fa-arrow-left"></i> Prima';
            if (guess < upperBound || upperBound === 'Z') {
                upperBound = guess;
                upperBoundEl.textContent = `"${upperBound}"`;
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
    toolbarSurrenderBtn.addEventListener('click', () => {
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
        lowerBound = 'A';
        upperBound = 'Z';
        lowerBoundEl.textContent = 'A';
        upperBoundEl.textContent = 'Z';
    };

    // Inizializza lo stato corretto della UI alla partenza
    showScreen('home');
});