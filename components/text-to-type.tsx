'use client'

import clsx from "clsx"

import { useEffect, useState } from "react"

interface TextToTypeProps {
    textToType: string;
    typedText: string;
    errorMap: boolean[];
    isActive: boolean;
}

export const TextToType = ({ textToType, typedText, errorMap, isActive }: TextToTypeProps) => {
    const [words, setWords] = useState<string[][]>([]);

    useEffect(() => {
        // Разбиваем текст на слова и затем на буквы, включая пробелы между словами
        const splitWords = textToType.split(' ').map(word => word.split(''));
        setWords(splitWords);
    }, [textToType]);

    return (
        <div className="text-4xl leading-relaxed pointer-events-none">
            {words.map((word, wordIndex) => {
                const wordStartIndex = words
                    .slice(0, wordIndex)
                    .reduce((acc, w) => acc + w.length + 1, 0); // +1 для учета пробела

                return (
                    <div key={wordIndex} className="inline-block mr-2">
                        {word.map((char, charIndex) => {
                            const globalIndex = wordStartIndex + charIndex;
                            const typedChar = typedText[globalIndex];

                            let color = 'text-neutral-500/60';

                            if (typedChar) {
                                if (typedChar === char) {
                                    color = 'text-green-500';
                                } else if (errorMap[globalIndex]) {
                                    color = 'text-rose-500';
                                }
                            }

                            return (
                                <span key={globalIndex} className="relative">
                                    {/* Отображение курсора перед текущим символом */}
                                    {globalIndex === typedText.length && (
                                        <span
                                            className={clsx(
                                                'absolute -left-1 text-transparent',
                                                isActive && 'text-yellow-400'
                                            )}
                                        >
                                            |
                                        </span>
                                    )}
                                    <span className={color}>
                                        {char}
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
