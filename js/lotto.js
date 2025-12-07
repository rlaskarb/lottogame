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
                lottoHistory = data.history.reverse();

                // (선택사항) 다음 로드를 위해 json 데이터를 로컬 스토리지에 저장합니다.
                saveDataToStorage();
            } else {
                console.error("lotto.json 파일의 데이터 형식이 올바르지 않습니다.");
            }

        } catch (error) {
            console.error('lotto.json 파일을 불러오는 중 오류가 발생했습니다:', error);
            alert(' 로또 데이터를 불러오는 데 실패했습니다.');
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

// 빈도 차트 생성 (심플 모드)
function generateFrequencyChart() {
    const chartContainer = document.getElementById('frequencyChart');
    chartContainer.innerHTML = '';

    // 스타일을 위해 컨테이너에 클래스 추가 (그리드 레이아웃용)
    chartContainer.classList.add('simple-grid'); 

    // 1-45 번호별 빈도 표시
    for (let i = 1; i <= 45; i++) {
        const frequency = numberFrequency[i] || 0;
        
        // 막대바(bar) 태그를 제거하고 숫자와 횟수만 남김
        const frequencyItem = document.createElement('div');
        frequencyItem.className = 'frequency-item'; // 이름 변경 (bar -> item)
        
        // 번호에 따라 색상을 다르게 주는 센스 (공 색깔 처럼)
        let ballColorClass = 'ball-10'; // 기본 노랑
        if (i >= 11 && i <= 20) ballColorClass = 'ball-20'; // 파랑
        else if (i >= 21 && i <= 30) ballColorClass = 'ball-30'; // 빨강
        else if (i >= 31 && i <= 40) ballColorClass = 'ball-40'; // 검정
        else if (i >= 41) ballColorClass = 'ball-50'; // 초록

        frequencyItem.innerHTML = `
            <div class="number-circle ${ballColorClass}">${i}</div>
            <div class="frequency-text">${frequency}회</div>
        `;
        chartContainer.appendChild(frequencyItem);
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

}


// 고급 통계 분석
function performAdvancedAnalysis() {
    // 1. 핫/콜드 분석: 전체 데이터 사용
    const allDraws = lottoHistory; 
    const totalFrequency = {};

    allDraws.forEach(draw => {
        draw.forEach(num => {
            totalFrequency[num] = (totalFrequency[num] || 0) + 1;
        });
    });

    // 빈도수대로 정렬
    const sortedByFrequency = Object.entries(totalFrequency)
        .sort((a, b) => b[1] - a[1]);

    // 상위 15개를 핫 번호 후보로 선정 (이 중에서 4개 뽑음)
    advancedStats.hotNumbers = sortedByFrequency.slice(0, 15).map(item => parseInt(item[0]));
    
    // 하위 15개를 콜드 번호 후보로 선정
    advancedStats.coldNumbers = sortedByFrequency.slice(-15).map(item => parseInt(item[0]));

    // 2. 오버듀(미출현) 분석: 최근 10회 기준 설정
    const recent10Draws = lottoHistory.slice(0, 10);
    const recentNumbers = new Set();
    
    recent10Draws.forEach(draw => {
        draw.forEach(num => recentNumbers.add(num));
    });

    advancedStats.overdueNumbers = [];
    for (let i = 1; i <= 45; i++) {
        // 최근 10회 안에 한 번도 안 나왔다면 추가
        if (!recentNumbers.has(i)) {
            advancedStats.overdueNumbers.push(i);
        }
    }
}


// 전략별 번호 생성 (비율 수정됨)
function generateStrategyNumbers(strategyType) {
    // 1. 분석 데이터 최신화
    performAdvancedAnalysis();
    
    const numbers = [];
    let strategyName = "";

    // 2. 선택된 전략에 따라 번호 조합
    switch (strategyType) {
        case 'hot':
            // 🔥 전략: 전체 통계 핫 번호 4개 + 랜덤 번호 2개
            numbers.push(...selectFromPool(advancedStats.hotNumbers, 2));
            numbers.push(...selectFromPool(getAllNumbers(), 4)); 
            strategyName = "🔥 핫(2) + 랜덤(4) 조합";
            break;

        case 'cold':
            // ❄️ 전략: 전체 통계 콜드 번호 4개 + 핫 번호 2개
            numbers.push(...selectFromPool(advancedStats.coldNumbers, 2));
            numbers.push(...selectFromPool(advancedStats.hotNumbers, 4)); 
            strategyName = "❄️ 콜드(2) + 핫(4) 조합";
            break;

        case 'overdue':
            // ⏰ 전략: 최근 10회 미출현 번호 4개 + 핫 번호 2개
            // 만약 미출현 번호가 4개가 안 되면 나머지는 랜덤으로 채워짐
            numbers.push(...selectFromPool(advancedStats.overdueNumbers, 2));
            numbers.push(...selectFromPool(advancedStats.hotNumbers, 4)); 
            strategyName = "⏰ 미출현(2) + 핫(4) 조합";
            break;
    }

    // 3. 중복 제거 및 6개 채우기 (혹시 모자라면 랜덤으로 채움)
    const uniqueNumbers = [...new Set(numbers)];
    while (uniqueNumbers.length < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        if (!uniqueNumbers.includes(randomNum)) {
            uniqueNumbers.push(randomNum);
        }
    }

    // 4. 번호 정렬 및 화면 표시
    const finalNumbers = uniqueNumbers.slice(0, 6).sort((a, b) => a - b);
    displayNumbers(finalNumbers);

    // 로그 확인용
    console.log(`생성 전략: ${strategyName}`);
    console.log(`선택된 번호: ${finalNumbers}`);
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
        'overdueNumbers': '⏰ 오버듀 번호 전략'
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