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
    const mainNumbers = draw.slice(0, 6);
    mainNumbers.forEach((num) => {
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
    draw.slice(0, 6).forEach((num) => {
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

  // ⏰ 미출현(오버듀) 최근 10회 안나온번호
  const recent10Draws = lottoHistory.slice(0, 10);

  const recentNumbers = new Set();

  recent10Draws.forEach((draw) => {
    const mainNumbers = draw.slice(0, 6);

    mainNumbers.forEach((num) => recentNumbers.add(num));
  });

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
    title: "🌑 심연의 지배자 각성!",
    desc: "너무 오래 기다렸습니다.<br>어둠 속에 숨어있던 번호가<br><span class='highlight'>오늘 밤, 세상을 지배하러 올라옵니다!</span>",
  },
  random: {
    file: "random.mp4",
    color: "#FFD700",
    title: "👑 행운의 여신 강림!!!",
    desc: "이것은 우연이 맞습니다! <span class='highlight'>우연</span>입니다.<br>20% 확률이 선택한 <span class='highlight'>행운의 조합</span>을 받아가세요!",
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
  let message = "";
  let title = "✨ 황금 조합 분석 완료!";

  // 전략에 따른 번호 조합
  switch (strategyType) {
    case "hot":
      numbers.push(...selectFromPool(advancedStats.hotNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "🔥 핫(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #FF5252;'>1등 단골 번호 중 2개</strong>에 <br> <span style='color: #55E6C1;'>행운</span>의 랜덤 번호 <span style='color: #55E6C1;'> 4개</span>를 섞어 보았습니다🍀";
      break;

    case "cold":
      numbers.push(...selectFromPool(advancedStats.coldNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "❄️ 콜드(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #8C9EFF;'>저평가된 알짜 번호 중 2개</strong>에 <br> <span style='color: #55E6C1;'>행운</span>의 랜덤 번호 <span style='color: #55E6C1;'> 4개</span>를 섞어 보았습니다🍀";
      break;

    case "overdue":
      numbers.push(...selectFromPool(advancedStats.overdueNumbers, 2));
      numbers.push(...selectFromPool(getAllNumbers(), 4));
      strategyName = "⏰ 미출현(2) + 랜덤(4) 조합";
      message =
        "<strong style='color: #E040FB;'>최근 숨어있던 번호 중 2개</strong>에 <br> <span style='color: #55E6C1;'>행운</span>의 랜덤 번호<span style='color: #55E6C1;'> 4개</span>를 섞어 보았습니다🍀";
      break;

    case "random":
      numbers.push(...selectFromPool(getAllNumbers(), 6));
      strategyName = "🍀 100% 완전 랜덤 조합";
      message =
        "<strong style='color: #FFD740;'>황금빛 기운이 감지되었습니다.</strong> <br> <span style='color: #55E6C1;'>행운</span>의 랜덤번호<span style='color: #55E6C1;'> 6개</span>를 소환했습니다!!!";
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

  if (isRare === true) {
    const rareData = RARE_DATA[strategyType];
    title = `<span style="color:${rareData.color}">${rareData.title}</span>`;
    message = rareData.desc;
  }

  // 화면 표시 (ui.js에 있는 함수 호출)
  displayNumbers(finalNumbers);
  // isRare 가 true 여도 모달 띄우기
  showResultModal(message, title);
  //번호 저장하고 화면 전환하기
  saveToMyHistory(finalNumbers, strategyType, isRare);
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

// 나만의 기록 저장 및 관리 시스템
function saveToMyHistory(numbers, type, isRare) {
  // 로컬 스토리지에서 기존 기록 가져오기
  let myHistory = JSON.parse(localStorage.getItem("my_lotto_history") || "[]");

  // 전략 이름 한글화 및 색상 매칭
  const strategyInfo = {
    hot: { name: "🔥 HOT", color: "#FF5252" },
    cold: { name: "❄️ COLD", color: "#8C9EFF" },
    overdue: { name: "⏰ 안나온", color: "#E040FB" },
    random: { name: "🍀 랜덤", color: "#fecb59" },
  };

  let info = strategyInfo[type] || { name: "기타", color: "#999" };

  // 3. ✨ [핵심] 레어(20%) 당첨 시, 타입별로 다른 '전설의 이름' 부여!
  if (isRare) {
    // 레어 전용 이름 맵핑
    const rareTitles = {
      hot: "🔥 전설의 불꽃", // Hot 레어
      cold: "💎 심해의 보물", // Cold 레어
      overdue: "🌑 심연의 지배자", // Overdue 레어
      random: "👑 행운의 여신", // Random 레어
    };
    // 덮어쓰기
    info = {
      name: rareTitles[type], // 위에서 정한 전설의 이름
      color: "#222", // 뱃지 배경은 '레어' 느낌 나게 블랙(Dark) 유지
    };
  }

  // 새 데이터 만들기
  const newEntry = {
    id: Date.now(), // 고유 ID
    numbers: numbers,
    typeName: info.name,
    typeColor: info.color,
    isRare: isRare,
    date: new Date().toLocaleTimeString(), // 생성 시간
  };

  myHistory.unshift(newEntry);
  if (myHistory.length > 10) {
    myHistory = myHistory.slice(0, 10);
  }
  localStorage.setItem("my_lotto_history", JSON.stringify(myHistory));

  // 6. 화면 갱신
  renderMyHistory();
  toggleStatsView("history");
}

// 2. 기록 화면 그리기 (HTML 생성)
function renderMyHistory() {
  const listContainer = document.getElementById("myNumberList");
  const myHistory = JSON.parse(
    localStorage.getItem("my_lotto_history") || "[]",
  );

  if (myHistory.length === 0) {
    listContainer.innerHTML =
      "<p style='text-align:center; color:white;'>아직 생성된 기록이 없습니다.</p>";
    return;
  }

  listContainer.innerHTML = ""; // 초기화

  myHistory.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-row";

    // 레어 아이템 배경 처리
    if (item.isRare) {
      row.style.background = "linear-gradient(to right, #f3e5f5, #fff)";
      row.style.border = "1px solid #E040FB";
    } else {
      row.style.background = "rgba(255,255,255,0.9)";
    }

    // 공 HTML 생성
    let ballsHtml = "";
    item.numbers.forEach((num) => {
      const colorClass = getBallColorClass(num); // ui.js 함수 활용
      ballsHtml += `<div class="number-circle ${colorClass} history-ball">${num}</div>`;
    });

    row.innerHTML = `
            <div style="display:flex; align-items:center;">
                <input type="checkbox" class="history-checkbox" value="${item.id}">
                <span class="strategy-badge" style="background:${item.typeColor}">${item.typeName}</span>
            </div>
            <div class="balls-wrapper">
                ${ballsHtml}
            </div>
        `;
    listContainer.appendChild(row);
  });
}

// 3. 화면 전환 함수 (Stats <-> History)
function toggleStatsView(mode) {
  const defaultBox = document.getElementById("defaultStats");
  const historyBox = document.getElementById("myHistorySection");

  if (mode === "history") {
    defaultBox.style.display = "none";
    historyBox.style.display = "block"; // 혹은 flex
  } else {
    defaultBox.style.display = "block"; // 원래대로 복구
    historyBox.style.display = "none";
  }
}

// 선택 삭제 함수
function deleteSelectedItems() {
  // 1. 체크된 박스들을 모두 찾습니다.
  const checkboxes = document.querySelectorAll(".history-checkbox:checked");

  if (checkboxes.length === 0) {
    alert("삭제할 항목을 선택해주세요.");
    return;
  }

  if (!confirm(`선택한 ${checkboxes.length}개 기록을 삭제하시겠습니까?`)) {
    return; // 취소하면 중단
  }

  // 2. 삭제할 id 목록 만들기
  // (체크된 박스의 value 값을 가져와서 숫자로 변환)
  const idsToDelete = Array.from(checkboxes).map((cb) => Number(cb.value));

  // 3. 기존 기록 가져오기
  let myHistory = JSON.parse(localStorage.getItem("my_lotto_history") || "[]");

  // 4. [삭제 로직] 삭제 명단에 없는 애들만 남기기 (filter)
  myHistory = myHistory.filter((item) => !idsToDelete.includes(item.id));

  // 5. 저장 및 화면 갱신
  localStorage.setItem("my_lotto_history", JSON.stringify(myHistory));
  renderMyHistory(); // 리스트 다시 그리기
}
