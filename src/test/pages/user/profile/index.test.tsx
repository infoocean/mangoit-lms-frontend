import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "@/pages/user/profile";

describe("Profile", () => {
  // it("renders the Profile component", () => {
  //   render(<Profile />);
  //   const title = screen.getByText("Profile");
  //   expect(title).toBeInTheDocument();

  // });

  it("Should render submit button", async () => {
    // render(<Profile />);

    // const main = screen.getAllByTestId("step1");
    // expect(main).toHaveClass("useNameFront");
    // expect(main).toHaveTextContent("dff");

    // expect(screen.queryByTestId("step-1")).toBeInTheDocument();
  });
});

//check for submit button
// const button = screen.getByRole("Button", { name: "Update Profile" });
// expect(button).toBeInTheDocument();
// expect(button).not.toBeDisabled();

// expect(screen.queryByTestId("iconbtn")).not.toBeInTheDocument();
// expect(screen.findByText('Update Profile')).toBeInTheDocument()
// expect(screen.getByTestId("iconbtn")).toBeInTheDocument()
// const btn = screen.getByRole("button"); // get the button (pressable)
// fireEvent.click(btn); // click it
