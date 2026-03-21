'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mx = 0,
            my = 0,
            rx = 0,
            ry = 0;
        let raf: number;

        const onMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            if (dotRef.current) {
                dotRef.current.style.left = mx + 'px';
                dotRef.current.style.top = my + 'px';
            }
        };

        const loop = () => {
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            if (ringRef.current) {
                ringRef.current.style.left = rx + 'px';
                ringRef.current.style.top = ry + 'px';
            }
            raf = requestAnimationFrame(loop);
        };

        const addHover = () => document.body.classList.add('ch');
        const rmHover = () => document.body.classList.remove('ch');

        document.addEventListener('mousemove', onMove);
        raf = requestAnimationFrame(loop);

        const targets = document.querySelectorAll(
            'a, button, .proj-item, .svc-card',
        );
        targets.forEach((el) => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', rmHover);
        });

        return () => {
            document.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            <div
                ref={dotRef}
                className="cur w-[6px] h-[6px] bg-or -mt-[3px] -ml-[3px]"
                style={{ transition: 'transform 0.15s' }}
                id="cd"
            />
            <div
                ref={ringRef}
                className="cur w-8 h-8 border border-or/50 -mt-4 -ml-4"
                style={{
                    transition:
                        'width 0.3s cubic-bezier(.23,1,.32,1), height 0.3s cubic-bezier(.23,1,.32,1), margin 0.3s cubic-bezier(.23,1,.32,1)',
                }}
                id="cr"
            />
            <style>{`
        body.ch #cr { width:60px;height:60px;margin-top:-30px;margin-left:-30px;border-color:rgba(255,94,26,.2); }
        body.ch #cd { transform:scale(0); }
      `}</style>
        </>
    );
}
