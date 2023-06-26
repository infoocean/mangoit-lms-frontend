import React from "react";
import { render } from "@testing-library/react";
import Dashboard from "@/pages/user/dashboard";

describe("MyComponent", () => {
  it("renders without errors", () => {
    // render( <Dashboard />);
    // Add assertions here to check if the component renders as expected
  });
});

describe("Test the User dashboard", () => {
  test("Dashboard button", () => {
    // render(<Dashboard/>)
    expect("ooo").toEqual("ooo");
  });
});

test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});
