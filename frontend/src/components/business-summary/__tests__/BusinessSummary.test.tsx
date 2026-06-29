import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getBusinessProfile } from "@/lib/api";
import type { BusinessProfile, PrimaryGoal } from "@/types/businessProfile";

import { BusinessSummary } from "../BusinessSummary";

jest.mock("@/lib/api", () => ({
  getBusinessProfile: jest.fn(),
}));

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockedGetBusinessProfile = getBusinessProfile as jest.MockedFunction<
  typeof getBusinessProfile
>;

function profileWithGoal(primaryGoal: PrimaryGoal): BusinessProfile {
  return {
    id: 7,
    businessName: "Acme Bakery",
    businessType: "Bakery",
    townCity: "Lagos",
    primaryGoal,
  };
}

beforeEach(() => {
  mockedGetBusinessProfile.mockReset();
  mockedPush.mockReset();
});

describe("BusinessSummary", () => {
  it("displays the profile fields once loaded", async () => {
    mockedGetBusinessProfile.mockResolvedValueOnce(profileWithGoal("Get More Customers"));

    render(<BusinessSummary profileId="7" />);

    await waitFor(() => expect(screen.getByText("Acme Bakery")).toBeInTheDocument());
    expect(screen.getByText("Bakery")).toBeInTheDocument();
    expect(screen.getByText("Lagos")).toBeInTheDocument();
    expect(screen.getByText("Get More Customers")).toBeInTheDocument();
  });

  it.each<[PrimaryGoal, string]>([
    [
      "Get More Customers",
      "Our first priority will be helping more people discover your business.",
    ],
    [
      "Increase Sales",
      "Our first priority will be helping you convert more customer interest into sales.",
    ],
    [
      "Improve Customer Service",
      "Our first priority will be helping you create a customer experience that people remember and recommend.",
    ],
    [
      "Organise My Business",
      "Our first priority will be helping you build stronger business systems and routines.",
    ],
  ])("shows the correct summary for %s", async (goal, expectedSummary) => {
    mockedGetBusinessProfile.mockResolvedValueOnce(profileWithGoal(goal));

    render(<BusinessSummary profileId="7" />);

    await waitFor(() => expect(screen.getByText(expectedSummary)).toBeInTheDocument());
  });

  it("shows an error message when the profile cannot be found", async () => {
    mockedGetBusinessProfile.mockRejectedValueOnce(new Error("not found"));

    render(<BusinessSummary profileId="999" />);

    await waitFor(() =>
      expect(screen.getByText("We couldn't find that business profile.")).toBeInTheDocument(),
    );
  });

  it("navigates to /journey with the profile id and goal when Start My Growth Journey is pressed", async () => {
    mockedGetBusinessProfile.mockResolvedValueOnce(profileWithGoal("Increase Sales"));
    const user = userEvent.setup();

    render(<BusinessSummary profileId="7" />);

    const button = await screen.findByRole("button", { name: "Start My Growth Journey" });
    await user.click(button);

    expect(mockedPush).toHaveBeenCalledWith("/journey?profileId=7&goal=Increase%20Sales");
  });
});
