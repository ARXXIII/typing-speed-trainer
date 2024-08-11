interface TypingAreaProps {
    typingRef: React.RefObject<HTMLDivElement>
    onInput: (value: string) => void
}

export const TypingArea = ({ typingRef, onInput }: TypingAreaProps) => {
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const value = e.currentTarget.innerText.replace(/\n/g, '')

        onInput(value)
    }

    return (
        <div
            ref={typingRef}
            contentEditable={true}
            onInput={handleInput}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            suppressContentEditableWarning={true}
            className="absolute w-1 h-1 overflow-hidden text-transparent caret-transparent outline-none whitespace-pre-wrap cursor-default z-10"
        />
    )
}