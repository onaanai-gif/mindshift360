"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ACTIONS,
  FOLLOW_UP_BUTTONS,
  FOLLOW_UP_TEXT,
  GOAL_OPTIONS,
  MAX_TEXT_LENGTH,
  PAUSE_OPTIONS,
  PAUSE_STEPS,
  TRIGGER_OPTIONS,
  TRUSTED_PERSON_MESSAGE,
  type FollowUpKind,
  type GoalId,
  type TriggerId,
} from "@/content/supportContent";
import { nextFollowUp, STEP_ORDER } from "@/lib/followUps";
import { requestPlan } from "@/lib/requestPlan";
import { CommunityLink } from "./CommunityLink";
import { CopyMessage } from "./CopyMessage";
import { PauseTimer } from "./PauseTimer";
import { SafetyPanel } from "./SafetyPanel";
import { useSession, type View } from "./SessionProvider";
import { useFocusHeading } from "./useFocusHeading";

export function ReclaimApp() {
  const { state } = useSession();
  switch (state.view) {
    case "landing":
      return <Landing />;
    case "pause":
      return <PauseSteps />;
    case "pause-choice":
      return <PauseChoice />;
    case "pause-guidance":
      return <PauseGuidance />;
    case "form":
      return <PlanForm />;
    case "loading":
      return <Loading />;
    case "plan":
      return <PlanView />;
    case "safety":
      return <SafetyView />;
  }
}

// ---------------------------------------------------------------------------

function Landing() {
  const { dispatch } = useSession();
  const heading = useFocusHeading<HTMLHeadingElement>("landing", true);
  return (
    <section aria-labelledby="landing-heading" className="stack">
      <h1 id="landing-heading" ref={heading} tabIndex={-1}>
        Want to stop betting, but finding it hard?
      </h1>
      <p className="lead">
        Tell us what is happening, or start with one small step right now. You do not need to create an account.
      </p>
      <div className="button-stack">
        <button type="button" className="button button-primary" onClick={() => dispatch({ type: "pauseStep", step: 0 })}>
          I feel like betting now. Help me pause.
        </button>
        <button type="button" className="button button-secondary" onClick={() => dispatch({ type: "go", view: "form" })}>
          Help me make a plan.
        </button>
      </div>
      <p className="small">
        For football betting, online casinos, Aviator and other games of chance.{" "}
        <Link href="/help#under-18">Under 18? There is support for you too.</Link>
      </p>
      <p className="small">
        Reclaim offers support and education. It is not an emergency service or a replacement for professional
        treatment. <Link href="/privacy">How Reclaim works and handles your information</Link>.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------

function PauseSteps() {
  const { state, dispatch } = useSession();
  const step = PAUSE_STEPS[state.pauseStep];
  const heading = useFocusHeading<HTMLHeadingElement>(state.pauseStep);
  const last = state.pauseStep === PAUSE_STEPS.length - 1;
  const next = () =>
    last ? dispatch({ type: "go", view: "pause-choice" }) : dispatch({ type: "pauseStep", step: state.pauseStep + 1 });

  return (
    <section aria-labelledby="pause-heading" className="stack">
      <p className="eyebrow">
        Pause, step {state.pauseStep + 1} of {PAUSE_STEPS.length}
      </p>
      <h1 id="pause-heading" ref={heading} tabIndex={-1} className="pause-text">
        {step.text}
      </h1>
      {step.hint && <p>{step.hint}</p>}
      {step.id === "ten-minutes" && <PauseTimer />}
      <div className="button-stack">
        <button type="button" className="button button-primary" onClick={next}>
          {last ? "Done. What next?" : "Done. Next step"}
        </button>
        <button type="button" className="button button-text" onClick={next}>
          Skip this step
        </button>
      </div>
    </section>
  );
}

function PauseChoice() {
  const { dispatch } = useSession();
  const heading = useFocusHeading<HTMLHeadingElement>("choice");
  return (
    <section aria-labelledby="choice-heading" className="stack">
      <h1 id="choice-heading" ref={heading} tabIndex={-1}>
        What would help you most right now?
      </h1>
      <div className="button-stack">
        {PAUSE_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className="button button-choice"
            onClick={() => dispatch({ type: "pauseOption", option: o.id })}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function PauseGuidance() {
  const { state, dispatch } = useSession();
  const guidance = PAUSE_OPTIONS.find((o) => o.id === state.pauseOption) ?? PAUSE_OPTIONS[0];
  const heading = useFocusHeading<HTMLHeadingElement>(guidance.id);
  return (
    <section aria-labelledby="guidance-heading" className="stack">
      <h1 id="guidance-heading" ref={heading} tabIndex={-1}>
        {guidance.heading}
      </h1>
      <p>{guidance.intro}</p>
      <ol className="steps">
        {guidance.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {guidance.id === "talk_to_someone" && <CopyMessage message={TRUSTED_PERSON_MESSAGE} />}
      <div className="button-stack">
        <button type="button" className="button button-primary" onClick={() => dispatch({ type: "go", view: "form" })}>
          Help me make a plan.
        </button>
        <button type="button" className="button button-secondary" onClick={() => dispatch({ type: "go", view: "pause-choice" })}>
          Choose something else
        </button>
        <Link className="button button-text" href="/help">
          Get human help
        </Link>
      </div>
      <CommunityLink under18={state.form.under18} />
    </section>
  );
}

// ---------------------------------------------------------------------------

function PlanForm() {
  const { state, dispatch, aiEnabled } = useSession();
  const heading = useFocusHeading<HTMLHeadingElement>("form");
  const [form, setForm] = useState(state.form);

  const toggleTrigger = (id: TriggerId) =>
    setForm((f) => ({
      ...f,
      triggers: f.triggers.includes(id) ? f.triggers.filter((t) => t !== id) : [...f.triggers, id],
    }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "form", form });
    dispatch({ type: "go", view: "loading" });
    const outcome = await requestPlan(form, aiEnabled);
    dispatch({
      type: "plan",
      plan: outcome.plan,
      usedFallback: outcome.usedFallback,
      safetyCategories: outcome.safetyCategories,
    });
    if (outcome.urgent) {
      dispatch({ type: "safety", categories: outcome.safetyCategories, after: "plan" });
    }
  };

  return (
    <form onSubmit={submit} className="stack" aria-labelledby="form-heading" noValidate>
      <h1 id="form-heading" ref={heading} tabIndex={-1}>
        Let&apos;s make a short plan
      </h1>
      <p>Every question is optional. You can leave all of them blank.</p>

      <div className="field">
        <label htmlFor="what-is-happening" className="label">
          What is happening?
        </label>
        <p id="text-privacy" className="hint">
          Please leave out names, phone numbers, account details and anything that could identify you or someone
          else.
        </p>
        <textarea
          id="what-is-happening"
          name="text"
          rows={4}
          maxLength={MAX_TEXT_LENGTH}
          aria-describedby="text-privacy text-count"
          placeholder="For example: I keep losing on Aviator, but I keep going back."
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          autoComplete="off"
          spellCheck
        />
        <p id="text-count" className="hint" aria-live="polite">
          {form.text.length} of {MAX_TEXT_LENGTH} characters
        </p>
      </div>

      <fieldset className="field">
        <legend className="label">What keeps bringing you back?</legend>
        <p className="hint">Choose any that fit.</p>
        {TRIGGER_OPTIONS.map((o) => (
          <label key={o.id} className="option">
            <input type="checkbox" checked={form.triggers.includes(o.id)} onChange={() => toggleTrigger(o.id)} />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="field">
        <legend className="label">What would help today?</legend>
        <p className="hint">Choose one, or none.</p>
        {GOAL_OPTIONS.map((o) => (
          <label key={o.id} className="option">
            <input
              type="radio"
              name="goal"
              checked={form.goal === o.id}
              onChange={() => setForm({ ...form, goal: o.id as GoalId })}
            />
            <span>{o.label}</span>
          </label>
        ))}
        {form.goal && (
          <button type="button" className="button button-text" onClick={() => setForm({ ...form, goal: null })}>
            Clear this choice
          </button>
        )}
      </fieldset>

      <div className="field">
        <label className="option">
          <input type="checkbox" checked={form.under18} onChange={(e) => setForm({ ...form, under18: e.target.checked })} />
          <span>I am under 18 (optional)</span>
        </label>
      </div>

      <div className="notice" id="data-notice">
        {aiEnabled ? (
          <p>
            When you press the button, what you type is sent to Reclaim&apos;s server and to an AI provider
            (Anthropic) to write a short response. Reclaim does not save it. The AI provider may keep it for a limited
            time under its own policy. <Link href="/privacy">More about privacy</Link>.
          </p>
        ) : (
          <p>
            Live AI is switched off. Your answers stay on this device and Reclaim chooses from reviewed support steps.{" "}
            <Link href="/privacy">More about privacy</Link>.
          </p>
        )}
      </div>

      <button type="submit" className="button button-primary" aria-describedby="data-notice">
        Help me take the next step.
      </button>
    </form>
  );
}

function Loading() {
  const heading = useFocusHeading<HTMLParagraphElement>("loading");
  return (
    <section className="stack" aria-busy="true">
      <p ref={heading} tabIndex={-1} role="status" className="lead">
        Preparing your next step. This should only take a few seconds.
      </p>
      <p>While you wait: if a betting app is open, you can close it now.</p>
    </section>
  );
}

// ---------------------------------------------------------------------------

function PlanView() {
  const { state, dispatch } = useSession();
  const plan = state.plan!;
  const heading = useFocusHeading<HTMLHeadingElement>("plan");
  const under18 = state.form.under18 || state.safetyCategories.includes("under_18");
  const finished = state.stepIndex >= STEP_ORDER.length;
  const currentAction = finished ? null : ACTIONS[plan[STEP_ORDER[state.stepIndex]]];

  const respond = (kind: FollowUpKind) => {
    const outcome = nextFollowUp(plan, state.stepIndex, kind, state.followUps.length);
    dispatch({ type: "followUp", ...outcome, stepIndex: outcome.nextStepIndex });
  };

  const slotLabels = { immediate: "Right now", today: "Today", human: "Human support" } as const;

  return (
    <section aria-labelledby="plan-heading" className="stack">
      <h1 id="plan-heading" ref={heading} tabIndex={-1}>
        Your next step
      </h1>
      <p className="lead">{plan.acknowledgement}</p>
      <p className="source-label">
        {plan.source === "ai"
          ? "Personalised with AI from Reclaim's reviewed support steps."
          : state.usedFallback
            ? "Showing Reclaim's reviewed support steps. Live AI was not used for this response."
            : "Reclaim's reviewed support steps."}
      </p>

      <ol className="cards">
        {STEP_ORDER.map((slot, i) => {
          const action = ACTIONS[plan[slot]];
          const current = i === state.stepIndex;
          const done = i < state.stepIndex;
          return (
            <li key={slot} className={`card${current ? " card-current" : ""}${done ? " card-done" : ""}`} aria-current={current ? "step" : undefined}>
              <p className="eyebrow">
                {slotLabels[slot]}
                {done && " · done"}
              </p>
              <h2 className="card-title">{action.title}</h2>
              <p>{action.body}</p>
              {slot === "today" && plan.todayNote && <p className="note">{plan.todayNote}</p>}
              {slot === "human" && (
                <p>
                  <Link href="/help">Get human help</Link>
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {currentAction && !state.followUpLimitReached && (
        <div role="group" aria-labelledby="followup-label" className="stack-tight">
          <p id="followup-label" className="label">
            About &ldquo;{currentAction.title}&rdquo;:
          </p>
          <div className="button-grid">
            {FOLLOW_UP_BUTTONS.map((b) => (
              <button
                key={b.kind}
                type="button"
                className={`button ${b.kind === "done" ? "button-primary" : "button-secondary"}`}
                onClick={() => respond(b.kind)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div aria-live="polite" className="stack-tight">
        {state.followUps.map((f) => (
          <div key={f.id} className="panel panel-quiet followup">
            <p>{f.intro}</p>
            {f.steps.length > 0 && (
              <ul>
                {f.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
            {f.offerTimer && <PauseTimer />}
            {f.offerHumanHelp && (
              <p>
                <Link href="/help">Get human help</Link>
              </p>
            )}
          </div>
        ))}
        {state.followUpLimitReached && <p className="panel panel-quiet">{FOLLOW_UP_TEXT.limitReached}</p>}
      </div>

      {currentAction === null && (
        <button type="button" className="button button-secondary" onClick={() => respond("block_access")}>
          Help me block access.
        </button>
      )}

      <CommunityLink under18={under18} />

      <div className="button-row">
        <button type="button" className="button button-text" onClick={() => dispatch({ type: "go", view: "form" })}>
          Change my answers
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

function SafetyView() {
  const { state, dispatch } = useSession();
  const heading = useFocusHeading<HTMLHeadingElement>("safety");
  const after: View = state.afterSafety;
  return (
    <SafetyPanel
      categories={state.safetyCategories}
      automatic
      headingLevel={1}
      headingRef={heading}
      onContinue={() => dispatch({ type: "go", view: after })}
    />
  );
}
