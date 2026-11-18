export interface TeamProjectEvent {
  date: string;
  title: string;
  description: string;
  isOptional?: boolean;
}

export interface FigmaGuideChapter {
  title: string;
  topics: string[];
}

export const TEAM_PROJECT_SCHEDULE: TeamProjectEvent[] = [
  {
    date: "2026년 9월 19일(토)",
    title: "5기 온보딩",
    description: "젝트 활동 전반 소개 및 프로젝트 시작",
  },
  {
    date: "2026년 10월 10일(토)",
    title: "젝트 세미나",
    description: "실무 관점의 인사이트 강연 및 Q&A",
  },
  {
    date: "2026년 10월 24일(토)",
    title: "기획 발표 세션",
    description: "각 팀 서비스 기획 내용 발표 및 Q&A",
  },
  {
    date: "2026년 11월 14일(토)",
    title: "젝커톤",
    description: "젝트 주관 공식 해커톤",
    isOptional: true,
  },
  {
    date: "2026년 11월 28일(토)",
    title: "젝-트게더",
    description: "타 팀과의 네트워킹 및 리프레시",
  },
  {
    date: "2026년 12월 19일(토)",
    title: "젝러닝",
    description: "사용자 테스트 진행 및 개선 작업",
  },
  {
    date: "2026년 12월 20일(일) - 2027년 1월 8일(금)",
    title: "고도화 및 운영 기간",
    description: "기능 개선 및 운영 성과 축적",
  },
  {
    date: "2027년 1월 9일(토)",
    title: "5기 데모데이",
    description: "최종 결과 발표 및 성과 공유",
  },
];

export const FIGMA_GUIDE_CURRICULUM: FigmaGuideChapter[] = [
  {
    title: "작업 환경 설정",
    topics: ["계정과 플랜 구분하기", "작업 환경 설정하기"],
  },
  {
    title: "디자인 제작 기초",
    topics: [
      "캔버스와 레이어 탐색하기",
      "도형, 텍스트, 이미지 다루기",
      "그룹, 프레임, 섹션 구분하기",
      "Auto layout 이해하기",
    ],
  },
  {
    title: "구성요소와 프로토타이핑",
    topics: [
      "Component와 Instance 이해하기",
      "Property와 Variant 이해하기",
      "Style과 Variable 관리하기",
      "Prototyping으로 상태와 화면 전이 만들기",
    ],
  },
  {
    title: "디자인 협업",
    topics: [
      "파일과 페이지 구조 설계하기",
      "레이어 구조 설계하기",
      "용어와 네이밍 컨벤션 합의하기",
      "라이브러리 관리 및 SSOT 운영하기",
      "코멘트, 버전, 히스토리 관리하기",
    ],
  },
  {
    title: "개발 핸드오프",
    topics: [
      "핸드오프 패키지 구성하기",
      "Foundation과 Component 문서화하기",
      "피드백 분류와 로그 남기기",
    ],
  },
];
