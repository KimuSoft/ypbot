import React from 'react'
import Backdrop from '../molecules/Backdrop'
import { ModalContainer } from '../atoms/ModalContainer'

const Modal: React.FC<{ open?: boolean; button?: React.ReactNode }> = ({ open, button, children }) => {
    return (
        <Backdrop open={open} button={button}>
            {() => {
                return <ModalContainer>{children}</ModalContainer>
            }}
        </Backdrop>
    )
}

export default Modal
