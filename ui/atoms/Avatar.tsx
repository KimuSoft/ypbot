import { motion } from 'framer-motion'
import React from 'react'

const Avatar: React.FC<{ src?: string; size: number; name?: string }> = ({ src, size, name }) => {
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
        return (
            <div
                style={{
                    width: size,
                    height: size,
                }}
                className="bg-stone-900 rounded-full flex items-center justify-center"
            >
                {name?.[0]}
            </div>
        )
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
