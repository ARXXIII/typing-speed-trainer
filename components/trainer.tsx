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
};

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
                    newErrors++;

                    newErrorMap[i] = true;
                }
            }
        }

        setErrors(errors + newErrors)
        setErrorMap(newErrorMap)

        if (value.length >= textToType.length) {
            setEndTime(new Date())

            if (typingRef.current) {
                typingRef.current.contentEditable = "false"
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
            typingRef.current.contentEditable = "false"
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
            <div className='flex justify-between lg:justify-center gap-x-6 lg:gap-x-12 absolute top-24 lg:top-48 px-3 w-full z-50'>
                <div className='grid grid-cols-2 gap-x-6 lg:gap-x-12'>
                    <div className='flex gap-x-6 items-center p-3 text-center text-neutral-500/60 rounded-lg bg-zinc-800/30'>
                        <div className='flex items-center gap-x-1.5'>
                            <MdOutlineSpeed className='text-green-500 size-7' />
                            <p className='hidden md:block'>WPM</p>
                        </div>
                        <div className="hidden lg:block w-12 h-0.5 rounded-full bg-neutral-500/60" />
                        <p className='text-neutral-400'>{endTime ? calculateWPM() : 0}</p>
                    </div>
                    <div className='flex gap-x-6 items-center p-3 text-center text-neutral-500/60 rounded-lg bg-zinc-800/30'>
                        <div className='flex items-center gap-x-1.5'>
                            <MdErrorOutline className='text-rose-500 size-7' />
                            <p className='hidden md:block'>Errors</p>
                        </div>
                        <div className="hidden lg:block w-12 h-0.5 rounded-full bg-neutral-500/60" />
                        <p className='text-neutral-400'>{endTime ? errors : 0}</p>
                    </div>
                </div>
                <Controls
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                    onRestart={handleRestart}
                />
            </div>
            <div className={`relative w-full ${isTextVisible ? 'fade-in' : ''}`} onClick={handleActivateTyping}>
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
