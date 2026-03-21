'use client';

const items = [
    'UI Design',
    'Web Development',
    'Brand Identity',
    'Motion Design',
    'Creative Direction',
    '3D & Immersive',
    'UI Design',
    'Web Development',
    'Brand Identity',
    'Motion Design',
    'Creative Direction',
    '3D & Immersive',
];

export default function Ticker() {
    return (
        <div
            className="border-t border-b overflow-hidden bg-bg2 py-6"
            style={{ borderColor: 'var(--line)' }}
        >
            <div className="ticker-track flex w-max">
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="text-[32px] md:text-[42px] font-extrabold tracking-[-0.01em] uppercase px-16 whitespace-nowrap flex items-center transition-all duration-300"
                        style={{
                            WebkitTextStroke: '1.5px rgba(245,240,232,0.25)',
                            color: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            (
                                e.currentTarget as HTMLElement
                            ).style.WebkitTextStroke = '1.5px #ff5e1a';
                        }}
                        onMouseLeave={(e) => {
                            (
                                e.currentTarget as HTMLElement
                            ).style.WebkitTextStroke =
                                '1.5px rgba(245,240,232,0.25)';
                        }}
                    >
                        {item}
                        <span
                            className="ml-16 text-[14px]"
                            style={{
                                color: 'rgba(255,94,26,0.5)',
                                WebkitTextStroke: '0',
                            }}
                        >
                            ◆
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
}
