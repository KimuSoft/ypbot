import React from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

const InputContainer = styled.div<{ column?: boolean }>`
    display: flex;
    gap: 10px;
    font-size: 18px;
    align-items: center;
    white-space: nowrap;
    ${({ column }) =>
        column &&
        css`
            align-items: flex-start;
            flex-direction: column;
            width: 100%;
        `}
`

const InputComponent = styled.input`
    padding: 10px;
    background: #202225;
    outline: none;
    color: #fff;
    border: none;
    width: 100%;
`

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<any> & { label?: React.ReactNode; error?: string; column?: boolean; control?: React.ReactNode }>(
    ({ label, column, error, control, ...rest }, ref) => {
        return (
            <Container>
                <InputContainer column={column}>
                    {label && <div>{label}</div>}
                    {control ? control : <InputComponent ref={ref} style={{ flexGrow: 1 }} {...rest} />}
                </InputContainer>
                {error && <div style={{ color: '#ED4245' }}>{error}</div>}
            </Container>
        )
    }
)

export default Input
