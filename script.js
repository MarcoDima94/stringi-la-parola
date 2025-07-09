document.addEventListener('DOMContentLoaded', () => {
    // Schermate
    const screens = {
        login: document.getElementById('login-screen'),
        home: document.getElementById('home-screen'),
        profile: document.getElementById('profile-screen'),
        modeSelection: document.getElementById('mode-selection-screen'),
        difficulty: document.getElementById('difficulty-screen'),
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        progress: document.getElementById('progress-screen'),
        win: document.getElementById('game-over-win-screen'),
        lose: document.getElementById('game-over-lose-screen'),
    };

    // Elementi Globali
    const globalProfileContainer = document.getElementById('global-profile-container');
    const profileBtn = document.getElementById('profile-btn');

    // Pulsanti di navigazione
    const loginBtn = document.getElementById('login-btn');
    const goToModeSelectionBtn = document.getElementById('go-to-mode-selection-btn');
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const difficultyBeginnerBtn = document.getElementById('difficulty-beginner-btn');
    const difficultyIntermediateBtn = document.getElementById('difficulty-intermediate-btn');
    const difficultyExpertBtn = document.getElementById('difficulty-expert-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const newGameWinBtn = document.getElementById('new-game-win-btn');
    const newGameLoseBtn = document.getElementById('new-game-lose-btn');
    const continueBtn = document.getElementById('continue-btn');

    // Pulsanti Indietro
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const backToHomeFromProfileBtn = document.getElementById('back-to-home-from-profile-btn');
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const backToDifficultySetupBtn = document.getElementById('back-to-difficulty-setup-btn');
    const backToDifficultyGameBtn = document.getElementById('back-to-difficulty-game-btn');

    // Pulsanti di gioco
    const surrenderBtn = document.getElementById('surrender-btn');
    const submitGuessBtn = document.getElementById('submit-guess-btn');
    const showWordBtn = document.getElementById('show-word-btn');
    
    // Elementi dinamici
    const playerNameInput = document.getElementById('player-name-input');
    const homePlayerName = document.getElementById('home-player-name');
    const profilePlayerName = document.getElementById('profile-player-name');
    const profileLevel = document.getElementById('profile-level');
    const profileXp = document.getElementById('profile-xp');
    const profileProgressBar = document.getElementById('profile-progress-bar');
    const postGameProgressBar = document.getElementById('post-game-progress-bar');
    const postGameXp = document.getElementById('post-game-xp');
    const levelUpAnimationEl = document.getElementById('level-up-animation');
    const setupRulesEl = document.getElementById('setup-rules');
    const secretWordInput = document.getElementById('secret-word-input');
    const guessInput = document.getElementById('guess-input');
    const guessesList = document.getElementById('guesses-list');
    const lowerBoundEl = document.getElementById('lower-bound');
    const upperBoundEl = document.getElementById('upper-bound');
    const finalWordWinEl = document.getElementById('final-word-win');
    const finalWordLoseEl = document.getElementById('final-word-lose');

    // Modale Aiuto
    const helpBtn = document.getElementById('help-btn');
    const hintModal = document.getElementById('hint-modal');
    const hintModalCloseBtn = document.getElementById('hint-modal-close-btn');
    const hintTokenCount = document.getElementById('hint-token-count');
    const useHintBtn = document.getElementById('use-hint-btn');
    const hintDisplay = document.getElementById('hint-display');

    // Modale Tutorial
    const tutorialModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');

    const wordList = [ "RE", "BLU", "THE", "SCI", "GAS", "GEL", "CASA", "CANE", "GATTO", "MANO", "PANE", "SALE", "SOLE", "LUNA", "MARE", "NEVE", "NASO", "NIDO", "MUSO", "RETE", "RISO", "UVA", "UOMO", "DONNA", "FUOCO", "FUMO", "GIOCO", "GARA", "FILO", "DITO", "DADO", "CUBO", "CAVO", "ARCO", "ARTE", "ANNO", "MELA", "PERA", "FICO", "FAME", "SETE", "NOME", "FOTO", "VIDEO", "TEST", "QUIZ", "LIBRO", "FIORE", "VENTO", "TRENO", "PORTA", "PESCE", "TEMPO", "TERRA", "AMICO", "FORNO", "RADIO", "PIZZA", "PASTA", "PRATO", "PONTE", "PARCO", "PIEDE", "SALTO", "SCALA", "SEDIA", "TAVOLO", "TETTO", "TORRE", "VETRO", "VOLPE", "ZEBRA", "ALBERO", "BANANA", "BARCA", "BOSCO", "CAMPO", "CARTA", "CUORE", "FESTA", "FORTE", "FRIGO", "GABBIA", "MAGLIA", "MUSICA", "NUVOLA", "OCCHI", "PIANTA", "SABBIA", "SCARPA", "SCUOLA", "STRADA", "TEATRO", "UOVO", "ZAINO", "ZUCCHERO", "AEREO", "ANELLO", "ANGURIA", "ANIMALE", "ARMADIO", "BAMBOLA", "BATTITO", "BOTTIGLIA", "BRACCIO", "CACCIA", "CALCIO", "CAMERA", "CANDELA", "CAPELLI", "CASTELLO", "CERVELLO", "CHIAVE", "CHITARRA", "CIELO", "CUCINA", "CUSCINO", "DIAMANTE", "FINESTRA", "FOGLIA", "FORMICA", "FRATELLO", "GIARDINO", "GIORNALE", "LAVAGNA", "LUCERTOLA", "MACCHINA", "MAGAZZINO", "MAPPAMONDO", "MEDICINA", "MONTAGNA", "MOTORE", "MUSEO", "NEGOZIO", "OSPEDALE", "OROLOGIO", "PALAZZO", "PANTERA", "PATATA", "PAVIMENTO", "PENNARELLO", "PIANETA", "PIPISTRELLO", "PIRAMIDE", "PISTOLA", "POMODORO", "QUADRO", "RAGNATELA", "REGALO", "SCATOLA", "SCRIVANIA", "SERPENTE", "SPAZZOLA", "SPECCHIO", "SPIAGGIA", "STAZIONE", "TELEFONO", "TELEVISIONE", "TEMPESTA", "TIGRE", "TRATTORE", "UNIVERSO", "VULCANO"];
    
    // --- VARIABILI DI STATO ---
    let player = { name: '', level: 1, xp: 0, tokens: 5 };
    const MAX_LEVEL = 20;
    let secretWord = '';
    let revealedLetters = [];
    let lowerBound = 'A';
    let upperBound = 'Z';
    let isSinglePlayer = false;
    let difficultySettings = {};

    // --- FUNZIONI DI GESTIONE DATI E LIVELLI ---
    const xpForNextLevel = (level) => 10 + (level - 1) * 5;

    const savePlayerData = () => {
        localStorage.setItem('stringiLaParolaPlayer', JSON.stringify(player));
    };

    const loadPlayerData = () => {
        const playerData = localStorage.getItem('stringiLaParolaPlayer');
        if (playerData) {
            player = JSON.parse(playerData);
            if (player.tokens === undefined) {
                player.tokens = 5;
            }
            showScreen('home');
        } else {
            showScreen('login');
        }
    };

    const addXp = (amount) => {
        if (player.level >= MAX_LEVEL) {
            updateProgressScreen(false);
            showScreen('progress');
            return;
        }

        let didLevelUp = false;
        player.xp += amount;
        
        let requiredXp = xpForNextLevel(player.level);
        while (player.xp >= requiredXp && player.level < MAX_LEVEL) {
            player.level++;
            player.xp -= requiredXp;
            player.tokens += 5;
            didLevelUp = true;
            requiredXp = xpForNextLevel(player.level);
        }
        
        savePlayerData();
        updateProgressScreen(didLevelUp);
    };

    const updateProfileScreen = () => {
        const requiredXp = xpForNextLevel(player.level);
        profilePlayerName.textContent = player.name;
        profileLevel.textContent = player.level;
        if (player.level < MAX_LEVEL) {
            profileXp.textContent = `${player.xp} / ${requiredXp}`;
            profileProgressBar.style.width = `${(player.xp / requiredXp) * 100}%`;
        } else {
            profileXp.textContent = "MAX";
            profileProgressBar.style.width = '100%';
        }
    };
    
    const updateProgressScreen = (didLevelUp) => {
        const requiredXp = xpForNextLevel(player.level);
        levelUpAnimationEl.classList.toggle('animate', didLevelUp);
        
        if (player.level < MAX_LEVEL) {
            postGameXp.textContent = `${player.xp} / ${requiredXp}`;
            setTimeout(() => { 
                postGameProgressBar.style.width = `${(player.xp / requiredXp) * 100}%`;
            }, 100);
        } else {
            postGameXp.textContent = "LIVELLO MASSIMO";
            postGameProgressBar.style.width = '100%';
        }
    };

    const updateHintDisplay = () => {
        if (!secretWord) {
            hintDisplay.textContent = '';
            return;
        }
        const display = secretWord.split('').map((letter, index) => {
            return revealedLetters.includes(index) ? letter : '_';
        }).join(' ');
        hintDisplay.textContent = display;
    };

    const resetGame = () => {
        secretWordInput.value = '';
        guessInput.value = '';
        guessesList.innerHTML = '';
        document.getElementById('lower-bound').textContent = 'A';
        document.getElementById('upper-bound').textContent = 'Z';
        lowerBound = 'A';
        upperBound = 'Z';
        revealedLetters = [];
        updateHintDisplay();
    };

    // --- LOGICA DI NAVIGAZIONE E DI GIOCO ---
    const showScreen = (screenKey) => {
        for (const key in screens) {
            if (screens[key]) screens[key].classList.remove('active');
        }
        if (screens[screenKey]) screens[screenKey].classList.add('active');
        
        globalProfileContainer.style.display = (screenKey === 'login') ? 'none' : 'block';
        
        if (screenKey === 'home') {
            homePlayerName.textContent = player.name;
        }

        surrenderBtn.style.display = (screenKey === 'game' && isSinglePlayer) ? 'inline-flex' : 'none';
        showWordBtn.style.display = (screenKey === 'game' && !isSinglePlayer) ? 'inline-flex' : 'none';
    };
    
    loginBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            player = { name: name, level: 1, xp: 0, tokens: 5 };
            savePlayerData();
            showScreen('home');
        } else {
            alert('Per favore, inserisci un nome.');
        }
    });

    profileBtn.addEventListener('click', () => {
        updateProfileScreen();
        showScreen('profile');
    });

    goToModeSelectionBtn.addEventListener('click', () => showScreen('modeSelection'));
    backToHomeBtn.addEventListener('click', () => showScreen('home'));
    backToHomeFromProfileBtn.addEventListener('click', () => showScreen('home'));
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
                alert('Nessuna parola disponibile per questa difficoltà!'); return;
            }
            secretWord = validWords[Math.floor(Math.random() * validWords.length)];
            resetGame();
            updateHintDisplay();
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
        if (!/^[A-ZÀ-ÙÈ-Ò]+$/.test(word)) { alert('Per favore, inserisci una parola valida (solo lettere).'); return; }
        if (word.length < min || word.length > max) {
            let ruleText = `La parola deve avere tra ${min} e ${max} lettere.`;
            if (max === Infinity) ruleText = `La parola deve avere almeno ${min} lettere.`;
            alert(`Regola non rispettata! ${ruleText}`); return;
        }
        secretWord = word;
        resetGame();
        updateHintDisplay();
        showScreen('game');
    });

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
    
    newGameWinBtn.addEventListener('click', () => {
        postGameProgressBar.style.width = '0%';
        addXp(5);
        showScreen('progress');
    });
    newGameLoseBtn.addEventListener('click', () => {
        resetGame();
        showScreen('modeSelection');
    });
    continueBtn.addEventListener('click', () => {
        resetGame();
        showScreen('modeSelection');
    });

    // --- LOGICA MODALI ---
    const openTutorialModal = () => tutorialModal.classList.add('show');
    const closeTutorialModal = () => tutorialModal.classList.remove('show');
    tutorialBtn.addEventListener('click', openTutorialModal);
    closeModalBtn.addEventListener('click', closeTutorialModal);
    closeTutorialBtn.addEventListener('click', closeTutorialModal);
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) closeTutorialModal();
    });

    helpBtn.addEventListener('click', () => {
        hintTokenCount.textContent = player.tokens;
        hintModal.classList.add('show');
    });
    hintModalCloseBtn.addEventListener('click', () => hintModal.classList.remove('show'));
    useHintBtn.addEventListener('click', () => {
        if (player.tokens < 1) {
            alert("Non hai abbastanza gettoni!");
            return;
        }
        const unrevealedIndices = [];
        for (let i = 0; i < secretWord.length; i++) {
            if (!revealedLetters.includes(i)) {
                unrevealedIndices.push(i);
            }
        }
        if (unrevealedIndices.length === 0) {
            alert("Tutte le lettere sono già state rivelate!");
            hintModal.classList.remove('show');
            return;
        }
        const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
        revealedLetters.push(randomIndex);
        
        player.tokens--;
        savePlayerData();
        updateHintDisplay();
        hintModal.classList.remove('show');
    });

    // --- INIZIALIZZAZIONE APP ---
    loadPlayerData();
});