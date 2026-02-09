# The Art of Light - 구현 계획

## 아키텍처: 하이브리드 (Loading Overlay + Multi-Page Routing)

### 라우트 구조
- `/` → Loading overlay → 자동 전환 → `/exhibition`
- `/exhibition` → The Art of Light (메인 전시 인트로)
- `/gallery` → Index (사진 갤러리)
- `/master` → Master JDZ (작가 프로필)
- `/countdown` → Counting Page (카운트다운)
- 공통 Layout: 상단 네비게이션 + 사이드 내비 + 하단 바

### 라이브러리
- **GSAP + ScrollTrigger**: 스크롤 기반 애니메이션, 가로 스크롤, unveil 효과
- **Framer Motion**: 페이지 전환, spring 물리, stagger, 컴포넌트 애니메이션

---

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx              # 공통 레이아웃 (nav, side nav, footer, page transition)
│   ├── page.tsx                # Loading page (overlay → /exhibition 전환)
│   ├── exhibition/page.tsx     # The Art of Light
│   ├── gallery/page.tsx        # Index (사진 갤러리)
│   ├── master/page.tsx         # Master JDZ 프로필
│   ├── countdown/page.tsx      # 카운트다운
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx      # 상단 네비 바
│   │   ├── SideNav.tsx         # 사이드 내비 (INDEX, Master JDZ)
│   │   └── BottomBar.tsx       # 하단 시간 + 저작권
│   ├── animations/
│   │   ├── TypeWriter.tsx      # 타이핑 효과
│   │   ├── FadeIn.tsx          # 페이드인 래퍼
│   │   ├── PageTransition.tsx  # 페이지 전환 효과
│   │   └── ScrollReveal.tsx    # 스크롤 트리거 reveal
│   ├── gallery/
│   │   ├── PhotoGrid.tsx       # 순차 등장 사진 그리드
│   │   ├── HorizontalScroll.tsx# 가로 스크롤 갤러리
│   │   └── PhotoViewer.tsx     # 사진 확대 뷰 (여백 클릭 → 닫기)
│   └── countdown/
│       └── CountdownTimer.tsx  # 실시간 카운트다운
├── hooks/
│   ├── useTypewriter.ts        # 타이핑 효과 훅
│   ├── useCountdown.ts         # 카운트다운 훅
│   └── useKoreanTime.ts        # KRT 시간 표시 훅
└── lib/
    └── constants.ts            # 설정값, 날짜, 사진 데이터
```

---

## 구현 단계

### Phase 1: 기반 세팅
- [ ] GSAP, @gsap/react, framer-motion 설치
- [ ] 공통 레이아웃 구현 (Navigation, SideNav, BottomBar)
- [ ] 라우트 구조 생성 (각 페이지 빈 껍데기)
- [ ] 페이지 전환 애니메이션 (Framer Motion AnimatePresence)
- [ ] 공통 상수/타입 정의 (constants.ts)

### Phase 2: Loading Page (`/`)
- [ ] 빛 채워지는 효과 (SVG sparkle + CSS keyframes, 점진적 확대)
- [ ] "THE ART OF LIGHT" 타이핑 효과 (useTypewriter 훅)
- [ ] "XIAOMI KOREA X JDZ CHUNG" 페이드인
- [ ] 완료 후 /exhibition으로 자동 전환

### Phase 3: The Art of Light (`/exhibition`)
- [ ] unveil.fr 스타일 사진 reveal (GSAP ScrollTrigger + blur→sharp 필터)
- [ ] 사진 가로 스크롤 갤러리 (ScrollTrigger horizontal pinning)
- [ ] 여백 클릭 → 이전 화면 복귀 인터랙션

### Phase 4: Index (`/gallery`)
- [ ] 사진 그리드 순차 등장 (Framer Motion stagger + spring, y:100→0)
- [ ] 사진 클릭 → 가로 스크롤 뷰 진입
- [ ] 여백 클릭 → 그리드로 복귀
- [ ] "WHAT DO YOU THINK IT WAS SHOT ON?" 타이핑 효과
- [ ] "WAIT FOR THE FINAL REVEAL" 타이핑 효과
- [ ] "BACK TO TOP" 버튼 (호버 시 흰색 배경)

### Phase 5: Master JDZ (`/master`)
- [ ] ABOUT (01) 섹션 - 작가 소개 텍스트
- [ ] PHILOSOPHY (02) 섹션 - 작가 철학 텍스트
- [ ] 스크롤 트리거 텍스트 등장 애니메이션

### Phase 6: Counting Page (`/countdown`)
- [ ] 2026.03.06 기준 실시간 카운트다운 타이머
- [ ] "THE FINAL REVEAL" 타이핑 효과
- [ ] 하단 네비게이션 (각 섹션 링크)

### Phase 7: 마무리
- [ ] 페이지 간 전환 효과 통합 테스트
- [ ] 애니메이션 성능 최적화 (will-change, GPU 가속)
- [ ] 빌드 확인
