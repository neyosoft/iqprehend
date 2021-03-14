import React from "react";
import { fireEvent, render } from "react-native-testing-library";

import { Button } from "../Button";

xit("renders passed text", () => {
    const { getByText, queryByText } = render(<Button label="The button" />);

    expect(getByText("The button")).not.toBeNull();
    expect(queryByText("Not Okay")).toBeNull();
});

it("can be clicked", () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(<Button label="The button" onPress={onPressMock} />);

    fireEvent.press(getByTestId("theButton"));

    expect(onPressMock).toHaveBeenCalled();
});
