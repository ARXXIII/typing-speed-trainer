import { FaTelegram } from "react-icons/fa6"
import { IoLogoGithub } from "react-icons/io"
import { RiGitRepositoryCommitsFill } from "react-icons/ri"

export const Header = () => {
    return (
        <header className="flex justify-between items-center text-lg text-neutral-500/60">
            <h1 className="font-bold tracking-wide uppercase">ARXXIII</h1>
            <h2 className="hidden lg:block text-neutral-400">Typing Speed Trainer</h2>
            <div className="flex items-center gap-x-6">
                <a href="https://github.com/ARXXIII/typing-speed-trainer" target="_blanc" title="Repo" className="hover:text-neutral-400 transition-colors">
                    <RiGitRepositoryCommitsFill className="size-7" />
                </a>
                <a href="https://github.com/ARXXIII" target="_blanc" title="GitHub" className="hover:text-neutral-400 transition-colors">
                    <IoLogoGithub className="size-7" />
                </a>
                <a href="https://t.me/arxxiii" target="_blanc" title="Telega" className="hover:text-neutral-400 transition-colors">
                    <FaTelegram className="size-7" />
                </a>
            </div>
        </header>
    )
}