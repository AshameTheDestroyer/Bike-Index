import React from "react";
import { useNavigate } from "react-router-dom";

import Button, { ButtonProps } from "./Button";

type LinkButtonProps = ButtonProps & {
    $link: string;
};

export default function LinkButton(props: LinkButtonProps): React.ReactElement {
    const Navigate = useNavigate();

    return (
        <Button
            {...props}
            onClick={_e => Navigate(props.$link)}
        />
    );
}