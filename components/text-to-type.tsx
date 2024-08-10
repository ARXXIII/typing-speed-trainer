import clsx from "clsx"

interface TextToTypeProps {
    textToType: string
    typedText: string
    errorMap: boolean[]
    isActive: boolean
}

export const TextToType = ({ textToType, typedText, errorMap, isActive }: TextToTypeProps) => {
    const words = textToType.split(' ')

    return (
        <div className="flex flex-wrap gap-x-3 h-56 lg:h-auto text-4xl leading-relaxed pointer-events-none overflow-hidden">

            {words.map((word, wordIndex) => {
                const wordStartIndex = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)

                return (
                    <div key={wordIndex} className="flex tracking-wider shrink-0">

                        {word.split('').map((char, charIndex) => {
                            const globalIndex = wordStartIndex + charIndex
                            const typedChar = typedText[globalIndex]

                            let color = 'text-neutral-500/60'

                            if (typedChar) {
                                if (typedChar === char) {
                                    color = 'text-green-500'
                                } else if (errorMap[globalIndex]) {
                                    color = 'text-rose-500'
                                }
                            }

                            return (
                                <span key={globalIndex} className="relative">

                                    {globalIndex === typedText.length && (
                                        <span
                                            className={clsx(
                                                'absolute -left-1.5 text-transparent transition-colors',
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
                            )
                        })}

                    </div>
                )
            })}

        </div>
    )
}