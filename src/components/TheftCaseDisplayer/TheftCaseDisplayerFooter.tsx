import { useContext } from "react";
import styled from "styled-components";

import Slider from "../Slider";
import Button from "../Button";
import { TheftCaseDisplayerContext } from "./TheftCaseDisplayer";

const Footer = styled.footer`
    display: grid;
    grid-template-columns: auto auto 1fr auto auto;
    place-self: center;
    grid-auto-flow: column;
    place-content: center stretch;
    place-items: center stretch;
    gap: 2rem;

    &>[data-is-hidden=true] {
        visibility: hidden;
    }
`;

export default function TheftCaseDisplayerFooter(): React.ReactElement {
    const context = useContext(TheftCaseDisplayerContext);

    if (!context.dataIsLoaded || context.dataIsEmpty) {
        return <></>;
    }

    function PaginationButton(props_: React.HTMLAttributes<HTMLButtonElement> & {
        text: string;
        page: number;
        basePage?: number;
        isOpened?: boolean;
    }) {
        return (
            <Button
                className="pagination-button"

                $width={2}
                $isRounded
                $isPrimary={props_.isOpened}
                data-is-hidden={context.page == props_.basePage}
                data-pagination-index={props_.basePage == null ? props_.page : null}

                onClick={_e => context.UpdatePage(props_.page)}
            >
                {props_.text}
            </Button>
        );
    }

    return (
        <Footer>
            <PaginationButton text="<<" basePage={1} page={1} />
            <PaginationButton text="<" basePage={1} page={context.page - 1} />
            <Slider> {
                new Array(context.totalPageCount)
                    .fill(null)
                    .map((_, i) =>
                        <PaginationButton
                            key={i}
                            className={`pagination-button`}

                            page={i + 1}
                            isOpened={context.page == i + 1}

                            text={(i + 1).toString()}
                        />
                    )
            } </Slider>
            <PaginationButton text=">" basePage={context.totalPageCount} page={context.page + 1} />
            <PaginationButton text=">>" basePage={context.totalPageCount} page={context.totalPageCount} />
        </Footer>
    );
}