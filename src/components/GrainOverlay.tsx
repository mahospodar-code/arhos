import { useEffect, useState } from 'react';

export function GrainOverlay() {
    const [bgImage, setBgImage] = useState('');

    useEffect(() => {
        // Generate base64 noise image to avoid dependency on external file
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const imgData = ctx.createImageData(100, 100);
            const buffer32 = new Uint32Array(imgData.data.buffer);
            const len = buffer32.length;
            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.5) {
                    buffer32[i] = 0xff000000;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            setBgImage(canvas.toDataURL());
        }
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[100] mix-blend-multiply opacity-[0.06]"
            style={{ backgroundImage: `url(${bgImage})` }}
        />
    );
}
