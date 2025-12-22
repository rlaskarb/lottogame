# 스마트 로또 생성기 (Data-driven Web App)

과거 당첨 데이터 통계 분석과 실시간 API 연동을 결합한 지능형 번호 추천 서비스입니다. 단순한 랜덤 추출을 넘어,<br>
사용자에게 논리적 근거가 있는 4가지 생성 전략을 제공하며 실무적인 웹 서비스 운영 프로세스(SEO, PWA)를 직접 구현하였습니다.

## 🧩 [로또 1등 당첨되러 바로가기 ](https://rlaskarb20.mycafe24.com/lotto/) 🧩

<img width="2560" height="1673" alt="image" src="https://github.com/user-attachments/assets/b68fe6ce-375f-45ea-a630-95b68a81af42" />



## 📌 프로젝트 소개

- 데이터 기반 분석: 동행복권 API를 통해 실시간 당첨 데이터를 확보하고, 누적 통계를 바탕으로 핫/콜드 번호를 추출합니다.

- 사용자 중심 경험: 통계 용어가 생소한 사용자를 위해 친절한 설명이 담긴 커스텀 모달과 인터랙티브한 공 애니메이션을 제공합니다.

- 실전 배포 환경: PWA 적용으로 앱과 같은 사용 환경을 구축하고, 구글 서치 콘솔 등록을 통해 검색 노출 최적화를 완료했습니다.

<br>


## ⚙️ 직접 구현한 핵심 기능

### ✨ 데이터 기반 번호 생성 전략 (2+4 조합 로직)
사용자에게 신뢰와 운의 균형을 제공하기 위해 각 전략마다 '핵심 번호 2개 + 랜덤 번호 4개' 조합 알고리즘을 설계했습니다.

#### • 많이 나온 번호: 누적 출현 빈도가 높은 상위 15개 번호 중 2개를 엄선하여 포함합니다.

#### • 적게 나온 번호: 상대적으로 당첨 횟수가 적어 반등 가능성이 있는 번호 중 2개를 포함합니다.

#### • 안 나온 번호: 최근 10회차 기록 중 한 번도 출현하지 않은 '미출현 번호' 중 2개를 전략적으로 배치합니다.

<br>

### ✨ PHP Proxy를 통한 CORS 보안 이슈 해결
브라우저에서 외부 API를 직접 호출할 때 발생하는 CORS(Cross-Origin Resource Sharing) 제한을 해결하기 위해 PHP 프록시 서버를 직접 구축했습니다.

서버 사이드에서 데이터를 중계하는 방식을 통해 클라이언트 보안 정책에 구애받지 않고 실시간 당첨 데이터를 안정적으로 동기화하는 통신 흐름을 구현했습니다.

<br>

### ✨ 검색 엔진 최적화(SEO) 및 운영

구글 서치 콘솔 등록: Sitemap.xml 및 robots.txt 최적화를 통해 구글 로봇의 크롤링 효율을 높여 실제 검색 결과 노출에 성공했습니다.

PWA(Progressive Web App): 모바일 브라우저에서 '홈 화면에 추가' 기능을 통해 별도의 앱 설치 없이도 앱과 동일한 UX를 제공하도록 설정했습니다.

<br>

### ✨ 인터랙티브 UI 및 UX 강화

순차적 애니메이션: CSS Keyframes를 활용하여 6개의 공이 차례대로 등장하는 효과를 부여해 번호 확인의 몰입감을 높였습니다.

커스텀 모달 시스템: 전략별 버튼 클릭 시 각 조합의 의미를 설명해 주는 모달창을 띄워 사용자의 이해를 돕습니다.

<br>

## 🛠 기술 스택

### Front-end 
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Back-end
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white) (CORS 해결용 Proxy Server)

### Optimization
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Google Search Console](https://img.shields.io/badge/Google%20Search%20Console-4285F4?style=for-the-badge&logo=google-search-console&logoColor=white)
![Sitemap](https://img.shields.io/badge/Sitemap-FFB100?style=for-the-badge&logo=xml&logoColor=white)

<br>

[🔝 맨 위로 가기](#top)

<br>







