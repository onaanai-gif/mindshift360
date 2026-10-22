/**
 * Reviewed support content.
 *
 * Every piece of guidance a person sees comes from this file. The AI layer
 * may only choose between these actions and write a short acknowledgement;
 * it never writes the actions themselves.
 *
 * EDITING: keep sentences short, use British English, avoid em dashes,
 * clinical labels, promises of recovery and anything that sounds like
 * betting advice. Any change here should go through the same professional
 * review as the launch checklist describes (see docs/LAUNCH_CHECKLIST.md).
 */

export const CONTENT_VERSION = "2026-10-22-draft";

// ---------------------------------------------------------------------------
// Immediate pause experience
// ---------------------------------------------------------------------------

export const PAUSE_STEPS: readonly { id: string; text: string; hint?: string }[] = [
  {
    id: "close",
    text: "Close the betting app or website. You can keep Reclaim open.",
  },
  {
    id: "ten-minutes",
    text: "Give yourself ten minutes without placing a bet or making a deposit.",
    hint: "You can use the timer below if it helps. You can stop it at any time.",
  },
  {
    id: "notifications",
    text: "Move away from betting messages and notifications for now.",
    hint: "Mute tip groups and betting app notifications, or put your phone in another room for a while.",
  },
];

export const TIMER_NOTE =
  "The urge may still be there when the timer ends, and that is okay. Ten minutes is a pause, not a test. You can choose another step at any time.";

export type PauseOptionId = "protect_money" | "deal_with_urge" | "stop_chasing" | "talk_to_someone";

export interface PauseGuidance {
  id: PauseOptionId;
  label: string;
  heading: string;
  intro: string;
  steps: string[];
}

export const PAUSE_OPTIONS: readonly PauseGuidance[] = [
  {
    id: "protect_money",
    label: "Protect the money I have left.",
    heading: "Protecting the money you have left",
    intro: "What you still have matters. These steps put a bit of distance between you and your money.",
    steps: [
      "Do not make another deposit today. Leave your betting wallet as it is.",
      "Work out what you need this week for food, transport, rent and school fees. Treat that money as already spoken for.",
      "If it helps, ask someone you trust to keep some cash for you for a few days. Never share your MoMo PIN with anyone.",
      "Remove saved MoMo or card details from your betting accounts, so depositing takes longer.",
    ],
  },
  {
    id: "deal_with_urge",
    label: "Deal with the urge.",
    heading: "Getting through this urge",
    intro: "Urges tend to rise and fall. You do not have to act on this one.",
    steps: [
      "Change where you are. Go outside, to another room, or somewhere with other people.",
      "Breathe slowly: in through your nose, then a longer breath out. Do this five times.",
      "Have some water or something to eat. Hunger and tiredness can make urges feel stronger.",
      "Message or call someone, even about something else.",
      "If the urge is still strong, start the ten-minute pause again.",
    ],
  },
  {
    id: "stop_chasing",
    label: "Stop trying to win back my losses.",
    heading: "Stepping away from chasing losses",
    intro:
      "Trying to win back what you lost often leads to losing more. The next bet does not know what you lost before. It is a new risk, not a way to fix the last one.",
    steps: [
      "Decide that today's losses stop here. That is a decision you can make now.",
      "Do not borrow money to bet or to win back losses.",
      "If you owe money, you can list who you owe and how much later, when you feel calmer. That list is a starting point, not a judgement.",
      "Talk to someone you trust about what you lost. Shame grows when it is kept secret.",
    ],
  },
  {
    id: "talk_to_someone",
    label: "Talk to someone.",
    heading: "Talking to someone",
    intro: "Talking can take some of the pressure off. You do not have to tell anyone everything.",
    steps: [
      "Choose one person you trust: a friend, family member, religious leader, teacher or colleague.",
      "Send them a short message. You can copy the one below.",
      "See the Get human help page for verified support options.",
      "Reclaim does not have counsellors watching this site, so please reach out to a person directly.",
    ],
  },
];

export const TRUSTED_PERSON_MESSAGE =
  "I'm trying to stop betting and I'm finding it hard right now. Can we talk?";

// ---------------------------------------------------------------------------
// Short form options
// ---------------------------------------------------------------------------

export type TriggerId =
  | "need_money"
  | "win_back"
  | "stressed"
  | "bored_lonely"
  | "friends_groups"
  | "next_bet_hope"
  | "dont_know"
  | "other";

export const TRIGGER_OPTIONS: readonly { id: TriggerId; label: string }[] = [
  { id: "need_money", label: "I need money." },
  { id: "win_back", label: "I want to win back what I lost." },
  { id: "stressed", label: "I feel stressed or overwhelmed." },
  { id: "bored_lonely", label: "I am bored or lonely." },
  { id: "friends_groups", label: "My friends or groups encourage it." },
  { id: "next_bet_hope", label: "I keep hoping the next bet will change things." },
  { id: "dont_know", label: "I don't know." },
  { id: "other", label: "Something else." },
];

export type GoalId =
  | "stop_next_bet"
  | "protect_money"
  | "get_through_urge"
  | "start_again"
  | "human_support";

export const GOAL_OPTIONS: readonly { id: GoalId; label: string }[] = [
  { id: "stop_next_bet", label: "Stop the next bet." },
  { id: "protect_money", label: "Protect my remaining money." },
  { id: "get_through_urge", label: "Get through an urge." },
  { id: "start_again", label: "Start again after betting." },
  { id: "human_support", label: "Find human support." },
];

export const MAX_TEXT_LENGTH = 1000;

// ---------------------------------------------------------------------------
// Action cards
// ---------------------------------------------------------------------------

export type CardSlot = "immediate" | "today" | "human";

export interface ActionCard {
  id: string;
  slot: CardSlot;
  title: string;
  body: string;
  /** Offered when someone says the step feels too difficult. */
  smallerStep: string;
}

export const ACTIONS = {
  // Right now --------------------------------------------------------------
  close_app: {
    id: "close_app",
    slot: "immediate",
    title: "Close the betting app or site",
    body: "Close it now and put your phone down for a moment. You can keep Reclaim open.",
    smallerStep: "Just switch to a different screen for one minute. That is enough for now.",
  },
  delay_ten: {
    id: "delay_ten",
    slot: "immediate",
    title: "Give yourself ten minutes",
    body: "No bets and no deposits for the next ten minutes. Move somewhere different if you can.",
    smallerStep: "Try two minutes instead. Look away from your phone and breathe out slowly.",
  },
  protect_money_now: {
    id: "protect_money_now",
    slot: "immediate",
    title: "Protect what you have left",
    body: "Do not make another deposit today. Keep the money you need for essentials out of your betting wallet.",
    smallerStep: "Decide not to deposit for the next hour. You can decide again after that.",
  },
  stop_chasing: {
    id: "stop_chasing",
    slot: "immediate",
    title: "Let today's losses stop here",
    body: "The next bet is a new risk, not a way to fix the last one. Close the app before you try to win it back.",
    smallerStep: "Put your phone down and step away from it for five minutes.",
  },
  mute_triggers: {
    id: "mute_triggers",
    slot: "immediate",
    title: "Mute betting messages",
    body: "Mute betting-tip groups and turn off betting app notifications for today.",
    smallerStep: "Mute just one group or app, the one that pulls you in most.",
  },
  after_betting: {
    id: "after_betting",
    slot: "immediate",
    title: "Pause here, without blaming yourself",
    body: "Betting again does not cancel the effort you have made. The useful step now is to stop the next bet, not win back the last one.",
    smallerStep: "Close the betting app. That is the whole step for now.",
  },
  name_feeling: {
    id: "name_feeling",
    slot: "immediate",
    title: "Notice what is under the urge",
    body: "Ask yourself: am I stressed, bored, lonely or worried about money? Naming it can make the urge easier to handle.",
    smallerStep: "Take three slow breaths before you do anything else.",
  },

  // Today --------------------------------------------------------------------
  list_essentials: {
    id: "list_essentials",
    slot: "today",
    title: "Write down this week's essentials",
    body: "Food, transport, rent, school fees, data for work. Keep that amount apart from anything else.",
    smallerStep: "Write down just one essential cost for tomorrow.",
  },
  slow_deposits: {
    id: "slow_deposits",
    slot: "today",
    title: "Make depositing slower",
    body: "Log out of betting apps and remove saved MoMo or card details from betting accounts. Extra steps give you time to think.",
    smallerStep: "Log out of one betting account today.",
  },
  remove_apps: {
    id: "remove_apps",
    slot: "today",
    title: "Remove betting apps",
    body: "Delete betting apps and remove saved betting sites from your browser. One at a time is fine.",
    smallerStep: "Move one betting app off your home screen.",
  },
  urgent_money_step: {
    id: "urgent_money_step",
    slot: "today",
    title: "Pick one step for the money problem",
    body: "Write down the most urgent cost and one person or place that could help with it. Betting is unlikely to solve it.",
    smallerStep: "Just name the most urgent cost to yourself. That is a start.",
  },
  no_borrowing: {
    id: "no_borrowing",
    slot: "today",
    title: "Do not borrow to win it back",
    body: "Borrowing to recover losses can make the debt bigger. If you owe money, list who and how much when you feel calmer.",
    smallerStep: "For today, just decide not to borrow for betting.",
  },
  plan_hard_time: {
    id: "plan_hard_time",
    slot: "today",
    title: "Plan for your hardest moment",
    body: "Think about when urges come: match days, payday, late at night, after a loss. Choose one thing to do instead at that time.",
    smallerStep: "Name the time of day when urges are strongest. That is enough for today.",
  },
  restart_small: {
    id: "restart_small",
    slot: "today",
    title: "Restart with one small plan",
    body: "Choose one protective step for the next 24 hours, such as no deposits today. Small steps are easier to repeat.",
    smallerStep: "Choose one step for the next hour instead of the whole day.",
  },
  leave_groups: {
    id: "leave_groups",
    slot: "today",
    title: "Step back from betting groups",
    body: "Leave or mute tip groups and betting channels. If friends push you to bet, it is fine to say you are taking a break.",
    smallerStep: "Archive one group chat so you do not see it straight away.",
  },

  // Human support --------------------------------------------------------------
  trusted_person: {
    id: "trusted_person",
    slot: "human",
    title: "Tell one person you trust (optional)",
    body: "Message someone you trust and say you are trying to stop betting. You do not have to share everything.",
    smallerStep: "Think of one person you could tell later. You do not have to contact them yet.",
  },
  professional_help: {
    id: "professional_help",
    slot: "human",
    title: "Speak to a professional (optional)",
    body: "A doctor, counsellor or mental health professional can help. See the Get human help page for verified options.",
    smallerStep: "Open the Get human help page and just read it. No need to contact anyone yet.",
  },
  trusted_adult: {
    id: "trusted_adult",
    slot: "human",
    title: "Talk to a trusted adult (optional)",
    body: "A parent, guardian, teacher, school counsellor or another adult you trust can help you think this through.",
    smallerStep: "Think of one adult you feel safe with. You can decide later when to talk.",
  },
} as const satisfies Record<string, ActionCard>;

export type ActionId = keyof typeof ACTIONS;

export const ACTION_IDS_BY_SLOT: Record<CardSlot, ActionId[]> = {
  immediate: (Object.keys(ACTIONS) as ActionId[]).filter((id) => ACTIONS[id].slot === "immediate"),
  today: (Object.keys(ACTIONS) as ActionId[]).filter((id) => ACTIONS[id].slot === "today"),
  human: (Object.keys(ACTIONS) as ActionId[]).filter((id) => ACTIONS[id].slot === "human"),
};

// ---------------------------------------------------------------------------
// Acknowledgements used when live AI is off or unavailable
// ---------------------------------------------------------------------------

export const ACKNOWLEDGEMENTS = {
  general:
    "Thank you for telling us. Wanting to stop and finding it hard is something many people go through. Here is one small step to start with.",
  urge: "That urge sounds strong right now. You do not have to act on it. Let's slow things down first.",
  chasing:
    "Losing money and wanting it back is a painful place to be. The money already lost is gone, so let's protect what you still have.",
  money:
    "Needing money is a real problem, and the pressure is hard. Betting more is likely to make it harder, so let's protect what you have first.",
  restart:
    "You bet again, and you came back here. That matters. Let's focus on the next few hours, not on what already happened.",
  human: "Talking to someone is a good step. Here is how to start, and one thing you can do right now.",
  tips: "Reclaim cannot give betting tips, odds or ways to win money back. What it can do is help you take a step away from betting.",
  lonely:
    "Boredom and loneliness can make betting feel like company. Let's find one small thing to do instead.",
  pressure:
    "When friends or groups keep talking about bets, it is hard to step away. Let's reduce that pull a little.",
  under18:
    "Thank you for reaching out. Betting can be hard to stop at any age, and you deserve support. Here is a step for now.",
} as const;

export type AcknowledgementKey = keyof typeof ACKNOWLEDGEMENTS;

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export type FollowUpKind = "done" | "too_difficult" | "urge_strong" | "block_access";

export const FOLLOW_UP_BUTTONS: readonly { kind: FollowUpKind; label: string }[] = [
  { kind: "done", label: "I've done this." },
  { kind: "too_difficult", label: "This feels too difficult." },
  { kind: "urge_strong", label: "The urge is still strong." },
  { kind: "block_access", label: "Help me block access." },
];

export const MAX_FOLLOW_UPS = 8;

export const FOLLOW_UP_TEXT = {
  doneNext: "That was a real step. When you are ready, here is the next one.",
  doneAll:
    "You have worked through all three steps. You can come back to Reclaim whenever an urge returns. Starting again is always allowed.",
  tooDifficult: "That is okay. Here is a smaller version:",
  urgeStrongIntro:
    "Strong urges can feel as if they will last forever. They usually change. Try one of these:",
  urgeStrongSteps: [
    "Put distance between you and the bet: leave the room, go outside or hand your phone to someone for a few minutes.",
    "Breathe out slowly, longer than you breathe in. Do it five times.",
    "Start the ten-minute pause again. You can stop it at any time.",
    "If it still feels too much, talk to someone now.",
  ],
  blockIntro:
    "Reclaim cannot block betting sites or MoMo payments for you. These steps can make betting slower and harder to reach:",
  blockSteps: [
    "Delete betting apps and remove saved betting sites and passwords from your browser.",
    "Remove saved MoMo or card details from every betting account.",
    "Ask each betting company you use to close your account or self-exclude you. Look for 'responsible gaming' in the app or contact its support.",
    "The Gaming Commission of Ghana has described a self-exclusion scheme. Ask them how it currently works and which operators it covers. One request may not cover every site.",
    "If your phone has app timers or screen-time settings, use them to limit the browser or apps you bet with.",
    "Mute or leave betting-tip groups and channels.",
  ],
  limitReached:
    "This short plan is designed to stay small. You can clear the session and start again, or talk to someone using Get human help.",
} as const;

// ---------------------------------------------------------------------------
// Safety flow
// ---------------------------------------------------------------------------

export type SafetyCategory = "self_harm" | "danger" | "debt_threat" | "under_18";

export const SAFETY_CONTENT = {
  heading: "Your safety comes first",
  automatedNote:
    "We showed this because of something you wrote, or because you asked for help. Automatic checks can get things wrong in both directions. If you are not safe, please act on this page whatever it says.",
  notMonitored:
    "Reclaim is not an emergency service. Nobody is monitoring this page, so please contact a person directly.",
  immediate: [
    "If you are in immediate danger, or might act on thoughts of harming yourself, contact emergency services now or go to the nearest hospital emergency department or police station.",
    "Tell someone near you what is happening: a family member, friend, neighbour, religious leader or teacher. Ask them to stay with you.",
    "If you can, move away from anything you could use to hurt yourself.",
  ],
  selfHarm:
    "Thoughts of ending your life or hurting yourself are serious, and you deserve support right now. Money and debts can be dealt with later. Your life matters more than any loss.",
  danger:
    "If someone is threatening or hurting you, go somewhere safer if you can, such as a place with other people, and contact the police.",
  debtThreat:
    "Threats or harassment over debts are not something you have to face alone. Keep the messages as evidence, go somewhere safe if you are threatened, and contact the police. Do not borrow more to pay off someone who is threatening you.",
  under18:
    "If you are under 18 and an adult is harming you, or you do not feel safe at home or school, tell a teacher, school counsellor or another adult you trust as soon as you can.",
  continueLabel: "I am safe. Continue to betting support.",
} as const;

export const UNDER_18_CONTENT = {
  heading: "If you are under 18",
  intro:
    "You do not need to share your age or name to use Reclaim. Everything here is for you too. Betting is not something you have to sort out alone.",
  steps: [
    "Talk to an adult you trust: a parent, guardian, older relative, teacher, school counsellor or religious leader.",
    "If betting has left you owing money, tell a trusted adult before the debt grows. You do not have to fix it on your own.",
    "Delete betting apps and step back from groups that push you to bet.",
    "If an adult is pressuring you to bet, harming you, or you feel unsafe, tell a trusted adult or contact the police.",
  ],
  communityNote:
    "The Reclaim Telegram community is for adults, so it is not offered here. A trusted adult or a professional is a better place to start.",
} as const;

// ---------------------------------------------------------------------------
// Telegram community
// ---------------------------------------------------------------------------

export const COMMUNITY_CONTENT = {
  heading: "Join the Reclaim community (optional)",
  body: "Some people find it helps to talk with others who are also trying to stop betting.",
  notes: [
    "The community is on Telegram, a separate service with its own privacy policy.",
    "Other members may be able to see your Telegram name, profile photo and, depending on your settings, your phone number. Check your Telegram privacy settings before joining.",
    "Nothing you typed on Reclaim is sent to Telegram.",
    "Members and volunteers are not counsellors, and replies may not be immediate. For urgent help, use Get human help.",
    "The community is for adults aged 18 and over.",
  ],
  linkLabel: "Open the Reclaim community on Telegram",
} as const;
