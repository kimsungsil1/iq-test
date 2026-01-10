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
const resultTitleElement = document.getElementById('result-title');
const resultTraitsElement = document.getElementById('result-traits');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let resultScores = {};

const questions = [
    {
        question: '평소보다 지친 날, 가장 먼저 하고 싶은 일은?',
        visual: buildVisual({
            title: 'Reset mode',
            waves: true
        }),
        answers: [
            { text: '침대에 누워 조용히 쉰다', type: 'calm', value: 2 },
            { text: '맛있는 걸 먹으며 기분 전환', type: 'warm', value: 2 },
            { text: '가벼운 산책으로 머리 환기', type: 'spark', value: 2 },
            { text: '친한 사람과 수다로 풀기', type: 'flow', value: 2 }
        ]
    },
    {
        question: '새로운 환경에 들어갔을 때의 첫 반응은?',
        visual: buildVisual({
            title: 'New space',
            orbits: true
        }),
        answers: [
            { text: '분위기부터 파악한다', type: 'calm', value: 2 },
            { text: '가벼운 농담으로 분위기를 푼다', type: 'spark', value: 2 },
            { text: '먼저 말을 걸어본다', type: 'flow', value: 2 },
            { text: '따뜻한 한 마디로 시작한다', type: 'warm', value: 2 }
        ]
    },
    {
        question: '해야 할 일이 몰렸을 때 나의 방식은?',
        visual: buildVisual({
            title: 'Task stack',
            steps: true
        }),
        answers: [
            { text: '우선순위를 정하고 차분히 처리', type: 'calm', value: 2 },
            { text: '작게 나눠서 빠르게 끝낸다', type: 'spark', value: 2 },
            { text: '주변 도움을 적절히 요청', type: 'flow', value: 2 },
            { text: '상황을 긍정적으로 해석하며 진행', type: 'warm', value: 2 }
        ]
    },
    {
        question: '친구가 힘들다고 말했을 때, 가장 먼저 드는 생각은?',
        visual: buildVisual({
            title: 'Listening',
            dots: 7
        }),
        answers: [
            { text: '차분히 이야기를 들어준다', type: 'calm', value: 2 },
            { text: '작은 행동으로 위로한다', type: 'warm', value: 2 },
            { text: '기분이 나아질 방법을 함께 찾는다', type: 'spark', value: 2 },
            { text: '지지와 공감을 많이 표현한다', type: 'flow', value: 2 }
        ]
    },
    {
        question: '오랜만의 휴일을 보낼 때 가장 끌리는 풍경은?',
        visual: buildVisual({
            title: 'Day off',
            horizon: true
        }),
        answers: [
            { text: '조용한 카페 창가', type: 'calm', value: 2 },
            { text: '따뜻한 노을이 있는 곳', type: 'warm', value: 2 },
            { text: '활기찬 시장 거리', type: 'spark', value: 2 },
            { text: '친구들과 웃음이 있는 공간', type: 'flow', value: 2 }
        ]
    },
    {
        question: '최근 나를 가장 잘 표현하는 문장은?',
        visual: buildVisual({
            title: 'Mood chart',
            rings: [18, 30, 42]
        }),
        answers: [
            { text: '조용하지만 단단한 하루를 보낸다', type: 'calm', value: 2 },
            { text: '따뜻하게 분위기를 바꾸는 중', type: 'warm', value: 2 },
            { text: '새로운 자극을 찾고 있다', type: 'spark', value: 2 },
            { text: '사람들과 에너지를 나누는 중', type: 'flow', value: 2 }
        ]
    },
    {
        question: '결정을 내려야 할 때 더 많이 사용하는 건?',
        visual: buildVisual({
            title: 'Balance',
            balance: true
        }),
        answers: [
            { text: '논리와 구조', type: 'calm', value: 2 },
            { text: '감정과 분위기', type: 'warm', value: 2 },
            { text: '직감과 속도', type: 'spark', value: 2 },
            { text: '사람들의 반응', type: 'flow', value: 2 }
        ]
    },
    {
        question: '다른 사람이 나에게 가장 자주 하는 말은?',
        visual: buildVisual({
            title: 'Echo',
            nodes: [
                { x: 80, y: 110 }, { x: 160, y: 70 }, { x: 240, y: 110 },
                { x: 320, y: 70 }, { x: 400, y: 110 }
            ]
        }),
        answers: [
            { text: '믿음직하고 안정적이다', type: 'calm', value: 2 },
            { text: '포근하고 배려심이 있다', type: 'warm', value: 2 },
            { text: '에너지 넘치고 밝다', type: 'spark', value: 2 },
            { text: '사람을 편하게 한다', type: 'flow', value: 2 }
        ]
    },
    {
        question: '내가 요즘 원하는 관계의 온도는?',
        visual: buildVisual({
            title: 'Connection',
            arcs: true
        }),
        answers: [
            { text: '적당한 거리감이 있는 관계', type: 'calm', value: 2 },
            { text: '자주 챙기는 따뜻한 관계', type: 'warm', value: 2 },
            { text: '새로운 만남이 많은 관계', type: 'spark', value: 2 },
            { text: '깊이 있는 대화를 나누는 관계', type: 'flow', value: 2 }
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
    resultScores = { calm: 0, warm: 0, spark: 0, flow: 0 };
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
        button.dataset.type = answer.type;
        button.dataset.value = answer.value;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = 'block';
    nextButton.disabled = true;
    questionVisualElement.innerHTML = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const selectedType = selectedButton.dataset.type;
    const selectedValue = Number(selectedButton.dataset.value) || 0;
    if (selectedType) {
        resultScores[selectedType] += selectedValue;
        score += selectedValue;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.remove('selected');
        button.disabled = true;
    });
    selectedButton.classList.add('selected');
    nextButton.disabled = false;
}


function showResults() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    const total = questions.length * 2;
    const percent = Math.round((score / total) * 100);
    scoreElement.innerText = `총 점수 ${score} / ${total} (${percent}%)`;
    const result = getResultType();
    resultTitleElement.innerText = result.title;
    interpretationElement.innerText = result.description;
    resultTraitsElement.innerHTML = result.traits.map(trait => `<li>${trait}</li>`).join('');
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

function getResultType() {
    const entries = Object.entries(resultScores);
    entries.sort((a, b) => b[1] - a[1]);
    const top = entries[0]?.[0] || 'calm';
    const catalog = {
        calm: {
            title: '차분한 온기형',
            description: '감정을 정리하며 안정적으로 에너지를 회복하는 타입입니다.',
            traits: ['혼자만의 리셋 시간이 필요함', '정리된 환경에서 컨디션 상승', '결정을 신중하게 내림']
        },
        warm: {
            title: '따뜻한 공감형',
            description: '사람의 기분을 부드럽게 올려 주는 따뜻한 에너지가 강합니다.',
            traits: ['다정한 말투가 기본값', '주변을 자연스럽게 챙김', '감정의 온도를 잘 읽음']
        },
        spark: {
            title: '반짝 자극형',
            description: '새로운 자극을 통해 에너지를 끌어올리는 타입입니다.',
            traits: ['변화를 빠르게 수용', '즉흥적인 활력이 강함', '아이디어 전환이 빠름']
        },
        flow: {
            title: '유연한 교류형',
            description: '대화와 교류를 통해 컨디션을 회복하는 타입입니다.',
            traits: ['공감형 대화에 강함', '사람들과 있을 때 컨디션 상승', '관계 속 균형을 잘 맞춤']
        }
    };
    return catalog[top] || catalog.calm;
}

function buildVisual(config) {
    const header = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" aria-hidden="true">`;
    const footer = '</svg>';
    const background = `<rect width="520" height="180" rx="22" fill="rgba(255,255,255,0.6)" stroke="rgba(29,27,22,0.08)" />`;
    const title = `<text x="24" y="32" font-size="12" fill="rgba(29,27,22,0.45)" font-family="Gowun Dodum, sans-serif">${config.title}</text>`;

    if (config.waves) {
        const waves = `
            <path d="M40 110c40-30 90-30 130 0 40 30 90 30 130 0 40-30 90-30 130 0" fill="none" stroke="rgba(255,138,91,0.6)" stroke-width="6" stroke-linecap="round"/>
            <path d="M70 140c30-20 70-20 100 0 30 20 70 20 100 0 30-20 70-20 100 0" fill="none" stroke="rgba(111,123,247,0.5)" stroke-width="5" stroke-linecap="round"/>
        `;
        return `${header}${background}${title}${waves}${footer}`;
    }

    if (config.orbits) {
        const orbits = `
            <circle cx="180" cy="110" r="48" fill="none" stroke="rgba(111,123,247,0.5)" stroke-width="4"/>
            <circle cx="300" cy="90" r="30" fill="none" stroke="rgba(255,138,91,0.55)" stroke-width="4"/>
            <circle cx="380" cy="120" r="22" fill="rgba(255,138,91,0.2)"/>
        `;
        return `${header}${background}${title}${orbits}${footer}`;
    }

    if (config.steps) {
        const steps = `
            <rect x="90" y="110" width="70" height="30" rx="10" fill="rgba(255,138,91,0.6)"/>
            <rect x="180" y="90" width="70" height="50" rx="10" fill="rgba(111,123,247,0.5)"/>
            <rect x="270" y="70" width="70" height="70" rx="10" fill="rgba(255,138,91,0.45)"/>
            <rect x="360" y="55" width="70" height="85" rx="10" fill="rgba(111,123,247,0.4)"/>
        `;
        return `${header}${background}${title}${steps}${footer}`;
    }

    if (config.horizon) {
        const horizon = `
            <circle cx="120" cy="90" r="36" fill="rgba(255,138,91,0.4)"/>
            <rect x="60" y="110" width="400" height="40" rx="20" fill="rgba(111,123,247,0.25)"/>
            <path d="M80 135h360" stroke="rgba(22,26,34,0.25)" stroke-width="4" stroke-linecap="round"/>
        `;
        return `${header}${background}${title}${horizon}${footer}`;
    }

    if (config.balance) {
        const balance = `
            <rect x="250" y="60" width="20" height="80" rx="8" fill="rgba(22,26,34,0.3)"/>
            <path d="M150 90h220" stroke="rgba(22,26,34,0.3)" stroke-width="6" stroke-linecap="round"/>
            <circle cx="170" cy="110" r="24" fill="rgba(111,123,247,0.45)"/>
            <circle cx="350" cy="110" r="24" fill="rgba(255,138,91,0.45)"/>
        `;
        return `${header}${background}${title}${balance}${footer}`;
    }

    if (config.arcs) {
        const arcs = `
            <path d="M100 130c50-60 130-60 180 0" fill="none" stroke="rgba(255,138,91,0.55)" stroke-width="6" stroke-linecap="round"/>
            <path d="M200 130c40-50 100-50 140 0" fill="none" stroke="rgba(111,123,247,0.5)" stroke-width="6" stroke-linecap="round"/>
            <circle cx="140" cy="105" r="10" fill="rgba(111,123,247,0.6)"/>
            <circle cx="320" cy="105" r="10" fill="rgba(255,138,91,0.6)"/>
        `;
        return `${header}${background}${title}${arcs}${footer}`;
    }

    if (config.nodes) {
        const points = config.nodes
            .map(node => `<circle cx="${node.x}" cy="${node.y}" r="10" fill="rgba(255,138,91,0.7)" />`)
            .join('');
        const lines = config.nodes
            .slice(0, -1)
            .map((node, index) => {
                const next = config.nodes[index + 1];
                return `<line x1="${node.x}" y1="${node.y}" x2="${next.x}" y2="${next.y}" stroke="rgba(111,123,247,0.6)" stroke-width="3" />`;
            })
            .join('');
        return `${header}${background}${title}${lines}${points}${footer}`;
    }

    if (config.bars) {
        const bars = config.bars
            .map((height, index) => {
                const x = 70 + index * 60;
                const y = 150 - height;
                return `<rect x="${x}" y="${y}" width="30" height="${height}" rx="6" fill="rgba(111,123,247,0.65)" />`;
            })
            .join('');
        return `${header}${background}${title}${bars}${footer}`;
    }

    if (config.shapes) {
        const shapes = config.shapes
            .map((shape, index) => {
                const x = 90 + index * 80;
                if (shape === 'triangle') {
                    return `<polygon points="${x},70 ${x - 18},110 ${x + 18},110" fill="rgba(255,138,91,0.7)" />`;
                }
                if (shape === 'square') {
                    return `<rect x="${x - 18}" y="78" width="36" height="36" rx="6" fill="rgba(111,123,247,0.7)" />`;
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
            return `<circle cx="${x}" cy="${y}" r="10" fill="rgba(255,138,91,0.6)" />`;
        }).join('');
        return `${header}${background}${title}${dots}${footer}`;
    }

    if (config.rings) {
        const rings = config.rings
            .map((r, index) => `<circle cx="${160 + index * 80}" cy="110" r="${r}" fill="none" stroke="rgba(111,123,247,0.5)" stroke-width="4" />`)
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
