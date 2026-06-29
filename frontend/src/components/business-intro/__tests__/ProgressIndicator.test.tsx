import { render, screen } from "@testing-library/react";

import { ProgressIndicator } from "../ProgressIndicator";

describe("ProgressIndicator", () => {
  it("renders the current step out of the total", () => {
    render(<ProgressIndicator currentStep={2} totalSteps={4} />);

    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
  });
});
