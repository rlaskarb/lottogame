// js/ui.js - 화면 렌더링 및 UI 인터랙션 담당

// 1. 상단 통계 정보 업데이트
function updateStatistics() {
  // data.js에 있는 변수들 사용
  document.getElementById("totalDraws").textContent = lottoHistory.length;

  if (Object.keys(numberFrequency).length > 0) {
    const frequencies = Object.entries(numberFrequency);
    const mostFrequent = frequencies.reduce((a, b) => (a[1] > b[1] ? a : b));
    const leastFrequent = frequencies.reduce((a, b) => (a[1] < b[1] ? a : b));

    document.getElementById("mostFrequent").textContent = mostFrequent[0];
    document.getElementById("leastFrequent").textContent = leastFrequent[0];
  }
}

// 2. [공통] 번호 색상 클래스 반환 헬퍼
function getBallColorClass(num) {
  if (num >= 1 && num <= 10) return "ball-10";
  if (num >= 11 && num <= 20) return "ball-20";
  if (num >= 21 && num <= 30) return "ball-30";
  if (num >= 31 && num <= 40) return "ball-40";
  if (num >= 41) return "ball-50";
  return "ball-default";
}

// 3. [공통] 로또 공 HTML 요소 생성
function createBallElement(num, frequencyText = "") {
  const ballColorClass = getBallColorClass(num);
  const item = document.createElement("div");
  item.className = "frequency-item";

  const textHtml = frequencyText
    ? `<div class="frequency-text">${frequencyText}</div>`
    : "";

  item.innerHTML = `
        <div class="number-circle ${ballColorClass}">${num}</div>
        ${textHtml}
    `;
  return item;
}

// 4. 빈도 차트 그리기
function generateFrequencyChart() {
  const chartContainer = document.getElementById("frequencyChart");
  chartContainer.innerHTML = "";
  chartContainer.classList.add("simple-grid");

  for (let i = 1; i <= 45; i++) {
    const frequency = numberFrequency[i] || 0;
    const ball = createBallElement(i, `${frequency}회`);
    chartContainer.appendChild(ball);
  }
}

// 5. 고급 분석 결과 표시 (핫/콜드/오버듀)
function updateAdvancedAnalysis() {
  const containers = ["hotNumbers", "coldNumbers", "overdueNumbers"];

  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // 초기화

    // data.js의 advancedStats 데이터 사용
    const statsData = advancedStats[containerId];

    if (!statsData || statsData.length === 0) {
      container.innerHTML = '<span class="no-data">데이터 부족</span>';
      return;
    }

    statsData.forEach((num) => {
      const tag = document.createElement("span");
      const colorClass = getBallColorClass(num); // 공통 함수 활용

      tag.className = `number-tag ${colorClass}`;
      tag.textContent = num;
      container.appendChild(tag);
    });
  });
}

// 6. 메인 번호 표시 (애니메이션 포함)
function displayNumbers(numbers) {
  const balls = document.querySelectorAll(".lotto-ball");
  balls.forEach((ball, index) => {
    ball.textContent = numbers[index] || "?";
    ball.style.animation = "none";

    // 애니메이션 리플레이
    setTimeout(() => {
      ball.style.animation = "bounce 0.6s ease-in-out";
    }, index * 100);
  });
}

// 7. 최신 당첨 번호 그리기 (API 결과)
function displayLatestDraw(data) {
  document.getElementById(
    "drawRound"
  ).textContent = `🎯 제 ${data.drwNo}회 당첨 번호`;

  const container = document.getElementById("latestNumbers");
  container.innerHTML = "";

  // 당첨 번호 6개
  for (let i = 1; i <= 6; i++) {
    const num = data[`drwtNo${i}`];
    const ball = createBallElement(num);
    container.appendChild(ball);
  }

  // 보너스 번호
  const bonusWrapper = document.createElement("div");
  bonusWrapper.className = "bonus-wrapper";
  bonusWrapper.innerHTML = '<span style="margin: 0 7px;">+</span>';

  const bonusBall = createBallElement(data.bnusNo);
  bonusWrapper.appendChild(bonusBall);
  container.appendChild(bonusWrapper);
}

// 8. 모달 및 알림 관련 함수
function showResultModal(message) {
  const modal = document.getElementById("strategyModal");
  document.getElementById("modalMessage").innerHTML = message;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("strategyModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// 2. ✨ 키보드 엔터(Enter) 감지 코드 추가 ✨
document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("strategyModal");

  // 모달이 현재 화면에 보여지고 있을 때만 작동! (중요)
  // (style.display가 'none'이 아니고, 모달이 존재할 때)
  if (modal && modal.style.display !== "none") {
    // 눌린 키가 'Enter' 라면?
    if (event.key === "Enter") {
      closeModal(); // 닫기 함수 실행
    }

    // (보너스 팁) 보통 모달은 'ESC' 키로도 많이 닫습니다. 이것도 넣어두면 편해요!
    if (event.key === "Escape") {
      closeModal();
    }
  }
});

function showStrategyInfo(strategy) {
  const strategyNames = {
    hotNumbers: "🔥 핫 번호 전략",
    coldNumbers: "❄️ 콜드 번호 전략",
    overdueNumbers: "⏰ 오버듀 번호 전략",
  };
  setTimeout(() => {
    alert(
      `사용된 전략: ${strategyNames[strategy]}\n\n이 전략은 과거 데이터 분석을 바탕으로 선택되었습니다.`
    );
  }, 1000);
}

/* ==========================================
   🚫 [보안] 무한 새로고침 방지 (Anti-F5 Spam)
   - 3초 안에 5번 이상 새로고침하면 경고창 띄움
   ========================================== */
(function () {
  // 마지막 접속 시간과 횟수를 저장할 변수
  const LIMIT_TIME = 3000; // 3초 (감시 시간)
  const MAX_REFRESH = 5; // 5번 허용 (제한 횟수)

  // 로컬 스토리지에서 기록 가져오기
  let accessHistory = JSON.parse(
    localStorage.getItem("access_history") || "[]"
  );
  const now = Date.now();

  // 1. 3초가 지난 기록은 삭제 (청소)
  accessHistory = accessHistory.filter((time) => now - time < LIMIT_TIME);

  // 2. 현재 접속 시간 추가
  accessHistory.push(now);

  // 3. 기록 저장
  localStorage.setItem("access_history", JSON.stringify(accessHistory));

  // 4. 횟수 체크: 3초 안에 5번 이상 들어왔다면?
  if (accessHistory.length > MAX_REFRESH) {
    alert(
      "⚠️ 접속 요청이 너무 빠릅니다.\n서버 보호를 위해 잠시 후 다시 시도해주세요."
    );

    // (선택) 아예 화면을 하얗게 만들어버려서 버튼 못 누르게 하기
    document.body.innerHTML =
      '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;"><h1>🚫 접속 제한</h1><p>새로고침이 너무 빠릅니다. 10초 뒤에 다시 접속해주세요.</p></div>';

    // 10초 뒤에 자동으로 새로고침 (풀어주기)
    setTimeout(() => {
      localStorage.removeItem("access_history"); // 기록 초기화
      location.reload();
    }, 10000);
  }
})();
