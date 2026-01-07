// Landing page hero section

import { Badge } from '../ui';

export function HeroSection() {
    return (
        <div className="space-y-6 text-center">
            <Badge>
                <span className="font-bold text-gray-800">b²</span>
                <span>Introducing Bolt V2</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif text-[#2C2C2C]">
                Good evening, Builder
            </h1>
        </div>
    );
}
