const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const welcomeContainer = document.getElementById('welcome-container');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const interpretationElement = document.getElementById('interpretation');
const progressTextElement = document.getElementById('progress-text');
const progressBarElement = document.getElementById('progress-bar');
const questionVisualElement = document.getElementById('question-visual');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

const questions = [
    {
        question: '다음 수열의 규칙에 맞는 다음 수는? 4, 6, 9, 6, 14, 6, ?',
        visual: buildVisual({
            title: 'Number ladder',
            nodes: [
                { x: 60, y: 80 }, { x: 140, y: 120 }, { x: 220, y: 80 },
                { x: 300, y: 120 }, { x: 380, y: 80 }, { x: 460, y: 120 }
            ]
        }),
        answers: [
            { text: '17', correct: false },
            { text: '19', correct: true },
            { text: '21', correct: false },
            { text: '23', correct: false }
        ]
    },
    {
        question: '빈칸에 들어갈 수는? 5, 10, 19, 32, ?, 70',
        visual: buildVisual({
            title: 'Rising steps',
            bars: [20, 40, 64, 92, 124, 160]
        }),
        answers: [
            { text: '45', correct: false },
            { text: '49', correct: true },
            { text: '51', correct: false },
            { text: '54', correct: false }
        ]
    },
    {
        question: '다음 중 규칙을 따르는 도형은? ▲ ■ ▲ ■ ▲ ?',
        visual: buildVisual({
            title: 'Shape alternation',
            shapes: ['triangle', 'square', 'triangle', 'square', 'triangle']
        }),
        answers: [
            { text: '■', correct: true },
            { text: '▲', correct: false },
            { text: '●', correct: false },
            { text: '◆', correct: false }
        ]
    },
    {
        question: '다음 중 같은 규칙으로 묶인 단어는? 사과, 배, 복숭아, ?',
        visual: buildVisual({
            title: 'Cluster',
            dots: 6
        }),
        answers: [
            { text: '토마토', correct: false },
            { text: '포도', correct: true },
            { text: '감자', correct: false },
            { text: '오이', correct: false }
        ]
    },
    {
        question: '3, 6, 12, 24, ?, 96 규칙에 맞는 수는?',
        visual: buildVisual({
            title: 'Doubling',
            rings: [16, 26, 36, 46, 56]
        }),
        answers: [
            { text: '36', correct: false },
            { text: '42', correct: false },
            { text: '48', correct: true },
            { text: '60', correct: false }
        ]
    },
    {
        question: '다음 중 의미가 가장 반대인 단어의 조합은?',
        visual: buildVisual({
            title: 'Opposites',
            arrows: true
        }),
        answers: [
            { text: '밝다 - 환하다', correct: false },
            { text: '빠르다 - 느리다', correct: true },
            { text: '가깝다 - 근처다', correct: false },
            { text: '맛있다 - 좋다', correct: false }
        ]
    },
    {
        question: 'A는 B의 3배, C는 A의 2배라면 C는 B의 몇 배인가?',
        visual: buildVisual({
            title: 'Ratio',
            bars: [40, 120, 240]
        }),
        answers: [
            { text: '5배', correct: false },
            { text: '6배', correct: true },
            { text: '7배', correct: false },
            { text: '8배', correct: false }
        ]
    },
    {
        question: '빈칸에 들어갈 알파벳은? A, C, F, J, O, ?',
        visual: buildVisual({
            title: 'Letter jumps',
            nodes: [
                { x: 70, y: 110 }, { x: 150, y: 80 }, { x: 230, y: 110 },
                { x: 310, y: 70 }, { x: 390, y: 110 }
            ]
        }),
        answers: [
            { text: 'T', correct: false },
            { text: 'U', correct: true },
            { text: 'V', correct: false },
            { text: 'W', correct: false }
        ]
    }
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    welcomeContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    updateProgress();
    updateNextLabel();
    renderVisual(question.visual);
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('answer-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.style.display = 'block';
    nextButton.disabled = true;
    questionVisualElement.innerHTML = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
        button.disabled = true;
    });
    nextButton.disabled = false;
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    const total = questions.length;
    const percent = Math.round((score / total) * 100);
    scoreElement.innerText = `정답 ${score} / ${total} (${percent}%)`;
    interpretationElement.innerText = getInterpretation(percent);
}

function updateProgress() {
    const total = shuffledQuestions.length;
    const current = currentQuestionIndex + 1;
    progressTextElement.innerText = `문항 ${current} / ${total}`;
    progressBarElement.style.width = `${Math.round((current / total) * 100)}%`;
}

function updateNextLabel() {
    const isLast = currentQuestionIndex === shuffledQuestions.length - 1;
    nextButton.innerText = isLast ? '결과 보기' : '다음 문항';
}

function renderVisual(svgMarkup) {
    if (!svgMarkup) {
        questionVisualElement.innerHTML = '';
        return;
    }
    questionVisualElement.innerHTML = svgMarkup;
}

function getInterpretation(percent) {
    if (percent >= 90) {
        return '탁월한 규칙 추론 능력! 고난도 문항에 도전해 보세요.';
    }
    if (percent >= 70) {
        return '상위권의 논리 감각입니다. 복합 규칙 문제에서 더 강해질 수 있어요.';
    }
    if (percent >= 50) {
        return '균형 잡힌 추론력입니다. 계산+언어형 문제를 추가로 연습해 보세요.';
    }
    return '기초 패턴 감각을 다지는 단계입니다. 천천히 다시 풀어보면 좋아요.';
}

function buildVisual(config) {
    const header = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" aria-hidden="true">`;
    const footer = '</svg>';
    const background = `<rect width="520" height="180" rx="22" fill="rgba(255,255,255,0.6)" stroke="rgba(29,27,22,0.08)" />`;
    const title = `<text x="24" y="32" font-size="12" fill="rgba(29,27,22,0.45)" font-family="Gowun Dodum, sans-serif">${config.title}</text>`;

    if (config.nodes) {
        const points = config.nodes
            .map(node => `<circle cx="${node.x}" cy="${node.y}" r="10" fill="rgba(255,122,69,0.7)" />`)
            .join('');
        const lines = config.nodes
            .slice(0, -1)
            .map((node, index) => {
                const next = config.nodes[index + 1];
                return `<line x1="${node.x}" y1="${node.y}" x2="${next.x}" y2="${next.y}" stroke="rgba(47,127,118,0.6)" stroke-width="3" />`;
            })
            .join('');
        return `${header}${background}${title}${lines}${points}${footer}`;
    }

    if (config.bars) {
        const bars = config.bars
            .map((height, index) => {
                const x = 70 + index * 60;
                const y = 150 - height;
                return `<rect x="${x}" y="${y}" width="30" height="${height}" rx="6" fill="rgba(47,127,118,0.65)" />`;
            })
            .join('');
        return `${header}${background}${title}${bars}${footer}`;
    }

    if (config.shapes) {
        const shapes = config.shapes
            .map((shape, index) => {
                const x = 90 + index * 80;
                if (shape === 'triangle') {
                    return `<polygon points="${x},70 ${x - 18},110 ${x + 18},110" fill="rgba(255,122,69,0.7)" />`;
                }
                if (shape === 'square') {
                    return `<rect x="${x - 18}" y="78" width="36" height="36" rx="6" fill="rgba(47,127,118,0.7)" />`;
                }
                return '';
            })
            .join('');
        return `${header}${background}${title}${shapes}${footer}`;
    }

    if (config.dots) {
        const dots = Array.from({ length: config.dots }).map((_, index) => {
            const x = 120 + (index % 3) * 90;
            const y = 80 + Math.floor(index / 3) * 40;
            return `<circle cx="${x}" cy="${y}" r="10" fill="rgba(255,122,69,0.6)" />`;
        }).join('');
        return `${header}${background}${title}${dots}${footer}`;
    }

    if (config.rings) {
        const rings = config.rings
            .map((r, index) => `<circle cx="${100 + index * 80}" cy="110" r="${r}" fill="none" stroke="rgba(47,127,118,0.5)" stroke-width="4" />`)
            .join('');
        return `${header}${background}${title}${rings}${footer}`;
    }

    if (config.arrows) {
        const arrows = `
            <path d="M120 110h120" stroke="rgba(29,27,22,0.35)" stroke-width="4" stroke-linecap="round"/>
            <path d="M210 100l30 10-30 10" fill="none" stroke="rgba(29,27,22,0.35)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M400 110h-120" stroke="rgba(29,27,22,0.35)" stroke-width="4" stroke-linecap="round"/>
            <path d="M310 100l-30 10 30 10" fill="none" stroke="rgba(29,27,22,0.35)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        `;
        return `${header}${background}${title}${arrows}${footer}`;
    }

    return `${header}${background}${title}${footer}`;
}
