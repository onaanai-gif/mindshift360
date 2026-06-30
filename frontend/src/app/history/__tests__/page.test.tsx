import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getRecommendationHistory } from "@/lib/api";

import HistoryPage from "../page";

jest.mock("@/lib/api", () => ({
  getRecommendationHistory: jest.fn(),
}));

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
  useSearchParams: () => new URLSearchParams("profileId=7"),
}));

const mockedGetRecommendationHistory = getRecommendationHistory as jest.MockedFunction<
  typeof getRecommendationHistory
>;

beforeEach(() => {
  mockedGetRecommendationHistory.mockReset();
  mockedPush.mockReset();
});

describe("HistoryPage", () => {
  it("shows history items when data loads", async () => {
    mockedGetRecommendationHistory.mockResolvedValueOnce([
      { title: "Make Buying Easier", status: "completed", createdAt: "2024-03-01T10:00:00Z" },
    ]);

    render(<HistoryPage />);

    await waitFor(() =>
      expect(screen.getByText("Make Buying Easier")).toBeInTheDocument(),
    );
    expect(mockedGetRecommendationHistory).toHaveBeenCalledWith(7);
  });

  it("shows empty state when history is empty", async () => {
    mockedGetRecommendationHistory.mockResolvedValueOnce([]);

    render(<HistoryPage />);

    await waitFor(() =>
      expect(
        screen.getByText("You haven't completed any Growth Steps yet."),
      ).toBeInTheDocument(),
    );
  });

  it("shows an error when the request fails", async () => {
    mockedGetRecommendationHistory.mockRejectedValueOnce(new Error("failed"));

    render(<HistoryPage />);

    await waitFor(() =>
      expect(screen.getByText("We couldn't load your history.")).toBeInTheDocument(),
    );
  });

  it("navigates home when Return Home is pressed after an error", async () => {
    mockedGetRecommendationHistory.mockRejectedValueOnce(new Error("failed"));
    const user = userEvent.setup();

    render(<HistoryPage />);

    await waitFor(() =>
      expect(screen.getByText("We couldn't load your history.")).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: "Return Home" }));

    expect(mockedPush).toHaveBeenCalledWith("/");
  });
});
