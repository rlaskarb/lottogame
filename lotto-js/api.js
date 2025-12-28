// js/api.js - 앱의 실행 및 외부 통신 담당

// 1. 페이지 로드 시 초기화 (앱의 시작점)
window.onload = async function () {
  console.log("앱 시작: 데이터 로드 중...");

  // ▼ [핵심 변경] 로컬 스토리지 확인 안 하고, 무조건 JSON 파일 불러옵니다.
  // 캐시 문제 방지를 위해 뒤에 시간(?v=...)을 붙여서 항상 새 파일을 가져오게 합니다.
  try {
    const response = await fetch(
      "lotto-data/lotto.json?v=" + new Date().getTime()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.history) {
      // data.js에 있는 전역 변수 lottoHistory에 데이터 채우기
      lottoHistory = data.history;

      console.log("JSON 데이터 로드 성공!");

      // 2. 분석 및 화면 업데이트 (데이터가 준비됐으니 화면 그리기)
      analyzeHistoricalData(); // 통계 분석 (logic.js)
      updateStatistics(); // 통계 UI 표시 (ui.js)
      generateFrequencyChart(); // 차트 그리기 (ui.js)
      performAdvancedAnalysis(); // 고급 분석 (logic.js)
      updateAdvancedAnalysis(); // 고급 분석 UI (ui.js)
      renderHistoryList();

      // 3. 최신 회차 API 호출 (이번 주 당첨 확인용)
      const currentRound = calculateCurrentRound();
      fetchLatestLotto(currentRound);
    } else {
      console.error("lotto.json 데이터 형식이 잘못되었습니다.");
      alert("데이터 형식이 올바르지 않습니다.");
    }
  } catch (error) {
    console.error("lotto.json 로드 실패:", error);
    alert(
      "로또 데이터를 불러오는 데 실패했습니다. 인터넷 연결을 확인해주세요."
    );
  }
};

// 2. 외부 API를 통해 최신 당첨 번호 가져오기 (동행복권/API)
async function fetchLatestLotto(round) {
  const drawRoundElement = document.getElementById("drawRound");

  // 혹시 모를 UI 에러 방지
  if (!drawRoundElement) return;

  try {
    const response = await fetch(`lotto-data/get_lotto.php?drwNo=${round}`);
    const data = await response.json();

    if (data.returnValue === "success") {
      displayLatestDraw(data); // ui.js 함수 호출
    } else {
      // 아직 토요일 추첨 전이라 데이터가 없으면 -> 1주 전 회차를 보여줌
      console.log(`${round}회차 정보 없음. 이전 회차 로드 시도.`);
      // 재귀 호출로 전 회차 검색
      fetchLatestLotto(round - 1);
    }
  } catch (error) {
    console.error("최신 회차 조회 실패:", error);
    drawRoundElement.textContent = "⚠️ 당첨 정보를 불러올 수 없습니다.";
  }
}

// 3. 현재 로또 회차 계산 함수 (자동 계산)
function calculateCurrentRound() {
  const firstDrawDate = new Date("2002-12-07T21:00:00");
  const today = new Date();
  const diffTime = today - firstDrawDate;
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + 1;
}
