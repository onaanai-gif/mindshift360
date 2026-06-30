import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { LatestBusinessProfile } from "@/lib/api";

import { Dashboard } from "../Dashboard";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

beforeEach(() => {
  mockedPush.mockReset();
});

const BASE_PROFILE: LatestBusinessProfile = {
  id: 7,
  businessName: "Acme Bakery",
  businessType: "Bakery",
  townCity: "Lagos",
  primaryGoal: "Increase Sales",
  latestRecommendationStatus: null,
  lastUpdated: "2024-01-01T00:00:00Z",
  recommendationsCompleted: 0,
  recommendationsNeedHelp: 0,
  recommendationsLater: 0,
};

describe("Dashboard", () => {
  it("renders the heading and business details", () => {
    render(<Dashboard profile={BASE_PROFILE} />);

    expect(screen.getByText("Good to see you again, Acme Bakery")).toBeInTheDocument();
    expect(screen.getByText("Bakery")).toBeInTheDocument();
    expect(screen.getByText("Lagos")).toBeInTheDocument();
    expect(screen.getByText("Increase Sales")).toBeInTheDocument();
  });

  it("shows the no-recommendation focus message and Start My Growth Journey button", async () => {
    const user = userEvent.setup();

    render(<Dashboard profile={BASE_PROFILE} />);

    expect(screen.getByText("Let's begin your Growth Journey.")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Start My Growth Journey" });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(mockedPush).toHaveBeenCalledWith("/journey?profileId=7&goal=Increase%20Sales");
  });

  it.each([
    ["later", "You chose to continue later.", "Continue Recommendation"],
    [
      "need_help_attempt",
      "Let's continue working on this together.",
      "Continue Recommendation",
    ],
  ])(
    "shows the correct focus message and button for status %s",
    async (status, expectedMessage, buttonLabel) => {
      const user = userEvent.setup();

      render(
        <Dashboard profile={{ ...BASE_PROFILE, latestRecommendationStatus: status }} />,
      );

      expect(screen.getByText(expectedMessage)).toBeInTheDocument();
      const buttons = screen.getAllByRole("button", { name: buttonLabel });
      expect(buttons.length).toBeGreaterThan(0);

      await user.click(buttons[0]);

      expect(mockedPush).toHaveBeenCalledWith("/journey?profileId=7&goal=Increase%20Sales");
    },
  );

  it("shows the completed focus message and navigates to history on View Progress", async () => {
    const user = userEvent.setup();

    render(
      <Dashboard
        profile={{ ...BASE_PROFILE, latestRecommendationStatus: "completed" }}
      />,
    );

    expect(
      screen.getByText("You've completed today's recommendation."),
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole("button", { name: "View Progress" });
    expect(buttons.length).toBeGreaterThan(0);

    await user.click(buttons[0]);

    expect(mockedPush).toHaveBeenCalledWith("/history?profileId=7");
  });

  it("shows the Progress Snapshot card with counts", () => {
    render(
      <Dashboard
        profile={{
          ...BASE_PROFILE,
          recommendationsCompleted: 3,
          recommendationsNeedHelp: 1,
          recommendationsLater: 2,
        }}
      />,
    );

    expect(screen.getByText("Progress Snapshot")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Need Help")).toBeInTheDocument();
    expect(screen.getByText("Later")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows Quick Actions and navigates to journey and history", async () => {
    const user = userEvent.setup();

    render(<Dashboard profile={BASE_PROFILE} />);

    expect(screen.getByText("Quick Actions")).toBeInTheDocument();

    const continueButtons = screen.getAllByRole("button", { name: "Continue Recommendation" });
    await user.click(continueButtons[continueButtons.length - 1]);
    expect(mockedPush).toHaveBeenCalledWith("/journey?profileId=7&goal=Increase%20Sales");

    mockedPush.mockReset();

    const viewProgressButtons = screen.getAllByRole("button", { name: "View Progress" });
    await user.click(viewProgressButtons[viewProgressButtons.length - 1]);
    expect(mockedPush).toHaveBeenCalledWith("/history?profileId=7");
  });

  it("disables the Edit Business Profile button and shows Coming Soon", () => {
    render(<Dashboard profile={BASE_PROFILE} />);

    const button = screen.getByRole("button", { name: "Edit Business Profile (Coming Soon)" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
