// js/data.js - 데이터 상태 관리 및 저장소 담당

// 1. 핵심 데이터 변수 선언 (전역 변수)
let lottoHistory = []; // 전체 로또 당첨 기록
let numberFrequency = {}; // 번호별 당첨 횟수 저장
let analysisComplete = false; // 분석 완료 여부 확인용 플래그

// 2. 고급 통계 분석 데이터 구조
let advancedStats = {
  hotNumbers: [], // 자주 나온 번호
  coldNumbers: [], // 적게 나온 번호
  overdueNumbers: [], // 오랫동안 안 나온 번호
  // 필요하다면 나중에 sumDistribution, patternAnalysis 등을 여기에 추가
};

// 3. 로컬 스토리지에서 데이터 불러오기
function loadDataFromStorage() {
  const savedData = localStorage.getItem("lottoHistory");
  if (savedData) {
    lottoHistory = JSON.parse(savedData);
    return true; // 로드 성공
  }
  return false; // 로드할 데이터 없음
}

// 4. 로컬 스토리지에 데이터 저장하기
function saveDataToStorage() {
  localStorage.setItem("lottoHistory", JSON.stringify(lottoHistory));
}
