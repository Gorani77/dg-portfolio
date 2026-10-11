export const truckworks = {
  title: 'TruckWorks',
  route: '#projects/truckworks',
  period: '2026.10 — 진행 중',
  role: '개인 프로젝트 · 기획 / 시스템 설계 / 프론트엔드 / 백엔드 / 3D',
  overview: `${import.meta.env.BASE_URL}truckworks/factory-overview.png`,
  detail: `${import.meta.env.BASE_URL}truckworks/forming-detail.png`,
  tools: ['get_factory_state', 'get_station_status', 'get_recent_events', 'get_buffer_status', 'get_part_history'],
}

export const storySteps = [
  { id: 'produce', label: '생산', title: '차체가 다섯 공정을 거쳐 생산됩니다.', description: '소재 투입, 형상 가공, 구멍 가공, 검사, 적재 순서로 생산합니다. 각 공정의 처리시간과 부품 이동은 서버에서 계산합니다.', detail: '브라우저는 서버가 보낸 생산 상태를 화면에 표시합니다. 화면의 프레임 속도와 생산 계산을 분리했습니다.', focus: [0, 1, 2, 3, 4], note: 'SimPy → 상태 스냅샷 → WebSocket → 3D', code: '서버에서 생산 상태 관리' },
  { id: 'fault', label: '고장', title: '설비가 고장 나면 부품과 남은 시간을 보관합니다.', description: '가공기를 멈춰도 처리 중이던 부품과 남은 가공시간은 유지됩니다. 다른 공정은 대기 공간과 이동 예약 상태에 따라 계속 진행하거나 기다립니다.', detail: '대기 중인 부품뿐 아니라 이동 중인 부품의 자리도 예약해, 도착 시 입력 공간이 초과되지 않도록 구성했습니다.', focus: [0, 1], note: '입력 대기 + 이동 예약 ≤ 입력 용량', code: 'FAULTED ≠ 공장 전체 PAUSED' },
  { id: 'analyze', label: '분석', title: 'AI가 설비 상태와 이벤트 기록을 조회합니다.', description: 'AI가 공장 상태, 설비별 대기열, 이벤트 기록을 조회해 답변합니다. 답변과 함께 조회에 사용한 도구와 데이터를 표시하고, 관련 설비를 화면에서 선택할 수 있게 했습니다.', detail: '분석 중에 공장 상태가 바뀌어도 해당 요청은 시작 시점의 데이터를 사용합니다. 답변에는 데이터의 시각과 확실하지 않은 내용을 함께 표시합니다.', focus: [1], note: '고정 관측 → 허용된 읽기 도구 → 인용 대조', code: 'AI 권한 = 조회 / 조작 권한 없음' },
  { id: 'recover', label: '복구', title: '복구하면 남은 가공시간부터 이어서 처리합니다.', description: '사용자가 설비를 복구하면 고장 당시 남아 있던 가공을 이어갑니다. AI에는 조회 도구만 제공하므로, AI 답변이 설비를 자동으로 재가동하지는 않습니다.', detail: '이미 끝난 공정을 다시 처리하지 않고, 고장 당시의 상태를 보존합니다. 생산과 분석 이력은 별도로 기록합니다.', focus: [1, 2, 3, 4], note: '잔여시간 보존 → 사용자 복구 → 공정 이어하기', code: '설비 복구는 사용자 명령으로 실행' },
]

export const architectureLayers = [
  { id: 'production', label: '생산 상태', title: '생산 계산은 서버에서 처리합니다.', body: 'FastAPI와 SimPy가 생산·이동·고장 상태를 관리합니다. React는 WebSocket으로 받은 스냅샷을 3D 화면에 반영합니다. 부품이 부드럽게 움직이도록 위치를 보간하되, 공정 완료 여부는 서버의 계산을 따릅니다.', path: ['사용자 명령', 'FastAPI / SimPy', 'WebSocket', 'React / Three.js'], source: 'simulation/station_runtime.py · scene/partPosition.ts' },
  { id: 'analysis', label: 'AI 관측', title: '한 분석 요청에서는 같은 시점의 데이터를 사용합니다.', body: '요청 시작 시점의 데이터를 ReadContext로 전달합니다. LangGraph에서 도구 선택, 조회, 답변 생성을 순서대로 처리합니다. 도구 입력이 허용 범위 안에 있는지 검사하고, 답변에 인용한 이벤트와 설비가 실제 조회 결과에 있는지 대조합니다.', path: ['질문 + 실행 ID', '고정 ReadContext', '읽기 도구 / LangGraph', '답변 + 근거'], source: 'agents/tools.py · agents/workflow.py' },
  { id: 'history', label: '방문자와 기록', title: '방문자별 공장을 분리하고 이력을 저장합니다.', body: '익명 쿠키를 기준으로 방문자마다 별도의 공장을 실행하고, DB 조회에도 소유자 조건을 적용합니다. 생산 스냅샷과 분석 이력은 비동기로 저장합니다. 사용하지 않는 공장 실행을 정리한 뒤에도 저장된 이력은 유지합니다.', path: ['익명 방문자 쿠키', '방문자별 Runner', '비동기 저장 큐', 'PostgreSQL'], source: 'api/visitors.py · persistence/writer.py · persistence/analysis.py' },
]

export const decisions = [
  { number: '01', title: '이동 중인 부품의 대기 공간 예약', problem: '대기 중인 부품만 세면, 이동 중인 부품이 도착할 때 입력 공간이 넘칠 수 있습니다.', choice: '대기 중인 부품 수와 이동 중인 부품의 예약 수를 합쳐 입력 용량을 계산했습니다. 가공·대기·이동 상태는 각각 관리합니다.', source: 'simulation/batch.py', boundary: '현재 모델의 입력 용량은 3개입니다. 실제 설비 측정값이 아닙니다.' },
  { number: '02', title: '분석 요청 시점의 데이터 고정', problem: '도구를 차례로 호출하는 동안 공장 상태가 바뀌면, 서로 다른 시점의 데이터로 원인을 설명할 수 있습니다.', choice: '한 요청에 속한 조회 도구는 모두 같은 스냅샷을 사용하도록 했습니다. 답변에는 실행 ID, 상태 버전, 데이터 시각을 포함했습니다.', source: 'agents/tools.py · agents/workflow.py', boundary: '답변이 도착했을 때 현재 상태는 달라질 수 있습니다.' },
  { number: '03', title: '답변에 인용한 이벤트·설비 검사', problem: '응답 형식을 맞춰도 AI가 조회하지 않은 이벤트나 존재하지 않는 설비를 인용할 수 있습니다.', choice: '도구와 입력값을 검사하고, 답변의 이벤트·설비 ID를 실제 조회 결과와 대조합니다. 확실하지 않은 내용은 별도 응답 필드에 남깁니다.', source: 'agents/workflow.py', boundary: '인용의 존재를 확인하는 것이 원인의 정확성까지 증명하지는 않습니다.' },
  { number: '04', title: '분석 실패 시 사용량과 도구 호출 기록 보관', problem: '모델 요청이 실패했을 때 사용량과 도구 호출 기록까지 사라지면 실패 과정을 파악하기 어렵습니다.', choice: '그래프 실행 상태와 별도로 API에서 받은 사용량과 도구 호출 기록을 수집해 분석 이력에 저장했습니다.', source: 'agents/usage.py · persistence/analysis.py', boundary: '공급자가 보내지 않은 사용량이나 실제 청구액을 확정하지 않습니다.' },
]
