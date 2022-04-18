import React from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

class Portal extends React.Component<any, any> {
    el: HTMLDivElement

    constructor(props: any) {
        super(props)
        this.el = document.createElement('div')
    }

    componentDidMount() {
        document.body.appendChild(this.el)
    }

    componentWillUnmount() {
        document.body.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

const Backdrop: React.FC<{ open?: boolean; children: React.ReactNode | React.FC<{ close: () => void }>; button?: React.ReactNode }> = ({ children, open, button }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

    return (
        <>
            <Portal>
                <AnimatePresence>
                    {(open ?? uncontrolledOpen) && (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                type: 'tween',
                            }}
                        >
                            <motion.div
                                initial={{
                                    translateX: '-50%',
                                    translateY: '-50%',
                                }}
                                animate={{
                                    transition: {
                                        type: 'spring',
                                        stiffness: 200,
                                    },
                                }}
                                exit={{
                                    transition: {
                                        type: 'spring',
                                        stiffness: 100,
                                    },
                                }}
                                style={{
                                    position: 'fixed',
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%)`,
                                    zIndex: 9999,
                                }}
                            >
                                {typeof children === 'function'
                                    ? children({
                                          close: () => {
                                              if (close) return close()
                                              setUncontrolledOpen(false)
                                          },
                                      })
                                    : children}
                            </motion.div>
                            <motion.div
                                style={{
                                    position: 'fixed',
                                    background: `rgba(0, 0, 0, 0.5)`,
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 9998,
                                }}
                                onClick={() => {
                                    setUncontrolledOpen(false)
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>
            {button && <div onClick={() => setUncontrolledOpen(true)}>{button}</div>}
        </>
    )
}

export default Backdrop
