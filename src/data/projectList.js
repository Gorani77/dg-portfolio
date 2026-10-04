import solveScreen from '../assets/education-solve.png'
import reviewScreen from '../assets/education-review.png'
import teacherScreen from '../assets/education-X7.png'
import interviewScreen from '../assets/interview-session.png'
import reportScreen from '../assets/interview-report.png'

export const projectList = [
  {
    id: 'education', period: '2026.07 - 08', team: '4인 팀 프로젝트',
    title: '중학교 AI 문제 생성 및 학습관리 플랫폼',
    description: '교사의 수학 문제 생성과 학생의 문제 풀이를 돕는 AI 학습관리 서비스입니다.',
    role: 'RAG 기반 학습 챗봇 가드레일 설계·구현 / 인증·인가',
    tags: ['Spring Boot', 'Spring AI', 'PostgreSQL', 'pgvector', 'RAG'],
    detailUrl: '#projects/education',
    slides: [
      { image: solveScreen, label: '학생 문제 풀이' },
      { image: reviewScreen, label: '학생 해설' },
      { image: teacherScreen, label: '교사 문제 생성 결과' },
    ],
  },
  {
    id: 'interview', period: '2026.06 - 07', team: '4인 팀 프로젝트',
    title: '수강생을 위한 AI 모의면접 서비스',
    description: '답변에 따라 후속 질문을 이어가고, 면접이 끝나면 평가 리포트를 제공하는 서비스입니다.',
    role: 'AI 인터뷰어 에이전트 / LangGraph 면접 흐름 설계·구현',
    tags: ['Python', 'LangGraph', 'LangChain', 'FastAPI', 'Pydantic'],
    detailUrl: '#projects/interview',
    slides: [
      { image: interviewScreen, label: 'AI 모의면접 진행 화면' },
      { image: reportScreen, label: '면접 평가 리포트 화면' },
    ],
  },
]
