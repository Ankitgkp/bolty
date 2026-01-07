// navbar comp
import { Github } from 'lucide-react';
import { Button } from '../ui';
import { NavLink } from './NavLink';

export function Navbar() {
    return (
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <Logo />
            <NavLinks />
            <NavActions />
        </nav>
    );
}

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                bolt.new
            </span>
        </div>
    );
}

function NavLinks() {
    return (
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <NavLink href="#">Community</NavLink>
            <NavLink href="#">Enterprise</NavLink>
            <NavLink href="#" hasDropdown>Resources</NavLink>
            <NavLink href="#">Careers</NavLink>
            <NavLink href="#">Pricing</NavLink>
        </div>
    );
}

function NavActions() {
    return (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-gray-600">
                <a href="#" className="hover:text-black transition-colors">
                    <Github className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-black transition-colors">
                    <span className="text-lg">𝕏</span>
                </a>
            </div>
            <Button variant="ghost" className="hidden md:block">
                Sign In
            </Button>
            <Button variant="secondary">
                Get started
            </Button>
        </div>
    );
}
