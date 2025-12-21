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

// 5. 고급 분석 결과 표시 (핫/콜드/오버듀) - ★ 수정된 최종 버전 적용됨
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
  document.getElementById("modalMessage").textContent = message;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("strategyModal").style.display = "none";
}

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
