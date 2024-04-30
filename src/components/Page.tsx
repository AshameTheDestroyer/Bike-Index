import styled from "styled-components";

const Page = styled.section`
    --padding: 4rem;

    min-height: calc(100vh - var(--padding) * 2);
    min-height: calc(100dvh - var(--padding) * 2);

    display: flex;
    flex-direction: column;

    padding: var(--padding);
`;

export default Page;