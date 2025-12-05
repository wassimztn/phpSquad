/**
 * Gestion du champ frustrant
 * Flux: Question (répondre) -> Champ input (saisir le chiffre) -> Question suivante
 */

const hiddenInput = document.getElementById('date_naissance');
const dateOutput = document.getElementById('date-output');
const frustrantForm = document.getElementById('frustrant-form');
const submitBtn = document.getElementById('submit-btn');

let dateValue = '';
let currentQuestionIndex = 0;

// Flag indiquant si l'utilisateur a autorisé le son
// On autorise automatiquement le son (suppression de la demande manuelle)
let allowSound = true;

const questions = document.querySelectorAll('.question');
const totalQuestions = questions.length;

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
    2: { correct: 'Une spirale GNU', credible: ['Une tortue', 'Un éléphant', 'Un pinguin'], nonsense: largeNonsenseList },
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
    while (options.length < 200) {
        const randomIndex = Math.floor(Math.random() * nonsenseOptions.length);
        options.push({ text: nonsenseOptions[randomIndex], correct: false });
    }

    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    for (let i = 0; i < 200; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'answer-btn';
        btn.dataset.correct = options[i].correct ? '1' : '0';
        btn.textContent = options[i].text;
        answersContainer.appendChild(btn);
    }
}

function updateDateDisplay() {
    let display = '';
    for (let i = 0; i < 8; i++) {
        display += (i < dateValue.length) ? dateValue[i] : '_';
        if (i < 7) display += ' ';
    }
    dateOutput.textContent = display;
    if (dateValue.length === 8) submitBtn.disabled = false;
}

function showQuestion(index) {
    questions.forEach((q, i) => {
        q.style.display = (i === index) ? 'block' : 'none';
        if (i === index) q.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function showDigitInput(questionElement) {
    const wrapper = questionElement.querySelector('.digit-input-wrapper');
    const answers = questionElement.querySelector('.answers');
    if (wrapper && answers) {
        answers.style.display = 'none';
        wrapper.style.display = 'block';
        setTimeout(() => wrapper.querySelector('.digit-input').focus(), 100);
    }
}

function hideDigitInput(questionElement) {
    const wrapper = questionElement.querySelector('.digit-input-wrapper');
    const answers = questionElement.querySelector('.answers');
    if (wrapper && answers) {
        wrapper.style.display = 'none';
        answers.style.display = 'flex';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        showQuestion(currentQuestionIndex);
        hideDigitInput(questions[currentQuestionIndex]);
    } else {
        submitBtn.disabled = false;
    }
}

function resetQuiz() {
    dateValue = '';
    currentQuestionIndex = 0;
    hiddenInput.value = '';
    submitBtn.disabled = true;
    updateDateDisplay();

    questions.forEach((question, index) => {
        const answersContainer = question.querySelector('.answers');
        answersContainer.innerHTML = '';
        generateAnswerButtons(answersContainer, index);
    });

    initializeAnswerButtons();
    initializeDigitInputs();
    showQuestion(0);
}

function showErrorModal(questionIndex) {
    const moral = morals[questionIndex];
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;';

    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:40px;border-radius:15px;max-width:500px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);';
    content.innerHTML = `
        <h2 style="color:#dc3545;margin:0 0 20px 0;font-size:28px;">${moral.message}</h2>
        <p style="color:#333;font-size:16px;line-height:1.6;margin:20px 0;"><strong>💡 Morale:</strong><br>${moral.morale}</p>
        <p style="color:#764ba2;font-size:14px;font-style:italic;margin:20px 0;padding:15px;background:#f0f0f9;border-radius:8px;">${moral.pique}</p>
        <p style="color:#666;font-size:13px;margin:20px 0;">⚠️ <strong>Vous devez tout recommencer!</strong></p>
        <button id="restart-btn" style="padding:12px 30px;background:#667eea;color:white;border:none;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;">Recommencer</button>
    `;
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.getElementById('restart-btn').addEventListener('click', () => {
        modal.remove();
        resetQuiz();
    });
}

/* ---------- Lecture vidéo surprise en plein écran ----------
   Comportement :
   - la vidéo (élément #surprise-video) est jouée muette pour permettre l'autoplay
   - on tente requestFullscreen sur l'élément vidéo
   - quand la vidéo se termine (ou si le plein écran est refusé), on appelle le callback
*/
function playSurpriseVideo(callback) {
    const video = document.getElementById('surprise-video');
    if (!video) {
        // Pas de vidéo disponible : fallback immédiat
        if (typeof callback === 'function') callback();
        return;
    }

    // Prépare la vidéo
    video.pause();
    try { video.currentTime = 0; } catch (e) { /* ignore */ }
    // jouer muet si l'utilisateur n'a pas autorisé le son
    video.muted = !allowSound;
    video.style.display = 'block';

    const cleanup = () => {
        // tenter de quitter le plein écran si on y est
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        } catch (e) {}
        video.style.display = 'none';
        video.pause();
        // remet le temps pour la prochaine fois
        try { video.currentTime = 0; } catch (e) {}
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        video.removeEventListener('ended', onEnded);
        video.removeEventListener('error', onError);
    };

    const onEnded = () => {
        cleanup();
        if (typeof callback === 'function') callback();
    };

    const onError = () => {
        cleanup();
        if (typeof callback === 'function') callback();
    };

    const onFullscreenChange = () => {
        // Si l'utilisateur quitte le fullscreen manuellement, on cache la vidéo
        if (!document.fullscreenElement) {
            cleanup();
            if (typeof callback === 'function') callback();
        }
    };

    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    // Jouer la vidéo (peut renvoyer une promesse)
    const playPromise = video.play();

    // Tenter le plein écran : certaines plateformes demandent un user gesture, mais on tente
    const requestFs = () => {
        const el = video;
        if (el.requestFullscreen) return el.requestFullscreen();
        if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        if (el.msRequestFullscreen) return el.msRequestFullscreen();
        return Promise.reject(new Error('Fullscreen API non supportée'));
    };

    // Quand la lecture démarre, on tente le fullscreen
    const afterPlay = () => {
        requestFs().catch(() => {
            // Si fullscreen refusé ou non supporté, on ne bloque pas : on appelle le callback
            // mais on laisse la vidéo jouer un court instant pour l'effet "surprise"
            setTimeout(() => {
                cleanup();
                if (typeof callback === 'function') callback();
            }, 1200);
        });
    };

    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(afterPlay).catch(() => {
            // Autoplay bloqué ; on fait fallback vers callback (modal)
            cleanup();
            if (typeof callback === 'function') callback();
        });
    } else {
        // play() n'a pas renvoyé de promesse (anciens navigateurs) : tenter fullscreen
        try { afterPlay(); } catch (e) { cleanup(); if (typeof callback === 'function') callback(); }
    }
}

/* ---------- Consentement audio avant le quiz ---------- */
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

    if (allowBtn) {
        allowBtn.addEventListener('click', async (ev) => {
            ev.preventDefault();
            console.log('[sound-consent] allow clicked');
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

try { initSoundConsent(); } catch (e) { /* ignore */ }

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

// Fallback global handlers so inline onclick attributes work even if listeners failed
window.handleAllowSound = async function(ev) {
    try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
    console.log('[sound-consent] handleAllowSound invoked');
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

function initializeAnswerButtons() {
    document.querySelectorAll('.answer-btn').forEach((btn) => {
        let hoverInterval;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(hoverInterval);
            const isCorrect = btn.dataset.correct === '1';
            if (isCorrect) {
                showDigitInput(btn.closest('.question'));
                btn.closest('.answers').querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
            } else {
                // Essayer d'abord la vidéo en plein écran, puis montrer la modal quand la vidéo a fini
                playSurpriseVideo(() => showErrorModal(currentQuestionIndex));
            }
        });

        btn.addEventListener('mouseover', () => {
            btn.style.transition = 'none';
            hoverInterval = setInterval(() => {
                const x = Math.random() * 950 - 75;
                const y = Math.random() * 500 - 75;
                const rotation = Math.random() * 10 - 5;
                const scale = 0.85 + Math.random() * 0.3;
                btn.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
            }, 80);
        });

        btn.addEventListener('mouseout', () => {
            clearInterval(hoverInterval);
            btn.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            btn.style.transition = 'transform 0.2s ease-out';
        });
    });
}

function initializeDigitInputs() {
    document.querySelectorAll('.digit-input').forEach((input) => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length === 1) {
                dateValue += e.target.value;
                hiddenInput.value = dateValue;
                updateDateDisplay();
                e.target.disabled = true;
                setTimeout(nextQuestion, 500);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
}

frustrantForm.addEventListener('submit', (e) => {
    if (dateValue.length !== 8) {
        e.preventDefault();
        alert('Veuillez compléter la saisie de votre date de naissance !');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    questions.forEach((question, index) => {
        const answersContainer = question.querySelector('.answers');
        generateAnswerButtons(answersContainer, index);
    });
    showQuestion(0);
    updateDateDisplay();
    initializeAnswerButtons();
    initializeDigitInputs();
});
