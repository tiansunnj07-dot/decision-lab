"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Answer, IntroProfile, LabResult } from "@/lib/lab/decisionEngine";

/* ── State ─────────────────────────────────── */

export interface ExperimentState {
  step: "entry" | "intro" | "test" | "computing" | "trap" | "report";
  introProfile: IntroProfile;
  testAnswers: Answer[];
  trapAnswers: Record<string, string>;
  labResult: LabResult | null;
  consentGiven: boolean;
}

/* ── Actions ───────────────────────────────── */

export type ExperimentAction =
  | { type: "SET_STEP"; step: ExperimentState["step"] }
  | { type: "SET_CONSENT"; value: boolean }
  | { type: "SET_INTRO_PROFILE"; profile: IntroProfile }
  | { type: "ADD_TEST_ANSWER"; answer: Answer }
  | { type: "UNDO_TEST_ANSWER" }
  | { type: "SET_TRAP_ANSWER"; questionId: string; optionKey: string }
  | { type: "SET_LAB_RESULT"; result: LabResult }
  | { type: "RESET" };

/* ── Initial state ─────────────────────────── */

const initialState: ExperimentState = {
  step: "entry",
  introProfile: {},
  testAnswers: [],
  trapAnswers: {},
  labResult: null,
  consentGiven: false,
};

/* ── Reducer ───────────────────────────────── */

function reducer(
  state: ExperimentState,
  action: ExperimentAction
): ExperimentState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_CONSENT":
      return { ...state, consentGiven: action.value };
    case "SET_INTRO_PROFILE":
      return { ...state, introProfile: action.profile };
    case "ADD_TEST_ANSWER":
      return { ...state, testAnswers: [...state.testAnswers, action.answer] };
    case "UNDO_TEST_ANSWER":
      return { ...state, testAnswers: state.testAnswers.slice(0, -1) };
    case "SET_TRAP_ANSWER":
      return {
        ...state,
        trapAnswers: {
          ...state.trapAnswers,
          [action.questionId]: action.optionKey,
        },
      };
    case "SET_LAB_RESULT":
      return { ...state, labResult: action.result };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/* ── Context ───────────────────────────────── */

const ExperimentContext = createContext<{
  state: ExperimentState;
  dispatch: Dispatch<ExperimentAction>;
} | null>(null);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  );
}

/** Hook：在实验页面中获取状态与 dispatch */
export function useExperiment() {
  const ctx = useContext(ExperimentContext);
  if (!ctx) {
    throw new Error("useExperiment must be used within <ExperimentProvider>");
  }
  return ctx;
}
