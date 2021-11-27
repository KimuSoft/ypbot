import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div<{ show: boolean }>`
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    transition: all 0.2s ease;
    opacity: ${(props) => (props.show ? 1 : 0)};
    visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: #36393f;
    width: 100%;
`

const Title = styled.div`
    padding: 20px;
    background: #202225;
    font-size: 20px;
    font-weight: 800;
`

const Content = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    padding: 10px;
    background: #202225;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`

const Modal: React.FC<{ open: boolean; title?: React.ReactNode; width?: string; footer?: React.ReactNode }> = ({ children, open, title, width, footer }) => {
    return (
        <Overlay show={open}>
            <Container style={{ maxWidth: width || 300 }}>
                {title && <Title>{title}</Title>}
                <Content>{children}</Content>
                <Footer>{footer}</Footer>
            </Container>
        </Overlay>
    )
}

export default Modal
