/**
 * Gestion du champ frustrant
 */

// Variables globales
const hiddenInput = document.getElementById('date_naissance');
const dateOutput = document.getElementById('date-output');
const frustrantForm = document.getElementById('frustrant-form');
const submitBtn = document.getElementById('submit-btn');

let dateValue = '';
let currentDigitIndex = 0;
// Flag indiquant si l'utilisateur a autorisé le son
let allowSound = false;

// Récupère toutes les questions
const questions = document.querySelectorAll('.question');
const totalQuestions = questions.length;

/* Données et génération des propositions (copiées depuis la source assets pour assurer parité)
   - largeNonsenseList: liste de faux choix
   - questionAnswers: définitions des réponses correctes / crédibles
   - morals: messages affichés après échec
   - generateAnswerButtons: génère et mélange les boutons dans chaque container .answers
*/
const largeNonsenseList = [
    'Pomme', 'Maison', 'Tableau', 'Voiture', 'Chat', 'Piano', 'Lampe', 'Chaise', 'Bureau', 'Gâteau',
    'Soleil', 'Montagne', 'Rivière', 'Forêt', 'Neige', 'Fleur', 'Oiseau', 'Poisson', 'Nuage', 'Salade',
    'Téléphone', 'Chaussette', 'Crayon', 'Livre', 'Pizza', 'Ballon', 'Souris', 'Clavier', 'Écran', 'Batterie',
    'Canapé', 'Tapis', 'Serviette', 'Parapluie', 'Chapeau', 'Manteau', 'Chaussure', 'Sac', 'Montre', 'Lunettes',
    'Ceinture', 'Bague', 'Collier', 'Bracelet', 'Portefeuille', 'Passeport', 'Clé', 'Porte', 'Fenêtre', 'Mur',
    'Toit', 'Escalier', 'Ascenseur', 'Couloir', 'Cuisine', 'Coiffeur', 'Boulangerie', 'Pharmacie', 'Supermarché', 'Restaurant',
    'Café', 'Bibliothèque', 'Musée', 'Cinéma', 'Théâtre', 'Stade', 'Parc', 'Plage', 'Vallée', 'Île', 'Lac',
    'Désert', 'Jungle', 'Savane', 'Toundra', 'Glacier', 'Volcan', 'Grotte', 'Caverne', 'Tunnel', 'Pont',
    'Route', 'Chemin', 'Sentier', 'Piste', 'Voie', 'Passage', 'Ruelle', 'Avenue', 'Boulevard', 'Place',
    'Square', 'Cours', 'Cour', 'Terrasse', 'Balcon', 'Veranda', 'Pergola', 'Auvent', 'Portique', 'Galerie'
];

const questionAnswers = {
    0: { correct: 'Linux', credible: ['Windows', 'MacOS', 'Unix'], nonsense: largeNonsenseList },
    1: { correct: 'Facebook', credible: ['Instagram', 'TikTok', 'YouTube', 'Google+'], nonsense: largeNonsenseList },
    2: { correct: 'Une spirale GNU', credible: ['Une tortue', 'Un éléphant', 'Un pingouin'], nonsense: largeNonsenseList },
    3: { correct: 'Quatre', credible: ['Trois', 'Cinq', 'Six'], nonsense: largeNonsenseList },
    4: { correct: 'Tim Berners-Lee', credible: ['Vint Cerf', 'Jon Postel', 'Steve Jobs'], nonsense: largeNonsenseList },
    5: { correct: 'Linux', credible: ['Unix', 'POSIX', 'BSD'], nonsense: largeNonsenseList },
    6: { correct: 'JavaScript', credible: ['Python', 'Java', 'C++', 'Ruby'], nonsense: largeNonsenseList },
    7: { correct: 'HTTPS', credible: ['SSL/TLS', 'SFTP', 'SSH'], nonsense: largeNonsenseList }
};

const morals = {
    0: { message: "❌ Mauvaise réponse !", morale: "Linux est essentiel pour la liberté numérique. Apprendre les alternatives, c'est votre indépendance technologique.", pique: "Linux en première question et vous avez échoué ? Les informaticiens pleurent pour vous. 😭💀" },
    1: { message: "❌ Mauvaise réponse !", morale: "Facebook collecte massivement vos données. Les connaître, c'est le premier pas pour protéger votre vie privée.", pique: "Facebook vous espionne 24/7 et VOUS ne le reconnaissez même pas. Qui est le vrai problème ? ️🎯" },
    2: { message: "❌ Mauvaise réponse !", morale: "La spirale GNU symbolise la liberté logicielle. Reconnaître les symboles, c'est respecter les valeurs d'une communauté.", pique: "Vous venez de rejeter la liberté. Stallman vous a perdu. Et vous méritez vos murs de pub ! �⛓️" },
    3: { message: "❌ Mauvaise réponse !", morale: "Les GAFAM sont cinq géants. En connaître le nombre, c'est comprendre la concentration du pouvoir numérique.", pique: "Vous avez raté le comptage jusqu'à 5. Allez, aller à la maternelle, on vous y attend ! �" },
    4: { message: "❌ Mauvaise réponse !", morale: "Tim Berners-Lee a créé le Web pour l'humanité. Connaître ses créateurs, c'est honorer cette vision de liberté.", pique: "Tim Berners-Lee a CRÉÉ INTERNET et vous, vous avez créé... une grosse déception. 💔🌐" },
    5: { message: "❌ Mauvaise réponse !", morale: "Linux domine les serveurs mondiaux. C'est le fondement invisible du web que vous utilisez chaque jour.", pique: "Linux DEUX FOIS et deux FOIS vous avez mangé poussière. Vous n'êtes pas bon, vous êtes MAUVAIS. �🪦" },
    6: { message: "❌ Mauvaise réponse !", morale: "JavaScript alimente presque tous les sites web modernes. Sans lui, l'internet interactif n'existerait pas.", pique: "JavaScript ? Vous devriez être ashamed de vous. Chaque ligne de code sur Terre pleure de vous. 😤�" },
    7: { message: "❌ Mauvaise réponse !", morale: "HTTPS sécurise vos données en ligne. Ignorer la sécurité, c'est risquer ses informations confidentielles.", pique: "Vous pensiez vraiment que HTTPS était autre chose ? Vos données ne sont même pas en sécurité de vos choix... ��" }
};

function generateAnswerButtons(answersContainer, questionIndex) {
    const questionData = questionAnswers[questionIndex];
    if (!questionData) return;

    const options = [];
    options.push({ text: questionData.correct, correct: true });
    for (let credible of questionData.credible) {
        options.push({ text: credible, correct: false });
    }

    const nonsenseOptions = [...questionData.nonsense];
    while (options.length < 80) { // generate up to 80 options to match template comment
        const randomIndex = Math.floor(Math.random() * nonsenseOptions.length);
        options.push({ text: nonsenseOptions[randomIndex], correct: false });
    }

    // shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    answersContainer.innerHTML = '';
    for (let i = 0; i < options.length; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'answer-btn';
        btn.dataset.correct = options[i].correct ? '1' : '0';
        btn.textContent = options[i].text;
        answersContainer.appendChild(btn);
    }
}

/**
 * Met à jour l'affichage de la date de manière progressive
 */
function updateDateDisplay() {
    let display = '';
    for (let i = 0; i < 8; i++) {
        if (i < dateValue.length) {
            display += dateValue[i];
        } else {
            display += '_';
        }
        if (i < 7) display += ' ';
    }
    dateOutput.textContent = display;

    // Active le bouton de soumission si tous les chiffres sont saisis
    if (dateValue.length === 8) {
        submitBtn.disabled = false;
    }
}

/**
 * Affiche la question active et masque les autres
 */
function showQuestion(index) {
    questions.forEach((q, i) => {
        if (i === index) {
            q.style.display = 'block';
            // Scroll la question en vue
            q.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            q.style.display = 'none';
        }
    });
}

/**
 * Passe à la prochaine question
 */
function nextQuestion() {
    currentDigitIndex++;
    if (currentDigitIndex < totalQuestions) {
        showQuestion(currentDigitIndex);
    } else {
        // Toutes les questions sont terminées
        submitBtn.disabled = false;
    }
}

/**
 * Ajoute un effet de shake à la question (mauvaise réponse)
 */
function shakeQuestion(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
}

/**
 * Animation de shake pour les mauvaises réponses
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

/* Modal d'erreur + replay (fallback simple) */
function showErrorModal(questionIndex) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';
    const content = document.createElement('div');
    content.style.cssText = 'background:#fff;padding:26px;border-radius:12px;max-width:560px;width:100%;text-align:left;box-shadow:0 8px 30px rgba(0,0,0,0.35);';

    // Récupère le message moral et le pique en fonction de la question
    const moralData = (typeof morals !== 'undefined' && morals[questionIndex]) ? morals[questionIndex] : { message: '❌ Mauvaise réponse !', morale: 'Vous avez échoué.', pique: 'Vous vous êtes planté, bravo.' };

    const title = `<h2 style="color:#b91c1c;margin:0 0 8px 0;font-size:20px;">${moralData.message}</h2>`;
    const body = `<p style="color:#222;margin:0 0 12px 0;font-size:15px;">${moralData.morale}</p>`;
    const poke = `<p style="color:#6b7280;margin:0 0 18px 0;font-weight:700;font-size:14px;">${moralData.pique}</p>`;

    content.innerHTML = `${title}${body}${poke}<div style="text-align:right;"><button id="restart-btn" style="padding:10px 16px;background:#111827;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;">Recommencer</button></div>`;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Ajoute focus trap et possibilité de fermer avec Échap
    const onKey = (ev) => {
        if (ev.key === 'Escape') {
            cleanup();
        }
    };

    const cleanup = () => {
        try { document.removeEventListener('keydown', onKey); } catch (e) {}
        try { if (modal && modal.parentNode) modal.parentNode.removeChild(modal); } catch (e) {}
    };

    document.addEventListener('keydown', onKey);

    document.getElementById('restart-btn').addEventListener('click', () => {
        // Recharger la page pour remettre l'état à zéro
        cleanup();
        location.reload();
    });
}

/* Lecture vidéo surprise en plein écran (fallbacks simples)
   - trouve #surprise-video
   - joue la vidéo (muted pour permettre autoplay)
   - tente requestFullscreen()
   - au 'ended' ou si on ne peut pas jouer, appelle callback
*/
function playSurpriseVideo(callback) {
    const container = document.getElementById('surprise-container');
    const video = document.getElementById('surprise-video');
    const bg = document.getElementById('surprise-bg-video');
    if (!container || !video) {
        if (typeof callback === 'function') callback();
        return;
    }

    // Choisit une source aléatoire parmi la liste fournie par Twig (window.surpriseVideos)
    try {
        const sources = (window.surpriseVideos && window.surpriseVideos.length) ? window.surpriseVideos.slice() : (video.src ? [video.src] : []);
        if (sources.length > 0) {
            const chosen = sources[Math.floor(Math.random() * sources.length)];
            if (chosen) {
                if (video.src !== chosen) {
                    video.src = chosen;
                    try { video.load(); } catch (e) {}
                }
                if (bg && bg.src !== chosen) {
                    bg.src = chosen;
                    try { bg.load(); } catch (e) {}
                }
            }
        }
    } catch (e) { /* ignore */ }

    // Prépare
    video.pause();
    if (bg) try { bg.pause(); } catch (e) {}
    try { video.currentTime = 0; } catch (e) {}
    try { if (bg) bg.currentTime = 0; } catch (e) {}
    video.muted = !allowSound;
    if (bg) bg.muted = true;

    // affiche le conteneur (bg + main)
    container.classList.add('active');

    const cleanup = () => {
        try {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        } catch (e) {}
        container.classList.remove('active');
        try { video.currentTime = 0; } catch (e) {}
        try { video.pause(); } catch (e) {}
        if (bg) { try { bg.pause(); } catch (e) {} }
        document.removeEventListener('fullscreenchange', onFsChange);
        video.removeEventListener('ended', onEnded);
        video.removeEventListener('error', onError);
    };

    const onEnded = () => { cleanup(); if (typeof callback === 'function') callback(); };
    const onError = () => { cleanup(); if (typeof callback === 'function') callback(); };
    const onFsChange = () => { if (!document.fullscreenElement) { cleanup(); if (typeof callback === 'function') callback(); } };

    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);
    document.addEventListener('fullscreenchange', onFsChange);

    // démarrer bg (loop muted) et vidéo principale
    if (bg) { try { bg.play().catch(() => {}); } catch (e) {} }
    const playPromise = video.play();

    const tryFs = () => {
        const el = container; // request fullscreen on container so bg+main visible
        if (el.requestFullscreen) return el.requestFullscreen();
        if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        if (el.msRequestFullscreen) return el.msRequestFullscreen();
        return Promise.reject(new Error('No FS API'));
    };

    const afterPlay = () => {
        tryFs().catch(() => {
            // Si fullscreen non dispo/refusé, on joue un bref instant puis fallback
            setTimeout(() => { cleanup(); if (typeof callback === 'function') callback(); }, 900);
        });
    };

    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(afterPlay).catch(() => { cleanup(); if (typeof callback === 'function') callback(); });
    } else {
        try { afterPlay(); } catch (e) { cleanup(); if (typeof callback === 'function') callback(); }
    }
}

/**
 * Initialise les event listeners pour tous les boutons de réponse
 */
function initializeAnswerButtons() {
    // Pour chaque container .answers, on installe des comportements qui
    // rendent la sélection très instable : shuffle continu, swaps et leurres.
    document.querySelectorAll('.answers').forEach((answersContainer) => {
        let shuffleInterval = null;
        let activeDecoys = [];

        const startShuffling = () => {
            if (shuffleInterval) return;
            shuffleInterval = setInterval(() => {
                const childs = Array.from(answersContainer.querySelectorAll('.answer-btn'));
                if (childs.length <= 1) return;
                // move a few random elements to the end to break muscle memory
                const times = 2 + Math.floor(Math.random() * Math.min(6, childs.length));
                for (let i = 0; i < times; i++) {
                    const idx = Math.floor(Math.random() * childs.length);
                    const el = childs[idx];
                    if (el) answersContainer.appendChild(el);
                }
            }, 140 + Math.floor(Math.random() * 260));
        };

        const stopShuffling = () => { if (shuffleInterval) { clearInterval(shuffleInterval); shuffleInterval = null; } };

        const removeDecoys = () => { activeDecoys.forEach(d => { try { d.remove(); } catch (e) {} }); activeDecoys = []; };

        const makeDecoysNear = (targetBtn) => {
            removeDecoys();
            const rect = targetBtn.getBoundingClientRect();
            const count = 4 + Math.floor(Math.random() * 6);
            for (let i = 0; i < count; i++) {
                const dec = document.createElement('button');
                dec.type = 'button';
                dec.className = 'answer-btn decoy-btn';
                dec.dataset.correct = '0';
                dec.textContent = targetBtn.textContent; // mimic text to confuse
                dec.style.position = 'fixed';
                dec.style.zIndex = 10001;
                dec.style.border = 'none';
                dec.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
                dec.style.background = window.getComputedStyle(targetBtn).backgroundColor || '#f3f4f6';
                dec.style.color = window.getComputedStyle(targetBtn).color || '#111';
                dec.style.padding = window.getComputedStyle(targetBtn).padding || '6px 10px';
                dec.style.borderRadius = window.getComputedStyle(targetBtn).borderRadius || '6px';

                const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.6 - 0.3);
                const radius = 30 + Math.random() * 160;
                const left = rect.left + rect.width / 2 + Math.cos(angle) * radius + (Math.random() * 30 - 15);
                const top = rect.top + rect.height / 2 + Math.sin(angle) * radius + (Math.random() * 30 - 15);
                dec.style.left = `${Math.round(left)}px`;
                dec.style.top = `${Math.round(top)}px`;

                dec.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    try { shakeQuestion(answersContainer.closest('.question')); } catch (e) {}
                    removeDecoys();
                    playSurpriseVideo(() => showErrorModal(currentDigitIndex));
                });

                document.body.appendChild(dec);
                activeDecoys.push(dec);
            }
            setTimeout(removeDecoys, 1200 + Math.floor(Math.random() * 1600));
        };

        // attach listeners to current buttons
        answersContainer.querySelectorAll('.answer-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentQuestion = btn.closest('.question');
                const isCorrect = btn.dataset.correct === '1';
                removeDecoys(); stopShuffling();
                if (isCorrect) {
                    dateValue += currentDigitIndex;
                    hiddenInput.value = dateValue;
                    updateDateDisplay();
                    btn.closest('.answers').querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; });
                    setTimeout(() => { nextQuestion(); }, 500);
                } else {
                    shakeQuestion(currentQuestion);
                    playSurpriseVideo(() => showErrorModal(currentDigitIndex));
                }
            });

            btn.addEventListener('mouseenter', () => {
                // swap with a random sibling for unpredictability
                try {
                    const siblings = Array.from(answersContainer.querySelectorAll('.answer-btn'));
                    if (siblings.length > 1) {
                        const other = siblings[Math.floor(Math.random() * siblings.length)];
                        if (other && other !== btn) answersContainer.insertBefore(other, btn);
                    }
                } catch (e) {}
            });

            btn.addEventListener('mousemove', (ev) => {
                // while moving inside a button, start container shuffle
                startShuffling();
                // spawn decoys if cursor is near a correct button
                if (btn.dataset.correct === '1') {
                    const rect = btn.getBoundingClientRect();
                    const bx = rect.left + rect.width / 2; const by = rect.top + rect.height / 2;
                    const dist = Math.hypot(bx - ev.clientX, by - ev.clientY);
                    if (dist < 140 + Math.random() * 80) {
                        makeDecoysNear(btn);
                    }
                }
            });

            btn.addEventListener('mouseleave', () => {
                // small delay so crossing between buttons keeps chaos
                setTimeout(() => { stopShuffling(); removeDecoys(); }, 220 + Math.floor(Math.random() * 300));
            });
        });

        answersContainer.addEventListener('mouseleave', () => { stopShuffling(); removeDecoys(); });
    });
}

/**
 * Gestion de la soumission du formulaire
 */
frustrantForm.addEventListener('submit', (e) => {
    // Vérifier que la date est complète
    if (dateValue.length !== 8) {
        e.preventDefault();
        alert('Veuillez compléter la saisie de votre date de naissance !');
    }
});

// Affiche la première question au chargement
showQuestion(0);
updateDateDisplay();

// Générer les boutons de propositions pour chaque question si manquants
questions.forEach((q, idx) => {
    const answersContainer = q.querySelector('.answers');
    if (answersContainer && answersContainer.children.length === 0) {
        try { generateAnswerButtons(answersContainer, idx); } catch (e) { console.warn('generateAnswerButtons failed', e); }
    }
});

// Initialise les listeners des boutons
initializeAnswerButtons();

// ---------- Gestion du consentement audio ----------
function hideSoundConsent() {
    const overlay = document.getElementById('sound-consent');
    if (overlay) overlay.style.display = 'none';
}

function initSoundConsent() {
    const overlay = document.getElementById('sound-consent');
    const allowBtn = document.getElementById('allow-sound-btn');
    const denyBtn = document.getElementById('deny-sound-btn');
    const video = document.getElementById('surprise-video');

    if (!overlay) return;

    // Si l'utilisateur clique pour autoriser le son, on tente une lecture courte
    if (allowBtn) {
        allowBtn.addEventListener('click', async (ev) => {
            ev.preventDefault();
            console.log('[sound-consent] allow clicked');
            // Tentative de lecture non muette pendant l'interaction utilisateur
            try {
                if (video) {
                    video.muted = false;
                    await video.play();
                    video.pause();
                    try { video.currentTime = 0; } catch (e) {}
                    allowSound = true;
                } else {
                    allowSound = true;
                }
            } catch (e) {
                console.warn('[sound-consent] direct play failed, trying AudioContext', e);
                // Si échec de lecture non muette, essayer de résumer un AudioContext
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        const ac = new AudioCtx();
                        if (ac.state === 'suspended') await ac.resume();
                        allowSound = true;
                    }
                } catch (err) {
                    console.warn('[sound-consent] AudioContext resume failed', err);
                    allowSound = false;
                }
            }
            // Feedback visuel rapide
            showTempMessage('Son activé', 1800);
            hideSoundConsent();
        });
    }

    if (denyBtn) {
        denyBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            console.log('[sound-consent] deny clicked');
            allowSound = false;
            showTempMessage('Son désactivé', 1200);
            hideSoundConsent();
        });
    }
}

// Initialise le consentement audio après le chargement
try {
    initSoundConsent();
} catch (e) { /* ignore */ }

/* Affiche un message temporaire en haut de l'écran pour feedback utilisateur */
function showTempMessage(text, ms = 1500) {
    let el = document.getElementById('sound-consent-msg');
    if (!el) {
        el = document.createElement('div');
        el.id = 'sound-consent-msg';
        el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:10px 18px;border-radius:8px;z-index:11000;font-weight:700;';
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(() => { if (el) el.style.display = 'none'; }, ms);
}

// Fallback global handlers: expose simple functions so inline onclick works
window.handleAllowSound = async function(ev) {
    try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
    console.log('[sound-consent] handleAllowSound invoked');
    // Try same unlock logic as initSoundConsent
    const video = document.getElementById('surprise-video');
    try {
        if (video) {
            video.muted = false;
            await video.play().catch(() => {});
            try { video.pause(); } catch (e) {}
            try { video.currentTime = 0; } catch (e) {}
            allowSound = true;
        } else {
            allowSound = true;
        }
    } catch (e) {
        console.warn('[sound-consent] handleAllowSound play failed, trying AudioContext', e);
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ac = new AudioCtx();
                if (ac.state === 'suspended') await ac.resume();
                allowSound = true;
            }
        } catch (err) {
            console.warn('[sound-consent] handleAllowSound AudioContext failed', err);
            allowSound = false;
        }
    }
    showTempMessage('Son activé', 1800);
    hideSoundConsent();
};

window.handleDenySound = function(ev) {
    try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
    console.log('[sound-consent] handleDenySound invoked');
    allowSound = false;
    showTempMessage('Son désactivé', 1200);
    hideSoundConsent();
};
