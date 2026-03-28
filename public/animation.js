// KUBO Morph Animation - Homepage Hero Section
(function() {
    let animationFrameId = null;
    let mouseListenerFn = null;
    let resizeListenerFn = null;

    function initHeroAnimation() {
        // Only initialize if we're on the homepage and the canvas exists
        const canvas = document.getElementById('hero-animation-canvas');
        if (!canvas) return;

        // Cleanup previous instances
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (mouseListenerFn) {
            window.removeEventListener('mousemove', mouseListenerFn);
        }
        if (resizeListenerFn) {
            window.removeEventListener('resize', resizeListenerFn);
        }

        const ctx = canvas.getContext('2d');

        // Configuration - enhanced for visual impact
        const numPoints = 64; // More points for density
        const radius = 180;   // Bigger size
        const speed = 0.008;  // Slower, continuous transition
        const dotSize = 3;    // Dot size
        const lineColor = '#4a90e2'; // Brand blue
        const secondaryLineColor = '#9333ea'; // Purple accent
        const dotColor = '#ffffff';
        const mouseInfluence = 200; // Larger distance of mouse influence
        const mouseStrength = 0.15; // Strength of attraction (0-1)

        let width, height;
        let mouseX = null;
        let mouseY = null;

        // Set canvas size to fit the container
        function resize() {
            // Get the parent container dimensions
            const container = canvas.parentElement;
            width = container.offsetWidth || 400;
            height = container.offsetHeight || 384;
            canvas.width = width;
            canvas.height = height;
        }

        resize();

        // Mouse event listeners - track mouse across entire window
        mouseListenerFn = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        window.addEventListener('mousemove', mouseListenerFn);

        // Helper: Linear Interpolation between two values
        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }

        // Smooth easing function
        function smoothstep(t) {
            return t * t * (3 - 2 * t);
        }

        // Calculate positions
        function getPositions(t) {
            const points = [];
            const segmentSize = numPoints / 6;

            for (let i = 0; i < numPoints; i++) {
                // 1. CIRCLE POSITION
                const angle = (i / numPoints) * Math.PI * 2 - (Math.PI / 2);
                const cx = Math.cos(angle) * radius;
                const cy = Math.sin(angle) * radius;

                // 2. HEXAGON POSITION
                const sideIndex = Math.floor(i / segmentSize);
                const progressOnSide = (i % segmentSize) / segmentSize;

                const hexAngle1 = (sideIndex * 60 - 90) * (Math.PI / 180);
                const hexAngle2 = ((sideIndex + 1) * 60 - 90) * (Math.PI / 180);

                const x1 = Math.cos(hexAngle1) * radius;
                const y1 = Math.sin(hexAngle1) * radius;
                const x2 = Math.cos(hexAngle2) * radius;
                const y2 = Math.sin(hexAngle2) * radius;

                const hx = lerp(x1, x2, progressOnSide);
                const hy = lerp(y1, y2, progressOnSide);

                // 3. MORPH with smooth transition
                points.push({
                    x: lerp(cx, hx, t) + width / 2,
                    y: lerp(cy, hy, t) + height / 2
                });
            }

            // Apply mouse influence - works even when mouse is outside canvas
            if (mouseX !== null && mouseY !== null) {
                for (let i = 0; i < points.length; i++) {
                    const dx = mouseX - points[i].x;
                    const dy = mouseY - points[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseInfluence) {
                        // Calculate attraction based on distance
                        const force = (1 - distance / mouseInfluence) * mouseStrength;
                        points[i].x += dx * force;
                        points[i].y += dy * force;
                    }
                }
            }

            return points;
        }

        let time = 0;

        function draw() {
            // Debug: Mark that animation is running
            canvas.setAttribute('data-animating', 'true');

            // Clear with light fade effect for white background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fillRect(0, 0, width, height);

            // Calculate Morph Factor with smooth continuous transition
            time += speed;
            let morphFactor = (Math.sin(time) + 1) / 2;

            // Apply smooth easing for buttery transitions
            let ease = smoothstep(morphFactor);

            const points = getPositions(ease);

            // Draw more interconnective lines (thicker and more visible)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(74, 144, 226, 0.25)'; // Brand blue with transparency
            ctx.lineWidth = 1.5; // Same as outer lines
            for (let i = 0; i < points.length; i++) {
                // Connect to multiple partners for denser network
                let partner1 = points[(i + 8) % points.length];
                let partner2 = points[(i + 16) % points.length];
                let partner3 = points[(i + 21) % points.length];

                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(partner1.x, partner1.y);

                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(partner2.x, partner2.y);

                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(partner3.x, partner3.y);
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        // Handle window resize
        resizeListenerFn = resize;
        window.addEventListener('resize', resizeListenerFn);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroAnimation);
    } else {
        initHeroAnimation();
    }

    // Make it globally available
    window.initHeroAnimation = initHeroAnimation;
})();
