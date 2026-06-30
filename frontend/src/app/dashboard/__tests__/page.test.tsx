import { render, screen, waitFor } from "@testing-library/react";

import { getLatestBusinessProfile, type LatestBusinessProfile } from "@/lib/api";

import DashboardPage from "../page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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
});
