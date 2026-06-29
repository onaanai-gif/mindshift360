import { render, screen } from "@testing-library/react";

import BusinessIntroPage from "../page";

describe("BusinessIntroPage", () => {
  it("renders the first step of the business introduction wizard", () => {
    render(<BusinessIntroPage />);

    expect(screen.getByText("What's your business name?")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });
});
