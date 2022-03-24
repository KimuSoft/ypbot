import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
    return (
        <motion.div exit={{ opacity: 0 }} className="w-full h-full flex justify-center items-center fixed left-0 top-0">
            <ThreeDots color="#fff" />
        </motion.div>
    )
}

export default LoadingScreen
