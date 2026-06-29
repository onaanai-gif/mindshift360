import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SuccessMessage } from "../SuccessMessage";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

beforeEach(() => {
  mockedPush.mockReset();
});

describe("SuccessMessage", () => {
  it("renders the welcome message and a Continue button", () => {
    render(<SuccessMessage profileId={1} />);

    expect(
      screen.getByText("Welcome to MINDSHIFT360 Business Growth Partner."),
    ).toBeInTheDocument();
    expect(screen.getByText("I've started learning about your business.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("navigates to the business summary page for the given profile id", async () => {
    const user = userEvent.setup();
    render(<SuccessMessage profileId={42} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockedPush).toHaveBeenCalledWith("/business/summary/42");
  });
});
