export const interviewImplementation = {
  "routing": {
    "file": "src/interview/interviewer/workflow/routing.py",
    "line": 68,
    "code": "last_signal = _restore_signal(\n    _state_get(state, \"last_signal\")\n)\n\nif last_signal is None:\n    return \"complete_set\"\n\nif last_signal.quality == AnswerQuality.OFF_TOPIC:\n    return \"handle_off_topic\"\n\n\nderived_turn_count = _state_get(state, \"derived_turn_count\", 0)\nmax_derived_turns = _state_get(state, \"max_derived_turns_per_set\", 2)\nif derived_turn_count >= max_derived_turns:\n    return \"complete_set\"\n\ntry:\n    last_signal = _restore_signal(_state_get(state, \"last_signal\"))\nexcept ValidationError:\n    return \"complete_set\"\n\nif last_signal is None:\n    return \"complete_set\"\n\nif (\n    last_signal.quality == AnswerQuality.MISCONCEPTION\n    and _state_get(state, \"challenge_used_in_set\", False)\n):\n    return \"complete_set\"\n\nroutes = {\n    AnswerQuality.SUFFICIENT: \"complete_set\",\n    AnswerQuality.UNKNOWN: \"complete_set\",\n    AnswerQuality.BONUS_AVAILABLE: \"ask_follow_up\",\n    AnswerQuality.MISCONCEPTION: \"ask_challenge\",\n    AnswerQuality.CONFIRM_POSITIVE: \"ask_confirm_positive\",\n    AnswerQuality.CONFIRM_NEGATIVE: \"ask_confirm_negative\",\n    AnswerQuality.TRAP_AVAILABLE: \"ask_trap\",\n}\nreturn routes.get(last_signal.quality, \"complete_set\")"
  },
  "wait": {
    "file": "src/interview/interviewer/workflow/nodes.py",
    "line": 55,
    "code": "payload = interrupt({\"waiting_for\": \"candidate\"})\n\nreturn {\n    \"pending_event\": payload[\"event\"],\n    \"pending_delivery_metrics\": payload.get(\"delivery_metrics\"),\n}"
  },
  "completion": {
    "file": "src/interview/interviewer/workflow/routing.py",
    "line": 171,
    "code": "if _state_get(state, \"finished\", False):\n    return \"final_report\"\n\nasked_count = _state_get(state, \"asked_count\", 0)\nmax_questions = _state_get(state, \"max_questions\", 10)\nreturn \"final_report\" if asked_count >= max_questions else \"ask_main\""
  }
}
