import { useEffect, useState } from 'react';


export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Global scroll progress
        const updateProgress = () => {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0) {
                setProgress(scroll / height);
            }
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return progress;
}
