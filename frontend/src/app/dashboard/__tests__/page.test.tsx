import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getLatestBusinessProfile, type LatestBusinessProfile } from "@/lib/api";

import DashboardPage from "../page";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/lib/api", () => ({
  getLatestBusinessProfile: jest.fn(),
}));

const mockedGetLatestBusinessProfile = getLatestBusinessProfile as jest.MockedFunction<
  typeof getLatestBusinessProfile
>;

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

beforeEach(() => {
  mockedGetLatestBusinessProfile.mockReset();
  mockedPush.mockReset();
});

describe("DashboardPage", () => {
  it("renders the Dashboard when a profile is found", async () => {
    mockedGetLatestBusinessProfile.mockResolvedValueOnce(BASE_PROFILE);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Good to see you again, Acme Bakery")).toBeInTheDocument();
    });
  });

  it("renders an error message when no profile is found", async () => {
    mockedGetLatestBusinessProfile.mockResolvedValueOnce(null);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText("We couldn't find your business profile."),
      ).toBeInTheDocument();
    });
  });

  it("navigates home when Return Home is pressed after an error", async () => {
    mockedGetLatestBusinessProfile.mockResolvedValueOnce(null);
    const user = userEvent.setup();

    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText("We couldn't find your business profile."),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "Return Home" }));

    expect(mockedPush).toHaveBeenCalledWith("/");
  });
});
