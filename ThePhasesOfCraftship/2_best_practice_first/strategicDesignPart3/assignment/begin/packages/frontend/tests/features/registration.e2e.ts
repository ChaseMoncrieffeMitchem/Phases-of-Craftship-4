import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "path";

const feature = loadFeature(
  path.join(__dirname, "../../../shared/tests/features/registration.feature")
);

defineFeature(feature, (test) => {
  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserResponse: any = {};
    let addToEmailListResponse: any = {};
    let createUserInput: CreateUserInput

    given("I am a new user", () => {
        createUserInput = createUserInputBuilder()
        .withRandomDetails()
        .build()
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await request(app).post("/users/new").send(createUserCommand)

        addToEmailListResponse = await request(app).post("/marketing/new").send({ email: createUserCommand.email})
      }
    );

    then("I should be granted access to my account", () => {
      const { data } = createUserResponse.body

      expect(createUserResponse).toBe(201);
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(user.email);
      expect(data!.firstName).toEqual(user.firstName);
      expect(data!.lastName).toEqual(user.lastName);
      expect(data!.username).toEqual(user.username);
    });

    and("I should expect to receive marketing emails", () => {
      expect(addToEmailListResponse).toBe(201);
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when(
      "I register with valid account details declining marketing emails",
      () => {}
    );

    then("I should be granted access to my account", () => {});

    and("I should not expect to receive marketing emails", () => {});
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when("I register with invalid account details", () => {});

    then(
      "I should see an error notifying me that my input is invalid",
      () => {}
    );

    and("I should not have been sent access to account details", () => {});
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given("a set of users already created accounts", (table) => {});

    when("new users attempt to register with those emails", () => {});

    then(
      "they should see an error notifying them that the account already exists",
      () => {}
    );

    and("they should not have been sent access to account details", () => {});
  });

  test("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {}
    );

    when(
      "new users attempt to register with already taken usernames",
      (table) => {}
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {}
    );

    and("they should not have been sent access to account details", () => {});
  });
});
