// js/api.js - 앱의 실행 및 데이터 로드 담당 (심플 버전)

// 1. 페이지 로드 시 초기화 (앱의 시작점)
window.onload = async function () {
  console.log("앱 시작: 로컬 데이터 로드 중...");

  try {
    // 1. 내 서버에 있는 lotto.json 파일 가져오기
    // (?v=... 는 브라우저가 옛날 파일 기억하지 못하게 하는 캐시 방지용)
    const response = await fetch(
      "lotto-data/lotto.json?v=" + new Date().getTime()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.history) {
      // 2. 데이터 전역 변수에 담기
      lottoHistory = data.history;
      console.log(
        "✅ JSON 데이터 로드 성공! (총 " + lottoHistory.length + "회)"
      );

      // 3. 통계 분석 및 UI 그리기 (기존 로직 수행)
      analyzeHistoricalData(); // 통계 분석
      updateStatistics(); // 통계 UI 업데이트
      generateFrequencyChart(); // 빈도 차트
      performAdvancedAnalysis(); // 고급 분석 (Hot/Cold)
      updateAdvancedAnalysis(); // 고급 분석 UI
      renderHistoryList(); // 하단 리스트 그리기

      // ▼▼▼ [핵심 변경] 외부 API 안 부르고, 내 파일의 맨 첫 번째 걸 씁니다! ▼▼▼
      loadLatestFromLocal();
    } else {
      console.error("lotto.json 데이터 형식이 잘못되었습니다.");
      alert("데이터 형식이 올바르지 않습니다.");
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    alert("데이터를 불러오는 데 실패했습니다.");
  }
};

// [신규 함수] 로컬 데이터(lotto.json)에서 최신 회차 꺼내서 보여주기
function loadLatestFromLocal() {
  // lottoHistory는 최신순으로 정렬되어 있다고 가정 (맨 위가 최신)
  // 데이터 구조: [회차, 번호1, 번호2, 번호3, 번호4, 번호5, 번호6, 보너스]

  if (!lottoHistory || lottoHistory.length === 0) {
    document.getElementById("drawRound").textContent = "데이터 없음";
    return;
  }

  // 1. 맨 첫 번째 데이터(최신) 가져오기
  const latestData = lottoHistory[0];

  // 2. ✨ [자동 계산] 전체 개수가 곧 최신 회차 번호입니다!
  const currentRound = lottoHistory.length;

  // 3. 데이터 포맷 맞추기
  // 주의: JSON에 회차 번호가 없으므로, 인덱스가 0부터 시작합니다!
  const formattedData = {
    drwNo: currentRound, // 계산된 회차 번호
    drwtNo1: latestData[0], // 첫 번째 숫자 (인덱스 0)
    drwtNo2: latestData[1],
    drwtNo3: latestData[2],
    drwtNo4: latestData[3],
    drwtNo5: latestData[4],
    drwtNo6: latestData[5],
    bnusNo: latestData[6], // 보너스 숫자 (인덱스 6)
  };

  console.log(`📱 로컬 데이터 로드 완료: ${currentRound}회차`);

  // 3. 화면에 그리기 (ui.js 함수 호출)
  displayLatestDraw(formattedData);
}
