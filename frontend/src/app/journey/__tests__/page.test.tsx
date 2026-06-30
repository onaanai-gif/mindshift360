import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import JourneyPage from "../page";

const mockedSearchParamsGet = jest.fn();
const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
  useSearchParams: () => ({ get: mockedSearchParamsGet }),
}));

beforeEach(() => {
  mockedSearchParamsGet.mockReset();
  mockedPush.mockReset();
});

function setSearchParams(profileId: string | null, goal: string | null) {
  mockedSearchParamsGet.mockImplementation((key: string) => {
    if (key === "profileId") return profileId;
    if (key === "goal") return goal;
    return null;
  });
}

describe("JourneyPage", () => {
  it("renders the daily recommendation for the goal in the URL", () => {
    setSearchParams("7", "Get More Customers");

    render(<JourneyPage />);

    expect(screen.getByText("Help More People Find Your Business")).toBeInTheDocument();
  });

  it("shows an error when the profile id or goal is missing", () => {
    setSearchParams(null, null);

    render(<JourneyPage />);

    expect(screen.getByText("We couldn't find your business profile.")).toBeInTheDocument();
  });

  it("navigates home when Return Home is pressed after an error", async () => {
    setSearchParams(null, null);
    const user = userEvent.setup();

    render(<JourneyPage />);
    await user.click(screen.getByRole("button", { name: "Return Home" }));

    expect(mockedPush).toHaveBeenCalledWith("/");
  });
});
