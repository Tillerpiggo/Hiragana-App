"use client";

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden p-4 bg-gray-50">
      {/* Simple, subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0 bg-grid-slate-400/[0.2] bg-[size:20px_20px]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl z-10 flex flex-col items-center">
        {/* Simple, bold title */}
        <motion.div
          className="mb-16 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-center text-indigo-700">
            Learn with Tempo
          </h1>
        </motion.div>

        {/* Three language options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Link href="/hiragana" className="w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <div className="w-full h-40 md:h-52 text-4xl font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md border-none inline-flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-7xl mb-2">ひ</span>
                  <span>Hiragana</span>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/katakana" className="w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.1 }
              }}
              className="h-full"
            >
              <div className="w-full h-40 md:h-52 text-4xl font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md border-none inline-flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-7xl mb-2">カ</span>
                  <span>Katakana</span>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/russian" className="w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2 }
              }}
              className="h-full"
            >
              <div className="w-full h-40 md:h-52 text-4xl font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md border-none inline-flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-7xl mb-2">Б</span>
                  <span>Russian</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
