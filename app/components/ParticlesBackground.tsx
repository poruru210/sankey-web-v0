"use client";

import { useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type {Container, Engine, IOptions, RecursivePartial} from "tsparticles-engine";
import dynamic from "next/dynamic";

// Particlesコンポーネントを動的インポートでSSRを無効化
const Particles = dynamic(() => import("react-tsparticles"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0" />
});

type ParticlesBackgroundProps = {
    theme?: "light" | "dark";
    particlesInit?: (engine: Engine) => Promise<void>;
    particlesLoaded?: (container?: Container) => Promise<void>;
    className?: string;
};

export default function ParticlesBackground({
                                                theme: propTheme,
                                                particlesInit,
                                                particlesLoaded,
                                                className = "",
                                            }: ParticlesBackgroundProps) {
    const { theme: currentTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // マウント状態を管理してハイドレーションエラーを防ぐ
    useEffect(() => {
        setMounted(true);
    }, []);

    // propTheme が提供されていればそれを使用、そうでなければ currentTheme を使用
    const effectiveTheme = propTheme || (currentTheme as "light" | "dark") || "dark";

    const options = useMemo((): RecursivePartial<IOptions> => ({
        background: {
            color: { value: "transparent" },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
            },
        },
        particles: {
            color: { value: effectiveTheme === "dark" ? "#10b981" : "#059669" },
            links: {
                color: effectiveTheme === "dark" ? "#10b981" : "#059669",
                distance: 150,
                enable: true,
                opacity: effectiveTheme === "dark" ? 0.1 : 0.2,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 80,
            },
            opacity: { value: effectiveTheme === "dark" ? 0.3 : 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    }), [effectiveTheme]);

    // マウントされていない場合はプレースホルダーを表示
    if (!mounted) {
        return <div className={`absolute inset-0 z-0 ${className}`} />;
    }

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={options}
            className={`absolute inset-0 z-0 ${className}`}
        />
    );
}