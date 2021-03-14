import React from "react";
import { render } from "react-native-testing-library";

import { AppBoldText } from "../AppBoldText";

it("renders passed text", () => {
    const { getByText, queryByText } = render(<AppBoldText>Hello</AppBoldText>);

    expect(getByText("Hello")).not.toBeNull();
    expect(queryByText("Not Okay")).toBeNull();
});
