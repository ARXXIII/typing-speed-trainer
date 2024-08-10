'use client'

import { Controls } from './controls'
import { wordBank } from '@/constants'
import { TypingArea } from './typing-area'
import { TextToType } from './text-to-type'
import { useState, useEffect, useRef } from 'react'
import { FaArrowRotateRight } from 'react-icons/fa6'
import { MdErrorOutline, MdOutlineSpeed } from 'react-icons/md'

const generateText = (wordCount: number) => {
    let textArray = []

    for (let i = 0; i < wordCount; i++) {
        const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)]
        textArray.push(randomWord)
    }

    return textArray.join(' ')
}

export const Trainer = () => {
    const [wordCount, setWordCount] = useState(10)
    const [textToType, setTextToType] = useState(generateText(wordCount))
    const [typedText, setTypedText] = useState('')
    const [errors, setErrors] = useState(0)
    const [errorMap, setErrorMap] = useState<boolean[]>(Array(textToType.length).fill(false))
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [endTime, setEndTime] = useState<Date | null>(null)
    const [isActive, setIsActive] = useState(false)
    const [isTextVisible, setIsTextVisible] = useState(false)

    const typingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTextToType(generateText(wordCount))
        setTypedText('')
        setErrors(0)
        setErrorMap(Array(textToType.length).fill(false))
        setStartTime(null)
        setEndTime(null)

        if (typingRef.current) {
            typingRef.current.innerText = ''
            typingRef.current.contentEditable = "true"
        }
    }, [textToType.length, wordCount])

    useEffect(() => {
        if (typedText.length === 1 && !startTime) {
            setStartTime(new Date())
        }

        if (typedText === textToType) {
            setEndTime(new Date())

            if (typingRef.current) {
                typingRef.current.contentEditable = "false"
                typingRef.current.blur()
            }
        }
    }, [startTime, textToType, typedText])

    const handleInput = (value: string) => {
        let newErrors = 0
        const newErrorMap = [...errorMap]

        setTypedText(value)

        for (let i = 0; i < value.length; i++) {
            if (value[i] !== textToType[i]) {
                if (!newErrorMap[i]) {
                    newErrors++
                    newErrorMap[i] = true
                }
            }
        }

        setErrors(errors + newErrors)
        setErrorMap(newErrorMap)

        if (value.length >= textToType.length) {
            setEndTime(new Date())

            if (typingRef.current) {
                typingRef.current.contentEditable = "false"
                typingRef.current.blur()
            }
        }
    }

    const calculateWPM = () => {
        if (!startTime || !endTime) return 0

        const timeInMinutes = (endTime.getTime() - startTime.getTime()) / 60000
        const wordsTyped = textToType.split(' ').length

        return Math.round(wordsTyped / timeInMinutes)
    }

    const handleRestart = () => {
        setTypedText('')
        setErrors(0)
        setErrorMap(Array(textToType.length).fill(false))
        setStartTime(null)
        setEndTime(null)
        setIsActive(false)
        setTextToType(generateText(wordCount))

        setTimeout(() => {
            setIsTextVisible(false)
        }, 1000, setIsTextVisible(true))

        if (typingRef.current) {
            typingRef.current.innerText = ''
            typingRef.current.contentEditable = "true"
        }
    }

    const handleActivateTyping = () => {
        if (!isActive) {
            setIsActive(true)

            if (typingRef.current) {
                typingRef.current.contentEditable = "true"
                typingRef.current.focus()
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6 h-full">
            <div className='grid grid-cols-3 gap-x-6 lg:gap-x-12 absolute top-24 lg:top-48 px-3 z-50'>
                <div className='flex justify-between items-center gap-x-6 p-3 text-center text-neutral-500/60 rounded-lg bg-zinc-800/30'>
                    <div className='flex items-center gap-x-1.5'>
                        <MdOutlineSpeed className='text-green-500 size-7' />
                        <p className='hidden md:block'>wpm</p>
                    </div>
                    <p className='text-neutral-400'>{endTime ? calculateWPM() : 0}</p>
                </div>
                <div className='flex justify-between items-center gap-x-6 p-3 text-center text-neutral-500/60 rounded-lg bg-zinc-800/30'>
                    <div className='flex items-center gap-x-1.5'>
                        <MdErrorOutline className='text-rose-500 size-7' />
                        <p className='hidden md:block'>errors</p>
                    </div>
                    <p className='text-neutral-400'>{endTime ? errors : 0}</p>
                </div>
                <Controls
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                    onRestart={handleRestart}
                />
            </div>
            <div onClick={handleActivateTyping} className={`relative w-full ${isTextVisible ? 'fade-in' : ''}`}>

                {endTime &&
                    <h1 className='flex justify-center items-center absolute p-3 w-full h-full text-neutral-400 rounded-lg backdrop-blur bg-zinc-900/60 duration-200 ease-in z-10'>
                        Check the results
                    </h1>
                }

                <TextToType
                    textToType={textToType}
                    typedText={typedText}
                    errorMap={errorMap}
                    isActive={isActive}
                />
                <TypingArea
                    typingRef={typingRef}
                    onInput={handleInput}
                />
            </div>
            <button onClick={handleRestart} className="absolute bottom-24 lg:bottom-48 text-neutral-500/60 hover:text-neutral-400">
                <FaArrowRotateRight />
            </button>
        </div>
    );
};
