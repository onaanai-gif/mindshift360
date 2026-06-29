import { render, screen } from "@testing-library/react";

import { getBusinessProfile } from "@/lib/api";

import BusinessSummaryPage from "../page";

jest.mock("@/lib/api", () => ({
  getBusinessProfile: jest.fn(() => new Promise(() => {})),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("BusinessSummaryPage", () => {
  it("requests the profile for the id in the route params", () => {
    render(<BusinessSummaryPage params={{ id: "7" }} />);

    expect(getBusinessProfile).toHaveBeenCalledWith("7");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
