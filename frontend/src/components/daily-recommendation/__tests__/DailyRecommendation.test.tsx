import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { submitRecommendationProgress } from "@/lib/api";
import type { PrimaryGoal } from "@/types/businessProfile";

import { DailyRecommendation } from "../DailyRecommendation";

jest.mock("@/lib/api", () => ({
  submitRecommendationProgress: jest.fn(),
}));

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockedSubmitRecommendationProgress = submitRecommendationProgress as jest.MockedFunction<
  typeof submitRecommendationProgress
>;

beforeEach(() => {
  mockedSubmitRecommendationProgress.mockReset();
  mockedPush.mockReset();
});

describe("DailyRecommendation", () => {
  it.each<[PrimaryGoal, string]>([
    ["Get More Customers", "Help More People Find Your Business"],
    ["Increase Sales", "Make Buying Easier"],
    ["Improve Customer Service", "Improve Customer Experience"],
    ["Organise My Business", "Organise Your Daily Work"],
  ])("shows the correct recommendation for %s", (goal, expectedTitle) => {
    render(<DailyRecommendation businessProfileId={7} primaryGoal={goal} />);

    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it("saves a completed status and shows the completed confirmation", async () => {
    mockedSubmitRecommendationProgress.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<DailyRecommendation businessProfileId={7} primaryGoal="Get More Customers" />);
    await user.click(screen.getByRole("button", { name: "I've Completed This" }));

    expect(mockedSubmitRecommendationProgress).toHaveBeenCalledWith(
      7,
      "get_more_customers",
      "completed",
    );
    await waitFor(() => expect(screen.getByText("Excellent.")).toBeInTheDocument());
    expect(screen.getByText("Thank you for taking action today.")).toBeInTheDocument();
  });

  it("saves a need_help status and shows the need help confirmation", async () => {
    mockedSubmitRecommendationProgress.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<DailyRecommendation businessProfileId={7} primaryGoal="Increase Sales" />);
    await user.click(screen.getByRole("button", { name: "I Need Help" }));

    expect(mockedSubmitRecommendationProgress).toHaveBeenCalledWith(
      7,
      "increase_sales",
      "need_help",
    );
    await waitFor(() => expect(screen.getByText("That's completely fine.")).toBeInTheDocument());
  });

  it("saves a later status and shows the later confirmation", async () => {
    mockedSubmitRecommendationProgress.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<DailyRecommendation businessProfileId={7} primaryGoal="Organise My Business" />);
    await user.click(screen.getByRole("button", { name: "I'll Do This Later" }));

    expect(mockedSubmitRecommendationProgress).toHaveBeenCalledWith(
      7,
      "organise_my_business",
      "later",
    );
    await waitFor(() => expect(screen.getByText("No problem.")).toBeInTheDocument());
  });

  it("navigates home after a confirmation is shown", async () => {
    mockedSubmitRecommendationProgress.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<DailyRecommendation businessProfileId={7} primaryGoal="Get More Customers" />);
    await user.click(screen.getByRole("button", { name: "I've Completed This" }));

    const returnHomeButton = await screen.findByRole("button", { name: "Return Home" });
    await user.click(returnHomeButton);

    expect(mockedPush).toHaveBeenCalledWith("/");
  });

  it("shows an error message when saving fails", async () => {
    mockedSubmitRecommendationProgress.mockRejectedValueOnce(new Error("failed"));
    const user = userEvent.setup();

    render(<DailyRecommendation businessProfileId={7} primaryGoal="Get More Customers" />);
    await user.click(screen.getByRole("button", { name: "I've Completed This" }));

    await waitFor(() =>
      expect(
        screen.getByText("Something went wrong while saving your selection."),
      ).toBeInTheDocument(),
    );
  });
});
