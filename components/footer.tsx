import { FaHeart } from "react-icons/fa6"

export const Footer = () => {
    return (
        <footer className="flex justify-center lg:justify-between items-center gap-x-6 font-medium text-xs lg:text-sm text-neutral-500/60">
            <h2 className="hidden lg:block">Version</h2>
            <h1 className="flex items-center gap-x-1.5">Code with<FaHeart className="size-3 lg:size-4 text-rose-500" />by ARXXIII</h1>
            <h3 className="hidden lg:block">2024 Edition</h3>
        </footer>
    )
}