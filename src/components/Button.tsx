import styled from "styled-components";

const Button = styled.button<{
    $width?: number;
    $isPrimary?: boolean;
    $isRounded?: boolean;
}>`
    display: flex;
    place-content: center;
    place-items: center;

    ${props =>
        props.$isRounded ? "aspect-ratio: 1;" : ""
    }

    ${props =>
        props.$width != null ?
            `width: ${props.$width}rem;` : ""
    }

    padding: ${props =>
        props.$isRounded ? "1rem" : "1rem 2rem"
    };

    border-radius: ${props =>
        props.$isRounded ? "100%" : "10px"
    };
    color: ${props =>
        props.$isPrimary ? "var(--background-colour)" : "var(--fore-darker-colour)"
    };
    background-color: ${props =>
        props.$isPrimary ? "var(--main-colour)" : "var(--background-colour)"
    };
    border: 2px solid var(--main-colour);
    box-shadow: 0px 1px 3px 1px var(--half-transparent);

    cursor: pointer;

    transition: 
        transform 250ms, 
        background-color 250ms,
        color 250ms,
        filter 250ms;

    &:is(:hover, :focus-visible) {
        transform: scale(1.02);

        color: var(--background-colour);
        background-color: var(--main-colour);
        filter: brightness(120%);
    }
`;

export default Button;