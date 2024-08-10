import clsx from "clsx";

interface ControlsProps {
    wordCount: number;
    setWordCount: (count: number) => void
    onRestart: () => void
}

export const Controls = ({ wordCount, setWordCount, onRestart }: ControlsProps) => {
    const handleWordCountChange = (count: number) => {
        setWordCount(count)
        onRestart()
    }

    return (
        <div className="flex justify-center items-center gap-x-6 p-3 font-medium rounded-lg bg-zinc-800/30">
            <h1 className="text-neutral-500/60">words</h1>
            <div className="hidden lg:block w-12 h-0.5 rounded-full bg-neutral-500/60" />
            <button onClick={() => handleWordCountChange(10)} className={clsx('text-neutral-500/60 hover:text-neutral-400 transition-colors',
                wordCount === 10 && 'text-yellow-400 hover:text-yellow-400'
            )}>
                10
            </button>
            <button onClick={() => handleWordCountChange(25)} className={clsx('hidden lg:block text-neutral-500/60 hover:text-neutral-400 transition-colors',
                wordCount === 25 && 'text-yellow-400 hover:text-yellow-400'
            )}>
                25
            </button>
            <button onClick={() => handleWordCountChange(50)} className={clsx('hidden lg:block text-neutral-500/60 hover:text-neutral-400 transition-colors',
                wordCount === 50 && 'text-yellow-400 hover:text-yellow-400'
            )}>
                50
            </button>
        </div>
    );
};
