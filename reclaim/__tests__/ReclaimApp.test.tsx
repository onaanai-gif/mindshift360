import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReclaimApp } from "@/components/ReclaimApp";
import { SessionProvider } from "@/components/SessionProvider";
import { ClearSessionButton } from "@/components/SiteChrome";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
}));

function setup(aiEnabled = false) {
  const fetchSpy = jest.fn();
  global.fetch = fetchSpy as unknown as typeof fetch;
  render(
    <SessionProvider aiEnabled={aiEnabled}>
      <ReclaimApp />
      <ClearSessionButton />
    </SessionProvider>,
  );
  return { user: userEvent.setup(), fetchSpy };
}

describe("Reclaim app", () => {
  it("shows the landing page", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1, name: "Want to stop betting, but finding it hard?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I feel like betting now. Help me pause." })).toBeInTheDocument();
  });

  it("runs the pause experience one step at a time without a form", async () => {
    const { user, fetchSpy } = setup();
    await user.click(screen.getByRole("button", { name: "I feel like betting now. Help me pause." }));
    expect(screen.getByRole("heading", { name: /Close the betting app or website/ })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Done. Next step" }));
    await user.click(screen.getByRole("button", { name: "Start the timer" }));
    expect(screen.getByRole("timer")).toHaveTextContent("10:00");
    await user.click(screen.getByRole("button", { name: "Stop the timer" }));
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Skip this step" }));
    await user.click(screen.getByRole("button", { name: "Done. What next?" }));
    expect(screen.getByRole("heading", { name: "What would help you most right now?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Stop trying to win back my losses." }));
    expect(screen.getByText(/Do not borrow money to bet/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("gives a plan for an empty submission, locally when AI is off", async () => {
    const { user, fetchSpy } = setup(false);
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    expect(screen.getByText(/Your answers stay on this device/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Help me take the next step." }));
    expect(await screen.findByRole("heading", { name: "Your next step" })).toBeInTheDocument();
    expect(screen.getByText(/Live AI was not used|reviewed support steps/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("explains the AI provider before submission when AI is on", async () => {
    const { user } = setup(true);
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    expect(screen.getByText(/sent to Reclaim's server and to an AI provider/)).toBeInTheDocument();
  });

  it("offers a smaller step and adapts follow-ups", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    await user.type(screen.getByLabelText("What is happening?"), "I can't stop");
    await user.click(screen.getByRole("button", { name: "Help me take the next step." }));
    await screen.findByRole("heading", { name: "Your next step" });
    await user.click(screen.getByRole("button", { name: "This feels too difficult." }));
    expect(screen.getByText(/Here is a smaller version/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Help me block access." }));
    expect(screen.getByText(/cannot block betting sites or MoMo payments/)).toBeInTheDocument();
  });

  it("shows the safety flow first for a self-harm disclosure", async () => {
    const { user, fetchSpy } = setup(true);
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    await user.type(screen.getByLabelText("What is happening?"), "I lost everything and I want to die");
    await user.click(screen.getByRole("button", { name: "Help me take the next step." }));
    expect(await screen.findByRole("heading", { level: 1, name: "Your safety comes first" })).toBeInTheDocument();
    expect(screen.getByText(/Automatic checks can get things wrong/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /I am safe/ }));
    expect(screen.getByRole("heading", { name: "Your next step" })).toBeInTheDocument();
  });

  it("points under-18s to a trusted adult", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    await user.click(screen.getByLabelText("I am under 18 (optional)"));
    await user.click(screen.getByRole("button", { name: "Help me take the next step." }));
    await screen.findByRole("heading", { name: "Your next step" });
    expect(screen.getByText("Talk to a trusted adult (optional)")).toBeInTheDocument();
    expect(screen.queryByText(/Open the Reclaim community/)).not.toBeInTheDocument();
  });

  it("clears the session, including typed text", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    await user.type(screen.getByLabelText("What is happening?"), "private words");
    await user.click(screen.getByRole("button", { name: "Help me take the next step." }));
    await screen.findByRole("heading", { name: "Your next step" });
    await user.click(screen.getByRole("button", { name: "Clear this session" }));
    expect(screen.getByRole("heading", { name: "Want to stop betting, but finding it hard?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Help me make a plan." }));
    expect(screen.getByLabelText("What is happening?")).toHaveValue("");
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });
});
