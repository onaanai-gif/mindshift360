import { render, screen } from "@testing-library/react";

import { SuccessMessage } from "../SuccessMessage";

describe("SuccessMessage", () => {
  it("renders the welcome message and a Continue button", () => {
    render(<SuccessMessage />);

    expect(
      screen.getByText("Welcome to MINDSHIFT360 Business Growth Partner."),
    ).toBeInTheDocument();
    expect(screen.getByText("I've started learning about your business.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
});
