// js/logic.js - 데이터 분석 및 번호 생성 알고리즘 담당

// 1. 과거 데이터 기본 분석 (빈도수 카운트)
function analyzeHistoricalData() {
  numberFrequency = {};

  lottoHistory.forEach((draw) => {
    draw.forEach((num) => {
      numberFrequency[num] = (numberFrequency[num] || 0) + 1;
    });
  });

  analysisComplete = true;
}

// 2. 고급 통계 분석 (핫/콜드/오버듀 추출 + 정렬)
function performAdvancedAnalysis() {
  const allDraws = lottoHistory;
  const totalFrequency = {};

  // 빈도수 계산
  allDraws.forEach((draw) => {
    draw.forEach((num) => {
      totalFrequency[num] = (totalFrequency[num] || 0) + 1;
    });
  });

  const sortedEntries = Object.entries(totalFrequency);

  // 🚀 핫 번호: 빈도수 상위 15개 -> 번호순 정렬
  advancedStats.hotNumbers = [...sortedEntries]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // 많이 나온 순
      return parseInt(a[0]) - parseInt(b[0]); // 번호 작은 순
    })
    .slice(0, 15)
    .map((item) => parseInt(item[0]))
    .sort((a, b) => a - b); // ★ 최종 화면용 오름차순 정렬

  // ❄️ 콜드 번호: 빈도수 하위 15개 -> 번호순 정렬
  advancedStats.coldNumbers = [...sortedEntries]
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] - b[1]; // 적게 나온 순
      return parseInt(a[0]) - parseInt(b[0]); // 번호 작은 순
    })
    .slice(0, 15)
    .map((item) => parseInt(item[0]))
    .sort((a, b) => a - b); // ★ 최종 화면용 오름차순 정렬

  // ⏰ 미출현(오버듀) 최근 10회 안나온번호  역순정렬
  const recent10Draws = lottoHistory.slice(0, 10);
  const recentNumbers = new Set();
  recent10Draws.forEach((draw) =>
    draw.forEach((num) => recentNumbers.add(num))
  );

  advancedStats.overdueNumbers = [];
  for (let i = 1; i <= 45; i++) {
    if (!recentNumbers.has(i)) {
      advancedStats.overdueNumbers.push(i);
    }
  }
  advancedStats.overdueNumbers.sort((a, b) => a - b);
}

// 3. 전략별 번호 생성 (핵심 기능)
function generateStrategyNumbers(strategyType) {
  // 분석 데이터 최신화
  performAdvancedAnalysis();

  const numbers = [];
  let strategyName = "";
  let message = "";

  // 전략에 따른 번호 조합
  switch (strategyType) {
    case "hot":
      numbers.push(...selectFromPool(advancedStats.hotNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "🔥 핫(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #D32F2F;'>1등 단골 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호 <span style='color: #218C74;'> 4개</span>를 섞어 보았습니다!🍀";
      break;

    case "cold":
      numbers.push(...selectFromPool(advancedStats.coldNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "❄️ 콜드(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #1A237E;'>저평가된 알짜 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호 <span style='color: #218C74;'> 4개</span>를 섞어 보았습니다!🍀";
      break;

    case "overdue":
      numbers.push(...selectFromPool(advancedStats.overdueNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "⏰ 미출현(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #9C27B0;'>최근 숨어있던 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호<span style='color: #218C74;'> 4개</span>를 섞어 보았습니다! 🍀";
      break;

    case "random":
      numbers.push(...selectFromPool(getAllNumbers(), 6));
      strategyName = "🍀 100% 완전 랜덤 조합";
      message =
        "<strong style='color: #ffa500;'>황금빛 기운이 감지되었습니다.</strong> <br> <span style='color: #218C74;'>행운</span>의 랜덤번호<span style='color: #218C74;'> 6개</span>를 소환했습니다!!!";
      break;
  }

  // 중복 제거 및 6개 채우기
  const uniqueNumbers = [...new Set(numbers)];
  while (uniqueNumbers.length < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    if (!uniqueNumbers.includes(randomNum)) {
      uniqueNumbers.push(randomNum);
    }
  }

  // 번호 정렬
  const finalNumbers = uniqueNumbers.slice(0, 6).sort((a, b) => a - b);

  // 화면 표시 (ui.js에 있는 함수 호출)
  displayNumbers(finalNumbers);
  showResultModal(message);
}

// 4. 일반 랜덤 번호 생성
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

// --- 도우미 함수들 (Helpers) ---

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

// 연속 번호 개수 계산 (필요시 사용)
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
