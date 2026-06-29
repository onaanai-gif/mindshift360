import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecommendationHistoryItem } from "@/lib/api";

import { RecommendationHistory } from "../RecommendationHistory";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

beforeEach(() => {
  mockedPush.mockReset();
});

const ITEMS: RecommendationHistoryItem[] = [
  { title: "Make Buying Easier", status: "completed", createdAt: "2024-03-01T10:00:00Z" },
  {
    title: "Help More People Find Your Business",
    status: "need_help_attempt",
    createdAt: "2024-02-01T10:00:00Z",
  },
  { title: "Organise Your Daily Work", status: "later", createdAt: "2024-01-01T10:00:00Z" },
];

describe("RecommendationHistory", () => {
  it("renders the heading", () => {
    render(<RecommendationHistory items={[]} />);

    expect(screen.getByText("Your Growth Journey")).toBeInTheDocument();
  });

  it("shows empty state when there are no items", () => {
    render(<RecommendationHistory items={[]} />);

    expect(
      screen.getByText("You haven't completed any Growth Steps yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Every small action moves your business forward."),
    ).toBeInTheDocument();
  });

  it("renders all history items", () => {
    render(<RecommendationHistory items={ITEMS} />);

    expect(screen.getByText("Make Buying Easier")).toBeInTheDocument();
    expect(screen.getByText("Help More People Find Your Business")).toBeInTheDocument();
    expect(screen.getByText("Organise Your Daily Work")).toBeInTheDocument();
  });

  it("shows green Completed badge for completed status", () => {
    render(<RecommendationHistory items={[ITEMS[0]]} />);

    const badge = screen.getByText("Completed");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("green");
  });

  it("shows amber Need Help badge for need_help_attempt status", () => {
    render(<RecommendationHistory items={[ITEMS[1]]} />);

    const badge = screen.getByText("Need Help");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("amber");
  });

  it("shows grey Later badge for later status", () => {
    render(<RecommendationHistory items={[ITEMS[2]]} />);

    const badge = screen.getByText("Later");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("gray");
  });

  it("displays items in the order provided (newest first)", () => {
    render(<RecommendationHistory items={ITEMS} />);

    const titles = screen
      .getAllByRole("paragraph")
      .map((el) => el.textContent)
      .filter(Boolean);

    const makeIndex = titles.findIndex((t) => t?.includes("Make Buying Easier"));
    const helpIndex = titles.findIndex((t) =>
      t?.includes("Help More People Find Your Business"),
    );
    expect(makeIndex).toBeLessThan(helpIndex);
  });

  it("navigates home when Return Home is clicked", async () => {
    const user = userEvent.setup();

    render(<RecommendationHistory items={[]} />);

    await user.click(screen.getByRole("button", { name: "Return Home" }));

    expect(mockedPush).toHaveBeenCalledWith("/");
  });
});
