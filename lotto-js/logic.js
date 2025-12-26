// js/logic.js - 데이터 분석 및 번호 생성 알고리즘 담당

// 1. 핵심 데이터 변수 선언 (전역 변수)
let lottoHistory = []; // 전체 로또 당첨 기록
let numberFrequency = {}; // 번호별 당첨 횟수 저장
let analysisComplete = false; // 분석 완료 여부 확인용 플래그

// 2. 고급 통계 분석 데이터 구조
let advancedStats = {
  hotNumbers: [], // 자주 나온 번호
  coldNumbers: [], // 적게 나온 번호
  overdueNumbers: [], // 오랫동안 안 나온 번호
};

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

  // 🚀 핫 번호:  번호순 정렬
  advancedStats.hotNumbers = [...sortedEntries]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // 많이 나온 순
      return parseInt(a[0]) - parseInt(b[0]); // 번호 작은 순
    })
    .slice(0, 15)
    .map((item) => parseInt(item[0]))
    .sort((a, b) => a - b); // 오름차순 정렬

  // ❄️ 콜드 번호: 번호순 정렬
  advancedStats.coldNumbers = [...sortedEntries]
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] - b[1]; // 적게 나온 순
      return parseInt(a[0]) - parseInt(b[0]); // 번호 작은 순
    })
    .slice(0, 15)
    .map((item) => parseInt(item[0]))
    .sort((a, b) => a - b); // 오름차순 정렬

  // ⏰ 미출현(오버듀) 최근 10회 안나온번호  역순정렬
  const recent10Draws = lottoHistory.slice(-10);

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

// 5% 확률로 나오는 멘트와 영상 파일 매칭

const RARE_DATA = {
  hot: {
    file: "hot.mp4",
    color: "#D32F2F",
    title: "🔥 전설의 불꽃 감지!",
    desc: "뜨거운 당첨 기운이 폭발합니다!<br>거부할 수 없는 <span class='highlight'>대세의 흐름</span>이<br>당신을 1등으로 이끕니다.",
  },
  cold: {
    file: "cold.mp4",
    color: "#54a0ff",
    title: "💎 심해의 보물 발견!",
    desc: "남들이 놓친 <span class='highlight'>알짜배기</span>를 찾아냈습니다.<br>바닥을 치고 올라오는 <span class='highlight'>강력한 반등</span>을 믿으세요!",
  },
  overdue: {
    file: "overdue.mp4",
    color: "#e056fd",
    title: "🐉 흑염룡의 봉인 해제!",
    desc: "너무 오래 기다렸습니다.<br>어둠 속에 숨어있던 번호가<br><span class='highlight'>오늘 밤, 세상 밖으로 깨어납니다!</span>",
  },
  random: {
    file: "random.mp4",
    color: "#FFD700",
    title: "👑 행운의 여신 강림!!!!",
    desc: "이것은 우연이 맞습니다! <span class='highlight'>우연</span>입니다.<br> 20%의 확률이 선택한 <span class='highlight'>기적의 조합</span>을 받아가세요!",
  },
};

//[메인컨트롤러] 버튼을 누르면 이 함수가 제일 먼저 실행 됩니다!

function handleButtonClick(type) {
  // 광클 금지
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => (btn.disabled = true));

  // 20% 확률계산
  const luckyChance = Math.floor(Math.random() * 5) + 1;

  if (luckyChance === 1) {
    console.log("20% 확률 당첨");
    playRareEffect(type);
  } else {
    setTimeout(() => {
      generateStrategyNumbers(type);
      unlockButtons(); // 버튼 잠금 해제
    }, 80);
  }
}

//🎬 레어 이펙트 재생 함수
function playRareEffect(type) {
  const overlay = document.getElementById("rare-overlay");
  const video = document.getElementById("rare-video");
  const title = document.getElementById("rare-title");
  const desc = document.getElementById("rare-desc");

  const data = RARE_DATA[type];

  // 내용 세팅
  video.src = `./lotto-data/${data.file}`;
  title.innerHTML = data.title;
  desc.innerHTML = data.desc;
  title.style.color = data.color;

  // 1. 오버레이 보이기 & 애니메이션 클래스 초기화 (깨끗한 상태로 시작)
  overlay.classList.remove("hidden");
  // 기존에 붙어있던 등장/퇴장 클래스 싹 제거
  title.classList.remove("appear-animate", "disappear-animate");
  desc.classList.remove("appear-animate", "disappear-animate");

  // 브라우저에게 "야, 스타일 초기화했다!"고 인식시킴 (Reflow)
  void title.offsetWidth;

  // 2. 영상 재생
  video.currentTime = 0;
  video.play().catch((e) => console.log("자동재생 오류:", e));

  // 3. [등장] 0.5초 뒤 텍스트 순차적 등장 시작
  setTimeout(() => {
    title.classList.add("appear-animate");
    // desc에도 똑같이 붙이지만, CSS의 animation-delay 덕분에 늦게 나옴
    desc.classList.add("appear-animate");
  }, 500);

  // 4. [퇴장] 영상이 끝나면 실행되는 로직
  video.onended = function () {
    // 1. 영상 끝나고 2초 동안은 여운을 즐김 (글씨+배경 유지)
    setTimeout(() => {
      // 2. ⭐ 이제 사라지자! (투명도 0으로 변경 -> CSS가 0.8초 동안 서서히 사라지게 함)
      overlay.classList.add("fading-out");

      // 3. ⭐ 사라지는 애니메이션 시간(0.8초)만큼 기다렸다가 진짜로 끔
      setTimeout(() => {
        overlay.classList.add("hidden"); // 화면에서 완전히 제거
        overlay.classList.remove("fading-out"); // 다음을 위해 페이드 클래스 제거
        overlay.style.opacity = ""; // 스타일 초기화

        generateStrategyNumbers(type, true); // 결과 번호 생성
        unlockButtons(); // 버튼 풀기
      }, 800); // 0.8초 (CSS transition 시간과 동일하게)
    }, 1000); // 2초 대기
  };
}

// 버튼 잠금 해제 도우미
function unlockButtons() {
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => (btn.disabled = false));
}

// 3. 전략별 번호 생성 (핵심 기능)
function generateStrategyNumbers(strategyType, isRare = false) {
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
        "<strong style='color: #D32F2F;'>1등 단골 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호 <span style='color: #218C74;'> 4개</span>를 섞어 보았습니다🍀";
      break;

    case "cold":
      numbers.push(...selectFromPool(advancedStats.coldNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "❄️ 콜드(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #1A237E;'>저평가된 알짜 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호 <span style='color: #218C74;'> 4개</span>를 섞어 보았습니다🍀";
      break;

    case "overdue":
      numbers.push(...selectFromPool(advancedStats.overdueNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "⏰ 미출현(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #9C27B0;'>최근 숨어있던 번호 중 2개</strong>에 <br> <span style='color: #218C74;'>행운</span>의 랜덤 번호<span style='color: #218C74;'> 4개</span>를 섞어 보았습니다🍀";
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
  if (isRare === false) {
    showResultModal(message);
  }
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

// 모든 전략 버튼을 찾아서 클릭 이벤트를 연결합니다.
const strategyButtons = document.querySelectorAll(".strategy-btn");

strategyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const type = this.getAttribute("data-type");
    handleButtonClick(type);
  });
});
