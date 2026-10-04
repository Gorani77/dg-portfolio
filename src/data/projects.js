export const projects = [
  { id: 'interview', number: '01', kind: 'AI AGENT', title: '대화의 다음을 설계하는 AI 면접관', description: '답변 평가에 따라 후속 질문을 선택하고, 상태를 유지하며 면접을 이어가는 에이전트.', tags: ['Python', 'LangGraph', 'FastAPI'], period: '2026.06 — 07', role: '4인 팀 · AI 인터뷰어 에이전트 및 그래프 흐름 구현', problem: '사용자 입력으로 그래프를 재개할 때 질문 생성 로직이 중복 실행됐습니다.', solution: '질문 생성·발화와 입력 대기를 별도 노드로 분리해, 재개 시 입력 대기 노드만 다시 실행되도록 구성했습니다.', url: 'https://github.com/orgs/cen-interview/repositories' },
  { id: 'education', number: '02', kind: 'RAG & GUARDRAIL', title: '학습을 돕되, 정답은 지키는 AI', description: '학습 단계에 맞는 정책을 검색하고, 서버에서 판정 근거를 검사하는 학습 챗봇 가드레일.', tags: ['Spring AI', 'pgvector', 'Spring Boot'], period: '2026.07 — 08', role: '4인 팀 · RAG 기반 입력 가드레일 설계 및 구현', problem: '유사도 검색에 다른 학습 단계의 정책이 섞여 판정 근거가 충돌했습니다.', solution: '서버가 지정한 학습 단계로 검색 후보를 제한하고, 반환된 정책 ID와 허용·차단 속성을 서버에서 검사했습니다.', url: 'https://github.com/orgs/cen-edu/repositories' },
]

export const profileProjects = [
  { year: '2026', title: '중학교 AI 문제 생성 및 학습 관리 플랫폼', url: 'https://github.com/orgs/cen-edu/repositories', detailUrl: '#projects/education' },
  { year: '2026', title: '수강생을 위한 AI 모의면접 서비스', url: 'https://github.com/orgs/cen-interview/repositories', detailUrl: '#projects/interview' },
  { year: '2026', title: '회원을 위한 중고거래 사이트', url: 'https://github.com/orgs/ceni-market/repositories' },
  { year: '2025', title: 'AI 시대 정보 획득과 취업 지원 사이트', url: 'https://github.com/orgs/team-kosa-skynet/repositories' },
  { year: '2025', title: 'KOSA 수강생을 위한 커뮤니티', url: 'https://github.com/orgs/team-kokkiri/repositories' },
]
