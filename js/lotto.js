// js/lotto.js

// 로또 데이터 (기본값)
let lottoHistory = [];

let numberFrequency = {};
let analysisComplete = false;

// 고급 통계 분석 데이터
let advancedStats = {
    hotNumbers: [],
    coldNumbers: [],
    overdueNumbers: [],
    sumDistribution: {},
    patternAnalysis: {}
};

// 페이지 로드 시 초기화
window.onload = async function () { // 'async' 키워드 추가
    // 1. 로컬 스토리지에서 먼저 데이터 로드 시도
    const loadedFromStorage = loadDataFromStorage();

    // 2. 로컬 스토리지에 데이터가 없다면(false 반환 시) 
    //    data/lotto.json 파일에서 비동기로 불러옵니다.
    if (!loadedFromStorage) {
        console.log("로컬 스토리지에 데이터가 없습니다. data/lotto.json에서 불러옵니다.");
        try {
            // fetch를 사용하여 json 파일의 내용을 가져옵니다.
            const response = await fetch('data/lotto.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 가져온 데이터를 json으로 변환합니다.
            const data = await response.json();

            // json 파일의 구조(history 키)에 맞게 lottoHistory 변수에 할당합니다.
            if (data && data.history) {
                lottoHistory = data.history;

                // (선택사항) 다음 로드를 위해 json 데이터를 로컬 스토리지에 저장합니다.
                saveDataToStorage();
            } else {
                console.error("lotto.json 파일의 데이터 형식이 올바르지 않습니다.");
            }

        } catch (error) {
            console.error('lotto.json 파일을 불러오는 중 오류가 발생했습니다:', error);
            alert('기본 로또 데이터를 불러오는 데 실패했습니다.');
        }
    } else {
        console.log("로컬 스토리지에서 데이터를 성공적으로 불러왔습니다.");
    }

    // 3. 데이터 로드가 완료된 후(성공하든 실패하든) 분석 함수들을 실행합니다.
    analyzeHistoricalData();
    updateStatistics();
    generateFrequencyChart();
    performAdvancedAnalysis();
    updateAdvancedAnalysis();
};

// 로컬 스토리지에서 데이터 불러오기
function loadDataFromStorage() {
    const savedData = localStorage.getItem('lottoHistory');
    if (savedData) {
        lottoHistory = JSON.parse(savedData);
        return true; // 로드 성공
    }
    return false; // 로드할 데이터 없음
}

// 로컬 스토리지에 데이터 저장
function saveDataToStorage() {
    localStorage.setItem('lottoHistory', JSON.stringify(lottoHistory));
}

// 새로운 당첨번호 추가
function addNewNumbers() {
    const input = document.getElementById('newNumbers');
    const numbersText = input.value.trim();

    if (!numbersText) {
        alert('번호를 입력해주세요!');
        return;
    }

    // 번호 파싱
    const numbers = numbersText.split(',').map(num => parseInt(num.trim()));

    // 유효성 검사
    if (numbers.length !== 6) {
        alert('6개의 번호를 입력해주세요!');
        return;
    }

    if (numbers.some(num => isNaN(num) || num < 1 || num > 45)) {
        alert('1-45 사이의 유효한 번호를 입력해주세요!');
        return;
    }

    if (new Set(numbers).size !== 6) {
        alert('중복된 번호가 있습니다!');
        return;
    }

    // 데이터 추가
    lottoHistory.unshift(numbers); // 최신 데이터를 맨 앞에 추가
    lottoHistory = lottoHistory.slice(0, 99999); // 최대 100개로 제한

    // 저장 및 업데이트
    saveDataToStorage();
    input.value = '';

    // 화면 업데이트
    analyzeHistoricalData();
    updateStatistics();
    generateFrequencyChart();
    performAdvancedAnalysis();
    updateAdvancedAnalysis();

    alert('새로운 당첨번호가 추가되었습니다!');
}

// 파일에서 데이터 불러오기
function loadDataFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    lottoHistory = data.history || data;
                    saveDataToStorage();

                    // 화면 업데이트
                    analyzeHistoricalData();
                    updateStatistics();
                    generateFrequencyChart();
                    performAdvancedAnalysis();
                    updateAdvancedAnalysis();

                    alert('데이터를 성공적으로 불러왔습니다!');
                } catch (error) {
                    alert('파일 형식이 올바르지 않습니다!');
                }
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

// 파일로 데이터 저장
function saveDataToFile() {
    const data = {
        history: lottoHistory,
        lastUpdated: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotto_data.json';
    a.click();

    URL.revokeObjectURL(url);
}

// 과거 데이터 분석
function analyzeHistoricalData() {
    numberFrequency = {};

    lottoHistory.forEach(draw => {
        draw.forEach(num => {
            numberFrequency[num] = (numberFrequency[num] || 0) + 1;
        });
    });

    analysisComplete = true;
    updatePatternAnalysis();
}

// 통계 업데이트
function updateStatistics() {
    document.getElementById('totalDraws').textContent = lottoHistory.length;

    if (Object.keys(numberFrequency).length > 0) {
        const frequencies = Object.entries(numberFrequency);
        const mostFrequent = frequencies.reduce((a, b) => a[1] > b[1] ? a : b);
        const leastFrequent = frequencies.reduce((a, b) => a[1] < b[1] ? a : b);

        document.getElementById('mostFrequent').textContent = mostFrequent[0];
        document.getElementById('leastFrequent').textContent = leastFrequent[0];

        // 평균 합계 계산
        const avgSum = lottoHistory.reduce((sum, draw) => sum + draw.reduce((a, b) => a + b, 0), 0) / lottoHistory.length;
        document.getElementById('avgSum').textContent = Math.round(avgSum);
    }
}

// 빈도 차트 생성
function generateFrequencyChart() {
    const chartContainer = document.getElementById('frequencyChart');
    chartContainer.innerHTML = '';

    // 1-45 번호별 빈도 표시
    for (let i = 1; i <= 45; i++) {
        const frequency = numberFrequency[i] || 0;
        const maxFreq = Math.max(...Object.values(numberFrequency));
        const percentage = maxFreq > 0 ? (frequency / maxFreq) * 100 : 0;

        const frequencyBar = document.createElement('div');
        frequencyBar.className = 'frequency-bar';
        frequencyBar.innerHTML = `
            <div class="number-label">${i}</div>
            <div class="bar" style="width: ${percentage}%"></div>
            <div class="frequency-text">${frequency}회</div>
        `;
        chartContainer.appendChild(frequencyBar);
    }
}

// 패턴 분석
function updatePatternAnalysis() {
    // 연속 번호 패턴 분석
    let consecutiveCount = 0;
    lottoHistory.forEach(draw => {
        const sorted = [...draw].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i + 1] - sorted[i] === 1) {
                consecutiveCount++;
            }
        }
    });

    document.getElementById('consecutivePattern').textContent =
        `평균 ${(consecutiveCount / lottoHistory.length).toFixed(1)}개 연속 번호`;

    // 홀짝 비율 분석
    let oddCount = 0, evenCount = 0;
    lottoHistory.forEach(draw => {
        draw.forEach(num => {
            if (num % 2 === 0) evenCount++;
            else oddCount++;
        });
    });

    const totalNumbers = oddCount + evenCount;
    document.getElementById('oddEvenRatio').textContent =
        `홀수 ${(oddCount / totalNumbers * 100).toFixed(1)}% : 짝수 ${(evenCount / totalNumbers * 100).toFixed(1)}%`;

    // 구간별 분포 분석
    const ranges = { '1-15': 0, '16-30': 0, '31-45': 0 };
    lottoHistory.forEach(draw => {
        draw.forEach(num => {
            if (num <= 15) ranges['1-15']++;
            else if (num <= 30) ranges['16-30']++;
            else ranges['31-45']++;
        });
    });

    document.getElementById('rangeDistribution').textContent =
        `1-15: ${(ranges['1-15'] / totalNumbers * 100).toFixed(1)}%, 16-30: ${(ranges['16-30'] / totalNumbers * 100).toFixed(1)}%, 31-45: ${(ranges['31-45'] / totalNumbers * 100).toFixed(1)}%`;
}

// 고급 통계 분석
function performAdvancedAnalysis() {
    // 최근 10회 데이터로 핫/콜드 번호 분석
    const recentDraws = lottoHistory.slice(0, 10);
    const recentFrequency = {};

    recentDraws.forEach(draw => {
        draw.forEach(num => {
            recentFrequency[num] = (recentFrequency[num] || 0) + 1;
        });
    });

    // 핫/콜드 번호 분류
    const sortedByFrequency = Object.entries(recentFrequency)
        .sort((a, b) => b[1] - a[1]);

    advancedStats.hotNumbers = sortedByFrequency.slice(0, 10).map(item => parseInt(item[0]));
    advancedStats.coldNumbers = sortedByFrequency.slice(-10).map(item => parseInt(item[0]));

    // 오버듀 번호 (최근 5회에 안 나온 번호)
    const recentNumbers = new Set();
    recentDraws.slice(0, 5).forEach(draw => {
        draw.forEach(num => recentNumbers.add(num));
    });

    advancedStats.overdueNumbers = [];
    for (let i = 1; i <= 45; i++) {
        if (!recentNumbers.has(i)) {
            advancedStats.overdueNumbers.push(i);
        }
    }

    // 합계 분포 분석
    advancedStats.sumDistribution = {};
    lottoHistory.forEach(draw => {
        const sum = draw.reduce((a, b) => a + b, 0);
        const range = Math.floor(sum / 20) * 20; // 20단위로 그룹화
        advancedStats.sumDistribution[range] = (advancedStats.sumDistribution[range] || 0) + 1;
    });
}

// 스마트 번호 생성 (고급 통계 기반)
function generateSmartNumbers() {
    performAdvancedAnalysis();
    const numbers = [];

    // 전략 선택 (랜덤하게 선택)
    const strategies = ['hotNumbers', 'coldNumbers', 'overdueNumbers', 'balanced'];
    const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];

    switch (selectedStrategy) {
        case 'hotNumbers':
            // 핫 번호 위주로 선택
            numbers.push(...selectFromPool(advancedStats.hotNumbers, 3));
            numbers.push(...selectFromPool(getAllNumbers(), 3));
            break;

        case 'coldNumbers':
            // 콜드 번호 위주로 선택
            numbers.push(...selectFromPool(advancedStats.coldNumbers, 3));
            numbers.push(...selectFromPool(getAllNumbers(), 3));
            break;

        case 'overdueNumbers':
            // 오버듀 번호 위주로 선택
            numbers.push(...selectFromPool(advancedStats.overdueNumbers, 4));
            numbers.push(...selectFromPool(getAllNumbers(), 2));
            break;

        case 'balanced':
            // 균형잡힌 선택
            numbers.push(...selectFromPool(advancedStats.hotNumbers, 2));
            numbers.push(...selectFromPool(advancedStats.coldNumbers, 2));
            numbers.push(...selectFromPool(advancedStats.overdueNumbers, 2));
            break;
    }

    // 중복 제거 및 6개로 맞추기
    const uniqueNumbers = [...new Set(numbers)];
    while (uniqueNumbers.length < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        if (!uniqueNumbers.includes(randomNum)) {
            uniqueNumbers.push(randomNum);
        }
    }

    displayNumbers(uniqueNumbers.slice(0, 6).sort((a, b) => a - b));

    // 사용된 전략 표시
    showStrategyInfo(selectedStrategy);
}

// 풀에서 번호 선택
function selectFromPool(pool, count) {
    const selected = [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        selected.push(shuffled[i]);
    }

    return selected;
}

// 모든 번호 풀 반환
function getAllNumbers() {
    return Array.from({ length: 45 }, (_, i) => i + 1);
}

// 전략 정보 표시
function showStrategyInfo(strategy) {
    const strategyNames = {
        'hotNumbers': '🔥 핫 번호 전략',
        'coldNumbers': '❄️ 콜드 번호 전략',
        'overdueNumbers': '⏰ 오버듀 번호 전략',
        'balanced': '⚖️ 균형 전략'
    };

    setTimeout(() => {
        alert(`사용된 전략: ${strategyNames[strategy]}\n\n이 전략은 과거 데이터 분석을 바탕으로 선택되었습니다.`);
    }, 1000);
}

// 고급 분석 결과 업데이트
function updateAdvancedAnalysis() {
    // 핫 번호 표시
    const hotNumbersContainer = document.getElementById('hotNumbers');
    hotNumbersContainer.innerHTML = '';
    advancedStats.hotNumbers.forEach(num => {
        const tag = document.createElement('span');
        tag.className = 'number-tag';
        tag.textContent = num;
        hotNumbersContainer.appendChild(tag);
    });

    // 콜드 번호 표시
    const coldNumbersContainer = document.getElementById('coldNumbers');
    coldNumbersContainer.innerHTML = '';
    advancedStats.coldNumbers.forEach(num => {
        const tag = document.createElement('span');
        tag.className = 'number-tag';
        tag.textContent = num;
        coldNumbersContainer.appendChild(tag);
    });

    // 오버듀 번호 표시
    const overdueNumbersContainer = document.getElementById('overdueNumbers');
    overdueNumbersContainer.innerHTML = '';
    advancedStats.overdueNumbers.forEach(num => {
        const tag = document.createElement('span');
        tag.className = 'number-tag';
        tag.textContent = num;
        overdueNumbersContainer.appendChild(tag);
    });

    // 합계 분포 차트 표시
    const sumDistributionContainer = document.getElementById('sumDistribution');
    sumDistributionContainer.innerHTML = '';

    const maxCount = Math.max(...Object.values(advancedStats.sumDistribution));

    Object.entries(advancedStats.sumDistribution)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([range, count]) => {
            const percentage = (count / maxCount) * 100;

            const sumBar = document.createElement('div');
            sumBar.className = 'sum-bar';
            sumBar.innerHTML = `
                <div class="sum-label">${range}-${parseInt(range) + 19}</div>
                <div class="sum-progress">
                    <div class="sum-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="sum-count">${count}회</div>
            `;
            sumDistributionContainer.appendChild(sumBar);
        });
}

// 랜덤 번호 생성
function generateRandomNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }
    displayNumbers(numbers.sort((a, b) => a - b));
}

// 번호 표시
function displayNumbers(numbers) {
    const balls = document.querySelectorAll('.lotto-ball');
    balls.forEach((ball, index) => {
        ball.textContent = numbers[index] || '?';
        ball.style.animation = 'none';
        setTimeout(() => {
            ball.style.animation = 'bounce 0.6s ease-in-out';
        }, index * 100);
    });
}

// 번호 분석
function analyzeNumbers() {
    const balls = document.querySelectorAll('.lotto-ball');
    const currentNumbers = Array.from(balls).map(ball => parseInt(ball.textContent)).filter(num => !isNaN(num));

    if (currentNumbers.length === 6) {
        alert(`선택된 번호: ${currentNumbers.join(', ')}\n\n분석 결과:\n- 합계: ${currentNumbers.reduce((a, b) => a + b, 0)}\n- 홀수: ${currentNumbers.filter(n => n % 2 === 1).length}개\n- 짝수: ${currentNumbers.filter(n => n % 2 === 0).length}개\n- 연속번호: ${getConsecutiveCount(currentNumbers)}개`);
    } else {
        alert('먼저 번호를 생성해주세요!');
    }
}

// 연속 번호 개수 계산
function getConsecutiveCount(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    let consecutive = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) {
            consecutive++;
        }
    }
    return consecutive;
}