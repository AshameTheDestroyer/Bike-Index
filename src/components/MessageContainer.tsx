import styled from "styled-components";

const Container = styled.section`
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    gap: 1rem;
    
    margin: auto;
    padding: 4rem;
    
    border-radius: 10px;
    box-shadow: var(--box-shadow);
    color: var(--background-colour);
    background-color: var(--main-colour);

    &>img {
        width: 5rem;
        height: 5rem;

        filter: invert();
    }
`;

type MessageContainerProps = ComponentProps & {
    src: string;
    alt: string;
    message: string;
};

export default function MessageContainer(props: MessageContainerProps): React.ReactElement {
    return (
        <Container id={props.id} className={props.className}>
            <img src={props.src} alt={props.alt} />
            <p>{props.message}</p>
            {props.children}
        </Container>
    );
}