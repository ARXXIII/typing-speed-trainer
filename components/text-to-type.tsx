import clsx from "clsx"

interface TextDisplayProps {
    textToType: string
    typedText: string
    errorMap: boolean[]
    isActive: boolean;
}

export const TextToType = ({ textToType, typedText, errorMap, isActive }: TextDisplayProps) => {
    return (
        <div className="text-4xl leading-relaxed pointer-events-none">

            {textToType.split('').map((char, index) => {
                const typedChar = typedText[index]

                let color = 'text-neutral-500/60'

                if (typedChar) {
                    if (typedChar === char) {
                        color = 'text-green-500'
                    } else if (errorMap[index]) {
                        color = 'text-rose-500'
                    }
                }

                return (
                    <span key={index}>

                        {index === typedText.length && (
                            <span className={clsx('text-transparent',
                                isActive && 'text-yellow-400'
                            )}>
                                |
                            </span>
                        )}

                        <span className={`${color}`}>
                            {char}
                        </span>
                    </span>
                )
            })}

        </div>
    )
}