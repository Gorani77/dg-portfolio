export const educationImplementation = {
  "context": {
    "file": "src/main/java/com/cenedu/backend/ai/dispatcher/AgentDispatcher.java",
    "line": 92,
    "code": "for (InputGuard guard : inputGuards) {\n    GuardDecision decision = guard.inspect(request);\n    if (decision.blocked()) {\n        log.info(\"입력 차단 — agent={}, guard={}, reason={}\",\n                request.kind(), guard.getClass().getSimpleName(), decision.reasonCode());\n        throw new BusinessException(ErrorCode.AI_REQUEST_BLOCKED, decision.message());\n    }\n}\n\n// 권한 없는 사용자가 에이전트 등록 여부를 탐색하지 못하도록 입력 검사 뒤에 조회한다.\nAgent agent = agentFor(request.kind());\nAgentResponse response = agent.handle(request);"
  },
  "retrieval": {
    "file": "src/main/java/com/cenedu/backend/ai/guard/input/policy/PolicyRetriever.java",
    "line": 43,
    "code": "List<Hit> selected = new ArrayList<>();\nfor (String scope : List.of(\"COMMON\", kind.name())) {\n    List<Hit> hits = repository.search(keys, scope, question.model(), queryVector, topK);\n    if (hits.isEmpty()) throw new IllegalStateException(\"필수 범위의 정책 검색 결과가 없습니다.\");\n    selected.addAll(hits);\n}\nreturn List.copyOf(selected);",
    "sql": "SELECT policy_id, scope, effect, message, body,\n       1 - (embedding <=> CAST(:vector AS vector)) AS score\nFROM guard_policy_embedding\nWHERE version_key IN (:keys) AND scope = :scope AND embedding_model = :model\nORDER BY embedding <=> CAST(:vector AS vector), policy_id\nLIMIT :limit",
    "sqlFile": "src/main/java/com/cenedu/backend/ai/guard/input/policy/PolicyVectorRepository.java",
    "sqlLine": 40
  },
  "assessment": {
    "file": "src/main/java/com/cenedu/backend/ai/guard/input/PolicyRagInputGuard.java",
    "line": 23,
    "code": "private static final String SCHEMA = \"\"\"\n        {\"type\":\"object\",\"properties\":{\n          \"decision\":{\"type\":\"string\",\"enum\":[\"ALLOW\",\"BLOCK\",\"UNCERTAIN\"]},\n          \"policyIds\":{\"type\":\"array\",\"items\":{\"type\":\"string\"},\"minItems\":1}\n        },\"required\":[\"decision\",\"policyIds\"],\"additionalProperties\":false}\n        \"\"\";"
  },
  "server": {
    "file": "src/main/java/com/cenedu/backend/ai/guard/input/PolicyRagInputGuard.java",
    "line": 76,
    "code": "for (var id : json.path(\"policyIds\")) {\n    if (!id.isTextual()) return unavailable();\n    var hit = hits.stream().filter(h -> h.policy().id().equals(id.asText())).findFirst();\n    if (hit.isEmpty() || !hit.get().policy().effect().equals(decision)) return unavailable();\n    selected.add(hit.get());\n}"
  }
}
