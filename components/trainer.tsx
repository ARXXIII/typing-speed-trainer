'use client'

import { Controls } from './controls'
import { wordBank } from '@/constants'
import { TypingArea } from './typing-area'
import { TextToType } from './text-to-type'
import { useState, useEffect, useRef } from 'react'
import { FaArrowRotateRight } from 'react-icons/fa6'
import { MdErrorOutline, MdOutlineSpeed } from 'react-icons/md'

// Функция для генерации текста, который нужно будет напечатать
const generateText = (wordCount: number) => {
    let textArray = []

    for (let i = 0; i < wordCount; i++) {
        const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)]
        textArray.push(randomWord)
    }

    return textArray.join(' ')
}

export const Trainer = () => {
    const [wordCount, setWordCount] = useState(10)                                              // Количество слов для тренировки
    const [textToType, setTextToType] = useState(generateText(wordCount))                       // Текст для печати
    const [typedText, setTypedText] = useState('')                                              // Текст, введенный пользователем
    const [errors, setErrors] = useState(0)                                                     // Количество ошибок
    const [errorMap, setErrorMap] = useState<boolean[]>(Array(textToType.length).fill(false))   // Карта ошибок
    const [startTime, setStartTime] = useState<Date | null>(null)                               // Время начала печати
    const [endTime, setEndTime] = useState<Date | null>(null)                                   // Время окончания печати
    const [isActive, setIsActive] = useState(false)                                             // Активен ли тренажер
    const [isTextVisible, setIsTextVisible] = useState(false)                                   // Виден ли текст для печати

    // Рефы для DOM-элементов
    const typingRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Эффект для обновления текста при изменении длины текста или количества слов
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

    // Эффект для обработки начала и окончания печати
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

    // Функция для обработки ввода текста
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

    // Функция для вычисления скорости печати в словах в минуту
    const calculateWPM = () => {
        if (!startTime || !endTime) return 0

        const timeInMinutes = (endTime.getTime() - startTime.getTime()) / 60000
        const wordsTyped = textToType.split(' ').length

        return Math.round(wordsTyped / timeInMinutes)
    }

    // Функция для перезапуска тренировки
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

    // Функция для активации поля ввода
    const handleActivateTyping = () => {
        setIsActive(true)

        if (typingRef.current) {
            typingRef.current.contentEditable = "true"
            typingRef.current.focus()
        }
    }

    // Функция для обработки кликов вне тренажера (деактивация)
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setStartTime(null)
            setEndTime(new Date())
            setIsActive(false)
        }
    }

    // Эффект для отслеживания кликов вне компонента
    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center space-y-6 h-full">
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
                    <p className='text-neutral-400'>{errors}</p>
                </div>
                <Controls
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                    onRestart={handleRestart}
                />
            </div>
            <div className={`relative w-full ${isTextVisible ? 'fade-in' : ''}`}>

                {endTime &&
                    <div onClick={handleRestart} className='flex justify-center items-center absolute p-3 w-full h-full text-neutral-400 rounded-lg backdrop-blur bg-zinc-900/60 duration-200 ease-in z-10'>Check the results</div>
                }

                <div onClick={handleActivateTyping}>
                    <TextToType
                        textToType={textToType}
                        typedText={typedText}
                        errorMap={errorMap}
                        isActive={isActive}
                    />
                </div>
                <TypingArea
                    typingRef={typingRef}
                    onInput={handleInput}
                />
            </div>
            <button onClick={handleRestart} className="absolute bottom-24 lg:bottom-48 text-neutral-500/60 hover:text-neutral-400">
                <FaArrowRotateRight />
            </button>
        </div>
    )
}
