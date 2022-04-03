import { motion } from 'framer-motion'
import React from 'react'

const Avatar: React.FC<{ src?: string; size: number }> = ({ src, size }) => {
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (!src) return
        console.log(src)
        setLoading(true)
        const img = new Image()

        img.src = src

        img.onload = () => {
            setLoading(false)
        }

        return () => {
            img.remove()
        }
    }, [src])

    if (!src) {
        return <div />
    }

    return loading ? (
        <div
            style={{
                width: size,
                height: size,
            }}
        />
    ) : (
        <motion.img animate={{ opacity: 1 }} initial={{ opacity: 0 }} width={size} height={size} style={{ borderRadius: size / 2 }} src={src} alt="avatar" />
    )
}

export default Avatar
