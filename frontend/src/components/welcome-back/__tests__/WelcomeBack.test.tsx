import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { LatestBusinessProfile } from "@/lib/api";

import { WelcomeBack } from "../WelcomeBack";

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
};

describe("WelcomeBack", () => {
  it("renders the heading and subheading", () => {
    render(<WelcomeBack profile={BASE_PROFILE} />);

    expect(screen.getByText("Welcome back, Acme Bakery")).toBeInTheDocument();
    expect(screen.getByText("Let's continue growing your business.")).toBeInTheDocument();
  });

  it("displays the business profile details", () => {
    render(<WelcomeBack profile={BASE_PROFILE} />);

    expect(screen.getByText("Acme Bakery")).toBeInTheDocument();
    expect(screen.getByText("Increase Sales")).toBeInTheDocument();
    expect(screen.getByText("Not started")).toBeInTheDocument();
  });

  it("shows Start My Growth Journey and no-recommendation message when no status exists", () => {
    render(<WelcomeBack profile={BASE_PROFILE} />);

    expect(
      screen.getByRole("button", { name: "Start My Growth Journey" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You're ready to begin your Growth Journey."),
    ).toBeInTheDocument();
  });

  it.each([
    ["completed", "Great work. You completed your last recommendation."],
    ["later", "You chose to continue later. Let's pick up where you stopped."],
    ["need_help_attempt", "You asked for help last time. Let's continue together."],
  ])("shows the correct message for status %s", (status, expectedMessage) => {
    render(
      <WelcomeBack profile={{ ...BASE_PROFILE, latestRecommendationStatus: status }} />,
    );

    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue My Journey" })).toBeInTheDocument();
  });

  it("navigates to the journey page when Continue My Journey is clicked", async () => {
    const user = userEvent.setup();

    render(
      <WelcomeBack
        profile={{ ...BASE_PROFILE, latestRecommendationStatus: "completed" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Continue My Journey" }));

    expect(mockedPush).toHaveBeenCalledWith(
      "/journey?profileId=7&goal=Increase%20Sales",
    );
  });

  it("navigates to the journey page when Start My Growth Journey is clicked", async () => {
    const user = userEvent.setup();

    render(<WelcomeBack profile={BASE_PROFILE} />);

    await user.click(screen.getByRole("button", { name: "Start My Growth Journey" }));

    expect(mockedPush).toHaveBeenCalledWith(
      "/journey?profileId=7&goal=Increase%20Sales",
    );
  });
});
