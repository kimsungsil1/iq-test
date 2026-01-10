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

let shuffledQuestions, currentQuestionIndex;
let score = 0;

const questions = [
    {
        question: '다음 수열의 규칙에 맞는 다음 수는? 4, 6, 9, 6, 14, 6, ?',
        answers: [
            { text: '17', correct: false },
            { text: '19', correct: true },
            { text: '21', correct: false },
            { text: '23', correct: false }
        ]
    },
    {
        question: '빈칸에 들어갈 수는? 5, 10, 19, 32, ?, 70',
        answers: [
            { text: '45', correct: false },
            { text: '49', correct: true },
            { text: '51', correct: false },
            { text: '54', correct: false }
        ]
    },
    {
        question: '다음 중 규칙을 따르는 도형은? ▲ ■ ▲ ■ ▲ ?',
        answers: [
            { text: '■', correct: true },
            { text: '▲', correct: false },
            { text: '●', correct: false },
            { text: '◆', correct: false }
        ]
    },
    {
        question: '다음 중 같은 규칙으로 묶인 단어는? 사과, 배, 복숭아, ?',
        answers: [
            { text: '토마토', correct: false },
            { text: '포도', correct: true },
            { text: '감자', correct: false },
            { text: '오이', correct: false }
        ]
    },
    {
        question: '3, 6, 12, 24, ?, 96 규칙에 맞는 수는?',
        answers: [
            { text: '36', correct: false },
            { text: '42', correct: false },
            { text: '48', correct: true },
            { text: '60', correct: false }
        ]
    },
    {
        question: '다음 중 의미가 가장 반대인 단어의 조합은?',
        answers: [
            { text: '밝다 - 환하다', correct: false },
            { text: '빠르다 - 느리다', correct: true },
            { text: '가깝다 - 근처다', correct: false },
            { text: '맛있다 - 좋다', correct: false }
        ]
    },
    {
        question: 'A는 B의 3배, C는 A의 2배라면 C는 B의 몇 배인가?',
        answers: [
            { text: '5배', correct: false },
            { text: '6배', correct: true },
            { text: '7배', correct: false },
            { text: '8배', correct: false }
        ]
    },
    {
        question: '빈칸에 들어갈 알파벳은? A, C, F, J, O, ?',
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
