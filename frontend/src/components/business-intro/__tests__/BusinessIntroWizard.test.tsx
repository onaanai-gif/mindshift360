import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BusinessProfileValidationError, submitBusinessProfile } from "@/lib/api";

import { BusinessIntroWizard } from "../BusinessIntroWizard";

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api");
  return {
    ...actual,
    submitBusinessProfile: jest.fn(),
  };
});

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockedSubmitBusinessProfile = submitBusinessProfile as jest.MockedFunction<
  typeof submitBusinessProfile
>;

beforeEach(() => {
  mockedSubmitBusinessProfile.mockReset();
  mockedPush.mockReset();
});

async function completeFirstThreeSteps() {
  const user = userEvent.setup();

  render(<BusinessIntroWizard />);

  await user.type(screen.getByPlaceholderText("e.g. Acme Bakery"), "Acme Bakery");
  await user.click(screen.getByRole("button", { name: "Continue" }));

  await user.type(screen.getByPlaceholderText("e.g. Bakery"), "Bakery");
  await user.click(screen.getByRole("button", { name: "Continue" }));

  await user.type(screen.getByPlaceholderText("e.g. Lagos"), "Lagos");
  await user.click(screen.getByRole("button", { name: "Continue" }));

  return user;
}

describe("BusinessIntroWizard", () => {
  it("shows a progress indicator that advances with each step", async () => {
    const user = userEvent.setup();
    render(<BusinessIntroWizard />);

    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("e.g. Acme Bakery"), "Acme Bakery");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
  });

  it("blocks advancing past a step when the field is left blank", async () => {
    const user = userEvent.setup();
    render(<BusinessIntroWizard />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Business name is required.")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });

  it("submits the completed profile after selecting a goal and shows the success message", async () => {
    mockedSubmitBusinessProfile.mockResolvedValueOnce({
      id: 42,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });
    const user = await completeFirstThreeSteps();

    await user.click(screen.getByRole("button", { name: "Get More Customers" }));

    await waitFor(() =>
      expect(
        screen.getByText("Welcome to MINDSHIFT360 Business Growth Partner."),
      ).toBeInTheDocument(),
    );

    expect(mockedSubmitBusinessProfile).toHaveBeenCalledWith({
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });
  });

  it("navigates to the business summary page for the saved profile after pressing Continue", async () => {
    mockedSubmitBusinessProfile.mockResolvedValueOnce({
      id: 42,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });
    const user = await completeFirstThreeSteps();

    await user.click(screen.getByRole("button", { name: "Get More Customers" }));
    await waitFor(() =>
      expect(
        screen.getByText("Welcome to MINDSHIFT360 Business Growth Partner."),
      ).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockedPush).toHaveBeenCalledWith("/business/summary/42");
  });

  it("shows a server error message when submission fails", async () => {
    mockedSubmitBusinessProfile.mockRejectedValueOnce(new Error("network error"));
    const user = await completeFirstThreeSteps();

    await user.click(screen.getByRole("button", { name: "Increase Sales" }));

    await waitFor(() =>
      expect(
        screen.getByText("We couldn't save your business profile. Please try again."),
      ).toBeInTheDocument(),
    );
  });

  it("shows field-level validation errors returned by the API", async () => {
    mockedSubmitBusinessProfile.mockRejectedValueOnce(
      new BusinessProfileValidationError({ primaryGoal: "primary_goal is required" }),
    );
    const user = await completeFirstThreeSteps();

    await user.click(screen.getByRole("button", { name: "Organise My Business" }));

    await waitFor(() => expect(screen.getByText("primary_goal is required")).toBeInTheDocument());
  });

  it("disables the goal buttons while the profile is being submitted", async () => {
    let resolveSubmit: (value: {
      id: number;
      businessName: string;
      businessType: string;
      townCity: string;
      primaryGoal: "Get More Customers";
    }) => void = () => {};
    mockedSubmitBusinessProfile.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSubmit = resolve;
      }),
    );
    const user = await completeFirstThreeSteps();

    const goalButton = screen.getByRole("button", { name: "Get More Customers" });
    await user.click(goalButton);

    expect(goalButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase Sales" })).toBeDisabled();

    resolveSubmit({
      id: 42,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });

    await waitFor(() =>
      expect(
        screen.getByText("Welcome to MINDSHIFT360 Business Growth Partner."),
      ).toBeInTheDocument(),
    );
    expect(mockedSubmitBusinessProfile).toHaveBeenCalledTimes(1);
  });
});
