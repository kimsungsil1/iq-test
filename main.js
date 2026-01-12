const nameInput = document.getElementById('name-input');
const birthInput = document.getElementById('birth-input');
const deathInput = document.getElementById('death-input');
const taglineInput = document.getElementById('tagline-input');
const epitaphInput = document.getElementById('epitaph-input');
const audienceInput = document.getElementById('audience-input');
const countNow = document.getElementById('count-now');
const randomButton = document.getElementById('random-btn');
const composeButton = document.getElementById('compose-btn');
const saveButton = document.getElementById('save-btn');
const startComposeButton = document.getElementById('start-compose');
const startDesignButton = document.getElementById('start-design');

const previewName = document.getElementById('preview-name');
const previewDates = document.getElementById('preview-dates');
const previewEpitaph = document.getElementById('preview-epitaph');
const previewStyle = document.getElementById('preview-style');
const previewTone = document.getElementById('preview-tone');
const previewHeroCard = document.getElementById('preview-hero-card');

const previewNameLg = document.getElementById('preview-name-lg');
const previewDatesLg = document.getElementById('preview-dates-lg');
const previewTagline = document.getElementById('preview-tagline');
const previewEpitaphLg = document.getElementById('preview-epitaph-lg');
const previewToneLg = document.getElementById('preview-tone-lg');
const previewAudience = document.getElementById('preview-audience');
const previewCard = document.getElementById('preview-card');
const tombstoneName = document.getElementById('tombstone-name');
const tombstoneDates = document.getElementById('tombstone-dates');
const tombstoneEpitaph = document.getElementById('tombstone-epitaph');

const cemeteryGrid = document.getElementById('cemetery-grid');
const inspirationList = document.getElementById('inspiration-list');
const refreshEpitaphsButton = document.getElementById('refresh-epitaphs');
const shareEpitaphButton = document.getElementById('share-epitaph');
const backendNote = document.getElementById('backend-note');

// Set your Firebase Realtime Database URL to enable shared rankings.
const FIREBASE_DB_URL = 'https://YOUR_PROJECT.firebaseio.com';
const backendEnabled = !FIREBASE_DB_URL.includes('YOUR_PROJECT');
const voteStorageKey = 'lastWhisperVotes';
let currentEpitaphs = {};
let selectedStyle = null;
let preferredStyleId = null;

const tones = {
    '담담한': [
        '여기에서 잠시 쉬었다 갑니다.',
        '삶의 숨결을 조용히 접어 둡니다.',
        '긴 하루의 끝에서 고요를 마주합니다.'
    ],
    '따뜻한': [
        '당신이 웃어준 기억이 아직 따뜻합니다.',
        '사랑은 여기에서 더 오래 머뭅니다.',
        '함께한 시간들이 작은 불빛이 됩니다.'
    ],
    '시적인': [
        '바람은 이름을 불러주고, 별은 길을 밝혀줍니다.',
        '빛과 그림자가 교차하는 자리에 잠시 머뭅니다.',
        '이곳에 닿는 발걸음마다 꽃이 됩니다.'
    ]
};

const cemeteryStyles = [
    {
        id: 'hill',
        name: '언덕의 잔디 묘지',
        mood: '잔잔한 곡선과 낮은 비석',
        materials: '석회암, 잔디',
        location: '영국 교회 묘지',
        image: 'https://live.staticflickr.com/4027/4326332110_c7678727f4_b.jpg',
        credit: 'ell brown · CC BY',
        creditUrl: 'https://www.flickr.com/photos/39415781@N06/4326332110'
    },
    {
        id: 'forest',
        name: '숲길 속 묘지',
        mood: '나무 사이로 스며드는 빛',
        materials: '현무암, 삼나무',
        location: '라트비아 숲묘지',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Memorial_for_Dievturi_%28Latvian_pagan%29_victims_of_Soviet_rule_1942-1952%2C_Forest_Cemetery%2C_Riga%2C_Latvia.jpg',
        credit: 'Ubel · CC BY-SA',
        creditUrl: 'https://commons.wikimedia.org/w/index.php?curid=58486419'
    },
    {
        id: 'desert',
        name: '사막의 기념 정원',
        mood: '넓은 하늘과 따뜻한 돌',
        materials: '테라코타, 모래석',
        location: '미국 사막 지대',
        image: 'https://live.staticflickr.com/16/92562598_b31967bb47_b.jpg',
        credit: 'dbking · CC BY',
        creditUrl: 'https://www.flickr.com/photos/65193799@N00/92562598'
    },
    {
        id: 'harbor',
        name: '바다를 보는 묘지',
        mood: '파도 소리와 수평선',
        materials: '화강암, 청석',
        location: '포르투갈 해안',
        image: 'https://live.staticflickr.com/1508/25812663560_fc98157c7f_b.jpg',
        credit: 'D-Stanley · CC BY',
        creditUrl: 'https://www.flickr.com/photos/79721788@N00/25812663560'
    },
    {
        id: 'city',
        name: '도시의 작은 정원',
        mood: '정돈된 선과 따뜻한 조명',
        materials: '브라스, 회색석',
        location: '이탈리아 체세나',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/The_mausoleum_of_the_Marquess_Marquesses_Palazzo_Ghini_Ghini_in_the_Urban_Cemetery_of_Cesena-Il_mausoleo_dei_Marchese_Marchesi_Palazzo_Ghini_Ghini_nel_Cimitero_Urbano_di_Cesena..jpg',
        credit: 'Gianluca Bianchi · CC0',
        creditUrl: 'https://commons.wikimedia.org/w/index.php?curid=23057702'
    },
    {
        id: 'island',
        name: '섬의 돌정원',
        mood: '바람과 돌 사이의 여백',
        materials: '현무암, 조약돌',
        location: '노퍽섬 해안',
        image: 'https://live.staticflickr.com/3738/11791295794_f029a3da85_b.jpg',
        credit: 'DrBob317 · CC BY-SA',
        creditUrl: 'https://www.flickr.com/photos/33425911@N06/11791295794'
    },
    {
        id: 'japan',
        name: '일본식 묘지',
        mood: '질서정연한 석등과 돌비석',
        materials: '화산석, 이끼',
        location: '일본 브룸',
        image: 'https://live.staticflickr.com/3145/2747277093_61a010d970.jpg',
        credit: 'tm-tm · CC BY-SA',
        creditUrl: 'https://www.flickr.com/photos/52942259@N00/2747277093'
    },
    {
        id: 'mexico',
        name: '멕시코 색채 묘지',
        mood: '화려한 색과 축제의 기억',
        materials: '채색 석재, 꽃 장식',
        location: '멕시코 축일',
        image: 'https://live.staticflickr.com/4153/5437509886_7c277612f0.jpg',
        credit: 'wallygrom · CC BY-SA',
        creditUrl: 'https://www.flickr.com/photos/33037982@N04/5437509886'
    },
    {
        id: 'neworleans',
        name: '뉴올리언스 묘지',
        mood: '지상 위로 솟은 석실',
        materials: '석회암, 철제 장식',
        location: '미국 루이지애나',
        image: 'https://live.staticflickr.com/1437/5183363938_f799bdc9b8_b.jpg',
        credit: 'Loco Steve · CC BY',
        creditUrl: 'https://www.flickr.com/photos/36989019@N08/5183363938'
    },
    {
        id: 'nordic',
        name: '북유럽 숲묘지',
        mood: '침묵을 담은 소나무 길',
        materials: '목재, 석재',
        location: '스웨덴 스톡홀름',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Skogskyrkogarden-night-2007-11-03.JPG',
        credit: 'BloodIce · CC BY-SA',
        creditUrl: 'https://commons.wikimedia.org/w/index.php?curid=3364285'
    },
    {
        id: 'islamic',
        name: '이슬람 묘지',
        mood: '단정한 비석과 넓은 하늘',
        materials: '백색 석재',
        location: '중국 닝샤',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Lingshan_Islamic_Cemetery_-_city_view_-_DSCF8486.JPG',
        credit: 'Vmenkov · CC BY-SA',
        creditUrl: 'https://commons.wikimedia.org/w/index.php?curid=18786636'
    },
    {
        id: 'jewish',
        name: '유대인 묘지',
        mood: '오래된 석비와 시간의 결',
        materials: '석회암, 조각',
        location: '체코 프라하',
        image: 'https://live.staticflickr.com/3878/32978987236_860383eb04_b.jpg',
        credit: 'archer10 · CC BY-SA',
        creditUrl: 'https://www.flickr.com/photos/22490717@N02/32978987236'
    },
    {
        id: 'italy',
        name: '이탈리아 기념묘지',
        mood: '조각과 회랑의 장엄함',
        materials: '대리석, 조각상',
        location: '피사 캄포산토',
        image: 'https://live.staticflickr.com/8751/16813099494_bdfb1fa36f_b.jpg',
        credit: 'Bernd Thaller · CC BY',
        creditUrl: 'https://www.flickr.com/photos/44296132@N06/16813099494'
    },
    {
        id: 'korea',
        name: '한국 추모공원',
        mood: '정갈한 추모 공간과 태극기',
        materials: '화강암, 잔디',
        location: '대한민국 현충원',
        image: 'https://live.staticflickr.com/2921/14193907450_637337f15d_b.jpg',
        credit: 'KOREA.NET · CC BY-SA',
        creditUrl: 'https://www.flickr.com/photos/42438955@N05/14193907450'
    }
];

function updatePreview() {
    const nameValue = nameInput.value.trim() || '이름을 남겨주세요';
    const birthValue = birthInput.value.trim() || 'YYYY';
    const deathValue = deathInput.value.trim() || 'YYYY';
    const taglineValue = taglineInput.value.trim() || '한 줄 요약을 남겨주세요';
    const epitaphValue = epitaphInput.value.trim() || '마지막 한 문장을 천천히 써 내려가세요.';
    const toneValue = getSelectedTone();
    const audienceValue = audienceInput.value;

    previewName.textContent = nameValue;
    previewDates.textContent = `${birthValue} — ${deathValue}`;
    previewEpitaph.textContent = epitaphValue;
    previewTone.textContent = toneValue;

    previewNameLg.textContent = nameValue;
    previewDatesLg.textContent = `${birthValue} — ${deathValue}`;
    previewTagline.textContent = taglineValue;
    previewEpitaphLg.textContent = epitaphValue;
    previewToneLg.textContent = toneValue;
    previewAudience.textContent = audienceValue;

    tombstoneName.textContent = nameValue;
    tombstoneDates.textContent = `${birthValue} — ${deathValue}`;
    tombstoneEpitaph.textContent = epitaphValue;
}

function getSelectedTone() {
    const tone = document.querySelector('input[name="tone"]:checked');
    return tone ? tone.value : '담담한';
}

function updateCounter() {
    countNow.textContent = epitaphInput.value.length.toString();
}

function randomLine() {
    const allLines = Object.values(tones).flat();
    const choice = allLines[Math.floor(Math.random() * allLines.length)];
    epitaphInput.value = choice;
    updateCounter();
    updatePreview();
}

function composeDraft() {
    const toneValue = getSelectedTone();
    const pool = tones[toneValue] || tones['담담한'];
    const taglineValue = taglineInput.value.trim();
    const audienceValue = audienceInput.value;
    const nameValue = nameInput.value.trim();
    const base = pool[Math.floor(Math.random() * pool.length)];
    const additions = [];

    if (taglineValue) {
        additions.push(taglineValue);
    }
    if (audienceValue !== '모두에게') {
        additions.push(`${audienceValue} 기억을 곁에 둡니다.`);
    }
    if (nameValue) {
        additions.push(`${nameValue}의 시간은 여기서 빛납니다.`);
    }

    const draft = [base, ...additions].join(' ');
    epitaphInput.value = draft.slice(0, 120);
    updateCounter();
    updatePreview();
}

function setPreviewStyle(style) {
    selectedStyle = style;
    previewStyle.textContent = style.name;
    previewCard.style.backgroundImage = `linear-gradient(160deg, rgba(249, 245, 241, 0.9), rgba(231, 221, 209, 0.75)), url('${style.image}')`;
    previewHeroCard.style.backgroundImage = `linear-gradient(140deg, rgba(253, 249, 245, 0.9), rgba(240, 232, 223, 0.8)), url('${style.image}')`;
}

function buildCemeteryCard(style, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'cemetery-card';
    card.style.animationDelay = `${0.05 * index}s`;
    card.innerHTML = `
        <div class="cemetery-image" style="background-image: url('${style.image}')"></div>
        <span class="cemetery-chip">${style.location}</span>
        <div>
            <p class="cemetery-title">${style.name}</p>
            <p class="cemetery-desc">${style.mood}</p>
        </div>
        <p class="cemetery-meta">재료: ${style.materials}</p>
        <a class="cemetery-credit" href="${style.creditUrl}" target="_blank" rel="noopener noreferrer">사진: ${style.credit}</a>
    `;

    card.addEventListener('click', () => {
        document.querySelectorAll('.cemetery-card').forEach((item) => {
            item.classList.remove('active');
        });
        card.classList.add('active');
        setPreviewStyle(style);
    });

    return card;
}

function renderCemeteryStyles() {
    cemeteryGrid.innerHTML = '';
    cemeteryStyles.forEach((style, index) => {
        const card = buildCemeteryCard(style, index);
        if (style.id === preferredStyleId || (!preferredStyleId && index === 0)) {
            card.classList.add('active');
            setPreviewStyle(style);
        }
        cemeteryGrid.appendChild(card);
    });
}

function saveDraft() {
    const draft = {
        name: nameInput.value.trim(),
        birth: birthInput.value.trim(),
        death: deathInput.value.trim(),
        tagline: taglineInput.value.trim(),
        epitaph: epitaphInput.value.trim(),
        tone: getSelectedTone(),
        audience: audienceInput.value,
        styleId: selectedStyle ? selectedStyle.id : null
    };
    localStorage.setItem('lastWhisperDraft', JSON.stringify(draft));
    saveButton.textContent = '저장됨';
    setTimeout(() => {
        saveButton.textContent = '초안 저장';
    }, 1600);
}

function loadDraft() {
    const draft = localStorage.getItem('lastWhisperDraft');
    if (!draft) {
        return;
    }
    const data = JSON.parse(draft);
    nameInput.value = data.name || '';
    birthInput.value = data.birth || '';
    deathInput.value = data.death || '';
    taglineInput.value = data.tagline || '';
    epitaphInput.value = data.epitaph || '';
    audienceInput.value = data.audience || '모두에게';
    preferredStyleId = data.styleId || null;

    const toneRadio = document.querySelector(`input[name="tone"][value="${data.tone}"]`);
    if (toneRadio) {
        toneRadio.checked = true;
    }
    updateCounter();
    updatePreview();
}

function getScore(item) {
    const likes = item.likes || 0;
    const dislikes = item.dislikes || 0;
    return likes - dislikes;
}

function formatDate(timestamp) {
    if (!timestamp) {
        return '방금 전';
    }
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function renderInspiration(items) {
    inspirationList.innerHTML = '';
    if (!items.length) {
        inspirationList.innerHTML = '<p class="inspiration-meta">아직 공유된 문장이 없습니다. 첫 문장을 남겨주세요.</p>';
        return;
    }
    const votes = JSON.parse(localStorage.getItem(voteStorageKey) || '{}');
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'inspiration-card';
        const userVote = votes[item.id];
        const rankLabel = index < 3 ? `Top ${index + 1}` : `Rank ${index + 1}`;
        const rank = document.createElement('span');
        rank.className = 'inspiration-rank';
        rank.textContent = rankLabel;

        const text = document.createElement('p');
        text.className = 'inspiration-text';
        text.textContent = item.text;

        const tags = document.createElement('div');
        tags.className = 'inspiration-tags';
        const tone = document.createElement('span');
        tone.textContent = item.tone || '담담한';
        const style = document.createElement('span');
        style.textContent = item.style || '묘지 선택 없음';
        tags.append(tone, style);

        const actions = document.createElement('div');
        actions.className = 'inspiration-actions';
        const likeButton = document.createElement('button');
        likeButton.className = `reaction-btn ${userVote === 'like' ? 'active' : ''}`;
        likeButton.dataset.id = item.id;
        likeButton.dataset.type = 'like';
        likeButton.textContent = `좋아요 ${item.likes || 0}`;
        const dislikeButton = document.createElement('button');
        dislikeButton.className = `reaction-btn ${userVote === 'dislike' ? 'active' : ''}`;
        dislikeButton.dataset.id = item.id;
        dislikeButton.dataset.type = 'dislike';
        dislikeButton.textContent = `싫어요 ${item.dislikes || 0}`;
        actions.append(likeButton, dislikeButton);

        const meta = document.createElement('p');
        meta.className = 'inspiration-meta';
        meta.textContent = `${formatDate(item.createdAt)} · 점수 ${getScore(item)}`;

        card.append(rank, text, tags, actions, meta);
        inspirationList.appendChild(card);
    });
}

async function fetchEpitaphs() {
    if (!backendEnabled) {
        backendNote.textContent = 'main.js의 FIREBASE_DB_URL을 설정하면 공유 랭킹이 활성화됩니다.';
        inspirationList.innerHTML = '<p class="inspiration-meta">백엔드 연결이 필요합니다.</p>';
        return;
    }
    backendNote.textContent = '';
    inspirationList.innerHTML = '<p class="inspiration-meta">문장을 불러오는 중입니다.</p>';
    try {
        const response = await fetch(`${FIREBASE_DB_URL}/epitaphs.json`);
        const data = await response.json();
        if (!data) {
            currentEpitaphs = {};
            renderInspiration([]);
            return;
        }
        const items = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        items.sort((a, b) => {
            const scoreDiff = getScore(b) - getScore(a);
            if (scoreDiff !== 0) {
                return scoreDiff;
            }
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
        currentEpitaphs = items.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {});
        renderInspiration(items);
    } catch (error) {
        inspirationList.innerHTML = '<p class="inspiration-meta">불러오기에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>';
    }
}

async function shareEpitaph() {
    if (!backendEnabled) {
        backendNote.textContent = 'main.js의 FIREBASE_DB_URL을 먼저 입력해 주세요.';
        return;
    }
    const text = epitaphInput.value.trim();
    if (!text) {
        alert('공유할 묘비명이 필요합니다. 먼저 한 줄을 작성해 주세요.');
        return;
    }
    const payload = {
        text,
        tone: getSelectedTone(),
        style: selectedStyle ? selectedStyle.name : '',
        likes: 0,
        dislikes: 0,
        createdAt: Date.now()
    };
    shareEpitaphButton.textContent = '공유 중...';
    try {
        await fetch(`${FIREBASE_DB_URL}/epitaphs.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        shareEpitaphButton.textContent = '공유됨';
        setTimeout(() => {
            shareEpitaphButton.textContent = '현재 문장 공유';
        }, 1400);
        fetchEpitaphs();
    } catch (error) {
        shareEpitaphButton.textContent = '공유 실패';
    }
}

async function voteOnEpitaph(id, reaction) {
    if (!backendEnabled) {
        return;
    }
    const entry = currentEpitaphs[id];
    if (!entry) {
        return;
    }
    const votes = JSON.parse(localStorage.getItem(voteStorageKey) || '{}');
    const previous = votes[id];
    if (previous === reaction) {
        return;
    }
    let likes = entry.likes || 0;
    let dislikes = entry.dislikes || 0;
    if (previous === 'like') {
        likes = Math.max(0, likes - 1);
    }
    if (previous === 'dislike') {
        dislikes = Math.max(0, dislikes - 1);
    }
    if (reaction === 'like') {
        likes += 1;
    } else {
        dislikes += 1;
    }

    try {
        await fetch(`${FIREBASE_DB_URL}/epitaphs/${id}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likes, dislikes })
        });
        votes[id] = reaction;
        localStorage.setItem(voteStorageKey, JSON.stringify(votes));
        fetchEpitaphs();
    } catch (error) {
        // ignore
    }
}

function init() {
    loadDraft();
    renderCemeteryStyles();
    updateCounter();
    updatePreview();
    fetchEpitaphs();
}

[nameInput, birthInput, deathInput, taglineInput, epitaphInput, audienceInput].forEach((input) => {
    input.addEventListener('input', () => {
        updateCounter();
        updatePreview();
    });
});

document.querySelectorAll('input[name="tone"]').forEach((radio) => {
    radio.addEventListener('change', updatePreview);
});

randomButton.addEventListener('click', randomLine);
composeButton.addEventListener('click', composeDraft);
saveButton.addEventListener('click', saveDraft);
refreshEpitaphsButton.addEventListener('click', fetchEpitaphs);
shareEpitaphButton.addEventListener('click', shareEpitaph);

inspirationList.addEventListener('click', (event) => {
    const button = event.target.closest('.reaction-btn');
    if (!button) {
        return;
    }
    voteOnEpitaph(button.dataset.id, button.dataset.type);
});

startComposeButton.addEventListener('click', () => {
    document.getElementById('composer').scrollIntoView({ behavior: 'smooth' });
});

startDesignButton.addEventListener('click', () => {
    document.getElementById('cemetery').scrollIntoView({ behavior: 'smooth' });
});

init();
