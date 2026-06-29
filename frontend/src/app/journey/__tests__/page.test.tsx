import { render, screen } from "@testing-library/react";

import JourneyPage from "../page";

describe("JourneyPage", () => {
  it("renders the placeholder journey copy", () => {
    render(<JourneyPage />);

    expect(screen.getByText("Your Growth Journey begins here.")).toBeInTheDocument();
    expect(
      screen.getByText("This is where your personalised Growth Steps will appear."),
    ).toBeInTheDocument();
  });
});
