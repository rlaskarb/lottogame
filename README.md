# 로또 데이터 분석(Lotto Data Analysis)

**과거 당첨 데이터 통계 분석과 실시간 API를 결합한 지능형 번호 추천 서비스**


##  [👉 서비스 바로가기 ](https://barolotto.com) 

<img width="2560" height="2565" alt="image" src="https://github.com/user-attachments/assets/f9803ce2-9621-401a-bb6c-b12ea52a7293" />





## 📌 프로젝트 소개

- 단순한 랜덤 추출이 아닌, **데이터 기반의 논리적 근거**를 가진 번호 생성 서비스입니다.
  
- 동행복권 API를 통해 실시간으로 데이터를 동기화하며, 사용자 친화적인 UI/UX와 PWA를 도입하여 앱 수준의 사용성을 제공합니다.

<br>


**[핵심 가치]**
- **Data-Driven:** 누적된 통계 데이터를 분석하여 확률 높은 번호를 제안합니다.
- **User Experience:** 복잡한 통계를 직관적인 애니메이션과 모달로 시각화했습니다.
- **Optimization:** SEO 최적화 및 PWA 적용으로 접근성과 성능을 확보했습니다.


<br>

## 🛠️ 기술 스택 (Tech Stack)

### Front-end
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Back-end & Infrastructure
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Cafe24](https://img.shields.io/badge/Cafe24-004097?style=for-the-badge&logo=cafe24&logoColor=white)

### Optimization & Tools
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Google Search Console](https://img.shields.io/badge/Google_Search_Console-4285F4?style=for-the-badge&logo=google-search-console&logoColor=white)
![Sitemap](https://img.shields.io/badge/Sitemap.xml-FFB100?style=for-the-badge&logo=rss&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)


<br>

## ⚙️ 핵심 구현 기능

### 1️⃣ 데이터 기반 하이브리드 생성 알고리즘 (2+4 Logic)
사용자에게 신뢰(통계)와 운(랜덤)의 균형을 제공하기 위해 독자적인 **'핵심 2 + 랜덤 4'** 조합 로직을 설계했습니다.
- **🔥 많이 나온 번호:** 누적 출현 빈도 상위 15개 중 2개 추출
- **❄️ 적게 나온 번호:** 출현 빈도가 낮아 반등 가능성이 있는 번호 중 2개 추출
- **⏰ 안 나온 번호:** 최근 10회차 미출현 번호(장기 미출수) 중 2개 추출

### 2️⃣ PHP Proxy를 통한 CORS 이슈 해결
Client-Side에서 외부 API 직접 호출 시 발생하는 **CORS(Cross-Origin Resource Sharing) 보안 정책 제한**을 해결했습니다.
- **문제:** 브라우저 보안 정책으로 인한 API 데이터 수신 불가
- **해결:** 자체 **PHP Proxy Server**를 구축하여 Server-Side에서 데이터를 중계하는 방식으로 우회
- **성과:** 클라이언트 환경에 구애받지 않는 안정적인 실시간 데이터 동기화 구현

### 3️⃣ 웹 성능 최적화 및 운영 (SEO & PWA)
- **검색 엔진 최적화 (SEO):** Sitemap.xml, robots.txt, Open Graph 태그 최적화로 구글/네이버 검색 상위 노출 달성
- **PWA (Progressive Web App):** `manifest.json` 및 서비스 워커 설정을 통해 모바일 홈 화면 설치 기능 및 네이티브 앱 수준의 UX 제공

### 4️⃣ 인터랙티브 UI/UX
- **순차적 애니메이션:** CSS Keyframes를 활용, 6개의 공이 리듬감 있게 등장하여 추첨의 몰입감 증대
- **반응형 모달 시스템:** 각 전략 버튼 클릭 시 생성 로직을 설명하는 커스텀 모달 제공으로 정보 접근성 강화

  
<br>



[🔝 맨 위로 가기](#top)

<br>







