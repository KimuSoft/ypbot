import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

const InputContainer = styled.div`
    display: flex;
    gap: 10px;
    font-size: 18px;
    align-items: center;
    white-space: nowrap;
`

const InputComponent = styled.input`
    padding: 10px;
    background: #202225;
    outline: none;
    color: #fff;
    border: none;
`

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<any> & { label?: React.ReactNode; error?: string }>(({ label, error, ...rest }, ref) => {
    return (
        <Container>
            <InputContainer>
                {label && <div>{label}</div>}
                <InputComponent ref={ref} style={{ flexGrow: 1 }} {...rest} />
            </InputContainer>
            {error && <div style={{ color: '#ED4245' }}>{error}</div>}
        </Container>
    )
})

export default Input
