import { render, screen, waitFor } from "@testing-library/react";

import { getLatestBusinessProfile } from "@/lib/api";

import HomePage from "../page";

jest.mock("@/lib/api", () => ({
  getLatestBusinessProfile: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockedGetLatestBusinessProfile = getLatestBusinessProfile as jest.MockedFunction<
  typeof getLatestBusinessProfile
>;

beforeEach(() => {
  mockedGetLatestBusinessProfile.mockReset();
});

describe("HomePage", () => {
  it("shows the Business Introduction flow when no profile exists", async () => {
    mockedGetLatestBusinessProfile.mockResolvedValueOnce(null);

    render(<HomePage />);

    expect(await screen.findByPlaceholderText("e.g. Acme Bakery")).toBeInTheDocument();
  });

  it("shows the Welcome Back page when a profile exists", async () => {
    mockedGetLatestBusinessProfile.mockResolvedValueOnce({
      id: 7,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Increase Sales",
      latestRecommendationStatus: "completed",
      lastUpdated: "2024-01-01T00:00:00Z",
      recommendationsCompleted: 1,
      recommendationsNeedHelp: 0,
      recommendationsLater: 0,
    });

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText("Welcome back, Acme Bakery")).toBeInTheDocument(),
    );
  });
});
