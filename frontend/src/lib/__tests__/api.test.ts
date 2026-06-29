import { BusinessProfileValidationError, getBusinessProfile, submitBusinessProfile } from "../api";

const VALID_INPUT = {
  businessName: "Acme Bakery",
  businessType: "Bakery",
  townCity: "Lagos",
  primaryGoal: "Get More Customers" as const,
};

describe("submitBusinessProfile", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("posts the profile in snake_case to the API and returns the saved profile", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 7,
        business_name: "Acme Bakery",
        business_type: "Bakery",
        town_city: "Lagos",
        primary_goal: "Get More Customers",
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await submitBusinessProfile(VALID_INPUT);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/business/profile"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          business_name: "Acme Bakery",
          business_type: "Bakery",
          town_city: "Lagos",
          primary_goal: "Get More Customers",
        }),
      }),
    );
    expect(result).toEqual({
      id: 7,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });
  });

  it("throws BusinessProfileValidationError with mapped field errors on a 422 response", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        detail: [{ loc: ["body", "business_name"], msg: "business_name must not be empty" }],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    let caughtError: unknown;
    try {
      await submitBusinessProfile(VALID_INPUT);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(BusinessProfileValidationError);
    expect((caughtError as BusinessProfileValidationError).fieldErrors).toEqual({
      businessName: "business_name must not be empty",
    });
  });

  it("throws a generic error for other non-OK responses", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(submitBusinessProfile(VALID_INPUT)).rejects.toThrow(
      "Something went wrong while saving your business profile.",
    );
  });
});

describe("getBusinessProfile", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches and maps the profile to camelCase", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 7,
        business_name: "Acme Bakery",
        business_type: "Bakery",
        town_city: "Lagos",
        primary_goal: "Get More Customers",
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getBusinessProfile(7);

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/business/profile/7"));
    expect(result).toEqual({
      id: 7,
      businessName: "Acme Bakery",
      businessType: "Bakery",
      townCity: "Lagos",
      primaryGoal: "Get More Customers",
    });
  });

  it("throws when the profile is not found", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(getBusinessProfile(999)).rejects.toThrow(
      "We couldn't find that business profile.",
    );
  });
});
