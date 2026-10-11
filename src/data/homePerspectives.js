import { truckworks } from './truckworks.js'

export const homePerspectives = [
  {
    id: 'space', number: '01', label: '3D 생산라인',
    title: '차체 생산 과정을\n3D로 구현했습니다.',
    description: '소재 투입부터 검사·적재까지 다섯 공정을 배치했습니다. 차체가 공정 사이를 이동하고, 설비가 멈추면 앞에 부품이 쌓이는 모습을 볼 수 있습니다.',
    image: truckworks.overview,
    alt: '다섯 설비와 운반 시설을 배치한 TruckWorks 공장 자산 렌더',
    caption: '공장 전체 · 자체 Blender 자산 렌더',
    principle: '생산 상태는 서버가 관리하고, 3D 화면은 수신한 상태를 표현합니다.',
    path: ['생산 엔진', '상태 스냅샷', '3D 장면'],
  },
  {
    id: 'evidence', number: '02', label: 'AI 상태 분석',
    title: 'AI가 공장 데이터를 조회해\n설비 상태를 설명합니다.',
    description: '설비 상태를 질문하면 AI가 대기열과 이벤트 기록을 조회합니다. 답변에 사용한 데이터의 시각을 표시하고, 관련 설비를 3D 화면에서 선택할 수 있게 했습니다.',
    image: truckworks.detail,
    alt: '분석 대상으로 소개하는 형상 가공 설비의 Blender 자산 렌더',
    caption: '형상 가공 설비 · AI 분석 화면이 아닌 자산 렌더',
    principle: '분석에 사용하는 데이터는 요청 시점으로 고정합니다. AI는 데이터를 조회할 수 있고, 설비 조작은 사용자가 합니다.',
    path: ['사용자 질문', '고정 관측·읽기 도구', '답변과 근거'],
  },
  {
    id: 'craft', number: '03', label: '설비 모델링',
    title: 'Blender로 설비를 만들고\n가공 동작을 연결했습니다.',
    description: '설비와 공장 모델을 Blender로 제작했습니다. 움직이는 부품은 서버의 가공 진행률에 연결하고, 고장이 나면 해당 자세에서 멈추도록 했습니다.',
    image: truckworks.detail,
    alt: '안전창, 가공부, 제어 패널이 표현된 자체 제작 형상 가공 설비',
    caption: '모델의 외장·가동부 · 자체 Blender 자산 렌더',
    principle: 'React · Three.js / FastAPI · SimPy / LangGraph / Blender',
    path: ['모델 제작', '가동 계층', '상태 연동'],
  },
]
