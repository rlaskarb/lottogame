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

## 🛠 기술 스택 (Tech Stack)

**Front-end**
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

**Data & Optimization**
<img src="https://img.shields.io/badge/json-000000?style=for-the-badge&logo=json&logoColor=white"> <img src="https://img.shields.io/badge/pwa-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">

**Deployment & Tools**
<img src="https://img.shields.io/badge/cafe24-000000?style=for-the-badge&logo=linux&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">


<br>

## ⚙️ 핵심 구현 기능

**1️⃣ 데이터 구조 최적화 (JSON Static Data)**
- 초기 외부 API 사용 시 발생하던 **CORS 이슈와 느린 응답 속도**를 해결하기 위해 데이터 구조를 변경했습니다.
- 전체 로또 데이터를 **정적 JSON 파일로 변환하여 로컬에서 관리**함으로써, 네트워크 대기 시간을 제거하고 즉각적인 렌더링 속도를 확보했습니다.

**2️⃣ 순수 JavaScript 기반 SPA 구현**
- React 등 라이브러리 없이 **Vanilla JS**만으로 상태 관리(State Management)와 라우팅을 구현했습니다.
- `document.createElement` 등 DOM API를 직접 활용하여 동적 UI를 렌더링하며 브라우저 동작 원리를 깊이 이해했습니다.

**3️⃣ 웹 성능 최적화 및 운영 (SEO & Deployment)**
- **SEO 적용:** `sitemap.xml`, `robots.txt`, Open Graph 태그를 적용하여 구글/네이버 검색 노출을 최적화했습니다.
- **SSL 보안 적용:** 실제 도메인(`barolotto.com`)에 HTTPS 인증서를 적용하여 보안성을 강화했습니다.

  
<br>



[🔝 맨 위로 가기](#top)

<br>







