import React from "react";
import { render } from "react-native-testing-library";

import { AppText } from "../AppText";

it("renders passed text", () => {
    const { getByText, queryByText } = render(<AppText>Hello</AppText>);

    expect(getByText("Hello")).not.toBeNull();
    expect(queryByText("Not Okay")).toBeNull();
});

it("passed props to text component", () => {
    const { getByTestId } = render(<AppText hover="now">Hello</AppText>);

    expect(getByTestId("text").props).toEqual(expect.objectContaining({ hover: "now" }));
});
