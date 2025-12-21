// js/api.js - 앱의 실행 및 외부 통신 담당

// 1. 페이지 로드 시 초기화 (앱의 시작점)
window.onload = async function () {
  // 1-1. 데이터 로드 (로컬 스토리지 -> 실패 시 JSON 파일)
  const loadedFromStorage = loadDataFromStorage(); // data.js에 있는 함수 호출

  if (!loadedFromStorage) {
    console.log(
      "로컬 스토리지에 데이터가 없습니다. data/lotto.json에서 불러옵니다."
    );
    try {
      const response = await fetch("data/lotto.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data && data.history) {
        // data.js에 있는 lottoHistory 변수 사용
        lottoHistory = data.history.reverse();
        saveDataToStorage(); // data.js 함수
      } else {
        console.error("lotto.json 데이터 형식 오류");
      }
    } catch (error) {
      console.error("lotto.json 로드 실패:", error);
      alert("로또 데이터를 불러오는 데 실패했습니다.");
    }
  } else {
    console.log("로컬 스토리지 로드 성공");
  }

  // 1-2. 분석 및 화면 업데이트 (logic.js, ui.js 함수들 호출)
  analyzeHistoricalData();
  updateStatistics();
  generateFrequencyChart();
  performAdvancedAnalysis();
  updateAdvancedAnalysis();

  // 1-3. 최신 회차 API 호출
  const currentRound = calculateCurrentRound();
  fetchLatestLotto(currentRound);
};

// 2. 외부 API를 통해 당첨 번호 가져오기
async function fetchLatestLotto(round) {
  const drawRoundElement = document.getElementById("drawRound");
  try {
    const response = await fetch(`./get_lotto.php?drwNo=${round}`);
    const data = await response.json();

    if (data.returnValue === "success") {
      displayLatestDraw(data); // ui.js 함수 호출
    } else {
      // 아직 발표 전이면 이전 회차 재시도
      drawRoundElement.textContent = `🎯 제 ${round - 1}회 당첨 번호 (최신)`;
      fetchLatestLotto(round - 1);
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    drawRoundElement.textContent = "⚠️ 당첨 정보를 불러올 수 없습니다.";
  }
}

// 3. 현재 로또 회차 계산 함수
function calculateCurrentRound() {
  const firstDrawDate = new Date("2002-12-07T21:00:00");
  const today = new Date();
  const diffTime = today - firstDrawDate;
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + 1;
}

// 4. 새로운 당첨번호 추가 (사용자 입력)
function addNewNumbers() {
  const input = document.getElementById("newNumbers");
  const numbersText = input.value.trim();

  if (!numbersText) {
    alert("번호를 입력해주세요!");
    return;
  }

  const numbers = numbersText.split(",").map((num) => parseInt(num.trim()));

  // 유효성 검사
  if (numbers.length !== 6) {
    alert("6개의 번호를 입력해주세요!");
    return;
  }
  if (numbers.some((num) => isNaN(num) || num < 1 || num > 45)) {
    alert("1-45 사이의 유효한 번호를 입력해주세요!");
    return;
  }
  if (new Set(numbers).size !== 6) {
    alert("중복된 번호가 있습니다!");
    return;
  }

  // 데이터 추가 (data.js의 변수 수정)
  lottoHistory.unshift(numbers);
  lottoHistory = lottoHistory.slice(0, 99999);
  saveDataToStorage();
  input.value = "";

  // 화면 업데이트 (logic.js, ui.js 함수 호출)
  analyzeHistoricalData();
  updateStatistics();
  generateFrequencyChart();
  performAdvancedAnalysis();
  updateAdvancedAnalysis();

  alert("새로운 당첨번호가 추가되었습니다!");
}

// 5. 파일에서 데이터 불러오기 (파일 입력)
function loadDataFromFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

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

          alert("데이터를 성공적으로 불러왔습니다!");
        } catch (error) {
          alert("파일 형식이 올바르지 않습니다!");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
