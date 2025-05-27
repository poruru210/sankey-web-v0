"use client";

import dynamic from "next/dynamic";
import type { Container, Engine, IOptions, RecursivePartial } from "tsparticles-engine";
import { useMemo } from "react";

// Particles を SSR 無効で動的 import
const Particles = dynamic(() => import("react-tsparticles").then(mod => mod.default), {
    ssr: false,
});

type ParticlesBackgroundProps = {
    theme: "light" | "dark";
    particlesInit?: (engine: Engine) => Promise<void>;
    particlesLoaded?: (container?: Container) => Promise<void>;
    className?: string;
};

export default function ParticlesBackground({
                                                theme,
                                                particlesInit,
                                                particlesLoaded,
                                                className = "",
                                            }: ParticlesBackgroundProps) {
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
            color: { value: theme === "dark" ? "#10b981" : "#059669" },
            links: {
                color: theme === "dark" ? "#10b981" : "#059669",
                distance: 150,
                enable: true,
                opacity: theme === "dark" ? 0.1 : 0.2,
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
            opacity: { value: theme === "dark" ? 0.3 : 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    }), [theme]);

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
