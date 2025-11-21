import React from 'react'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'

const About = () => {
    return (
        <Layout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-heading font-bold text-primary mb-6"
                    >
                        Our Story
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg mx-auto text-gray-600"
                    >
                        <p className="mb-6">
                            VelcyFashion was born from a passion for timeless elegance and modern style.
                            We believe that every woman deserves to feel confident and beautiful in what she wears.
                        </p>
                        <p className="mb-6">
                            Our collection is carefully curated to bring you the finest sarees and dresses,
                            blending traditional craftsmanship with contemporary designs. Each piece tells a story
                            of heritage, artistry, and grace.
                        </p>
                        <p>
                            Thank you for choosing VelcyFashion. We are honored to be a part of your journey.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Layout>
    )
}

export default About
