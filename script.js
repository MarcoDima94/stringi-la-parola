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

    // Elementi di gioco
    const setupRulesEl = document.getElementById('setup-rules');
    const secretWordInput = document.getElementById('secret-word-input');
    const startGameBtn = document.getElementById('start-game-btn');
    const guessInput = document.getElementById('guess-input');
    const submitGuessBtn = document.getElementById('submit-guess-btn');
    const guessesList = document.getElementById('guesses-list');
    const lowerBoundEl = document.getElementById('lower-bound');
    const upperBoundEl = document.getElementById('upper-bound');
    const showWordBtn = document.getElementById('show-word-btn');

    // Elementi Fine Gioco
    const finalWordWinEl = document.getElementById('final-word-win');
    const finalWordLoseEl = document.getElementById('final-word-lose');
    const newGameWinBtn = document.getElementById('new-game-win-btn');
    const newGameLoseBtn = document.getElementById('new-game-lose-btn');

    // Modale
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');

    const wordList = ["ALBERO", "AMICO", "BANANA", "CASA", "CANE", "FIORE", "GATTO", "LIBRO", "LUNA", "MARE", "NEVE", "PANE", "PESCE", "PORTA", "SOLE", "STELLE", "TEMPO", "TERRA", "TRENO", "UOMO", "VENTO", "ZAINO", "SCUOLA", "MONTAGNA", "SALE", "RE", "BLU"];
    
    // Variabili di stato
    let secretWord = '';
    let lowerBound = 'A';
    let upperBound = 'Z';
    let isSinglePlayer = false;
    let activeScreen = 'home';
    let difficultySettings = {};

    // Funzione per animare i pulsanti prima di navigare
    const animateAndNavigate = (button, navigationAction) => {
        if (button.classList.contains('shrinking')) return;

        button.classList.add('shrinking');
        
        setTimeout(() => {
            navigationAction();
        }, 500); // Attende la fine dell'animazione
    };
    
    // Funzione per mostrare le schermate
    const showScreen = (screenKey) => {
        const screenToShow = screens[screenKey];
        if (!screenToShow) {
            console.error("Schermata non trovata:", screenKey);
            return;
        }
        
        // Resetta i pulsanti sulla schermata che sta per apparire
        screenToShow.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('shrinking');
        });

        const currentScreen = document.querySelector('.game-screen.active');
        
        activeScreen = screenKey;
        updateToolbar();

        if (currentScreen && currentScreen !== screenToShow) {
            currentScreen.classList.add('exiting');
            currentScreen.addEventListener('animationend', () => {
                currentScreen.classList.remove('active', 'exiting');
                screenToShow.classList.add('active');
            }, { once: true });
        } else {
            if(currentScreen) currentScreen.classList.remove('active');
            screenToShow.classList.add('active');
        }
    };

    // Funzione per aggiornare la barra degli strumenti
    const updateToolbar = () => {
        toolbarBackBtn.classList.remove('visible');
        toolbarSurrenderBtn.classList.remove('visible');

        switch (activeScreen) {
            case 'modeSelection':
            case 'difficulty':
            case 'setup':
            case 'game':
                toolbarBackBtn.classList.add('visible');
                break;
        }

        if (activeScreen === 'game' && isSinglePlayer) {
            toolbarSurrenderBtn.classList.add('visible');
        }
    };
    
    // --- NAVIGAZIONE ---
    goToModeSelectionBtn.addEventListener('click', (e) => {
        animateAndNavigate(e.currentTarget, () => showScreen('modeSelection'));
    });
    
    toolbarBackBtn.addEventListener('click', () => {
        switch (activeScreen) {
            case 'modeSelection': showScreen('home'); break;
            case 'difficulty': showScreen('modeSelection'); break;
            case 'setup':
            case 'game': showScreen('difficulty'); break;
        }
    });

    const handleModeSelection = (e, isSingle) => {
        animateAndNavigate(e.currentTarget, () => {
            isSinglePlayer = isSingle;
            showScreen('difficulty');
        });
    };

    singlePlayerBtn.addEventListener('click', (e) => handleModeSelection(e, true));
    multiplayerBtn.addEventListener('click', (e) => handleModeSelection(e, false));

    const setDifficulty = (e, settings) => {
        animateAndNavigate(e.currentTarget, () => {
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
        });
    };

    difficultyBeginnerBtn.addEventListener('click', (e) => setDifficulty(e, { min: 1, max: 4 }));
    difficultyIntermediateBtn.addEventListener('click', (e) => setDifficulty(e, { min: 5, max: 6 }));
    difficultyExpertBtn.addEventListener('click', (e) => setDifficulty(e, { min: 7, max: Infinity }));

    startGameBtn.addEventListener('click', (e) => {
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
        
        animateAndNavigate(e.currentTarget, () => {
            secretWord = word;
            resetGame();
            showScreen('game');
        });
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
    const startNewGame = (e) => {
        animateAndNavigate(e.currentTarget, () => {
            resetGame();
            showScreen('modeSelection');
        });
    };
    newGameWinBtn.addEventListener('click', startNewGame);
    newGameLoseBtn.addEventListener('click', startNewGame);

    // --- LOGICA MODALE TUTORIAL ---
    const openModal = () => helpModal.classList.add('show');
    const closeModal = () => helpModal.classList.remove('show');

    tutorialBtn.addEventListener('click', openModal); // Rimosso l'effetto da qui per renderlo istantaneo
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
    updateToolbar();
});