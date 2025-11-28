import React, { useEffect, useRef } from "react";
import "../../styles/interactiveBackground.css";

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  const requestRef = useRef();
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 });
  const lastMouseTime = useRef(Date.now());

  // Configuration: 8 Small, 3 Medium, 1 Large
  const generateBubbles = () => {
    const bubbles = [];
    // Define types with updated colors (Teal, Amber, Deep Blue)
    const types = [
      { count: 1, name: "large", radius: 180, color: "#008080" }, // Teal
      { count: 1, name: "medium", radius: 120, color: "#ffc107" }, // Amber (Logo)
      { count: 1, name: "medium", radius: 120, color: "#e67e22" }, // Darker Orange (Logo shade)
      { count: 1, name: "medium", radius: 120, color: "#4169e1" }, // Royal Blue
      { count: 2, name: "small", radius: 70, color: "#20c997" }, // Light Teal
      { count: 2, name: "small", radius: 70, color: "#ff9f43" }, // Light Orange
      { count: 2, name: "small", radius: 70, color: "#5f27cd" }, // Deep Purple
      { count: 2, name: "small", radius: 70, color: "#48dbfb" }, // Light Blue
    ];

    let idCounter = 0;

    types.forEach((type) => {
      for (let i = 0; i < type.count; i++) {
        // Try to find a non-overlapping position
        let x, y, overlapping;
        let attempts = 0;
        do {
          x = Math.random() * window.innerWidth;
          y = Math.random() * window.innerHeight;
          overlapping = false;

          for (const b of bubbles) {
            const dx = x - b.x;
            const dy = y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < type.radius + b.radius + 50) {
              // +50 buffer
              overlapping = true;
              break;
            }
          }
          attempts++;
        } while (overlapping && attempts < 100);

        bubbles.push({
          id: idCounter++,
          size: type.name,
          radius: type.radius,
          collisionRadius: type.radius, // Use full radius for collision to prevent overlap
          color: type.color,
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 1.0, // Slower, smoother movement
          vy: (Math.random() - 0.5) * 1.0,
          mass: type.radius,
        });
      }
    });
    return bubbles;
  };

  const bubblesState = useRef(generateBubbles());

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastMouseTime.current;

      if (dt > 0) {
        mouseRef.current.vx = (e.clientX - mouseRef.current.x) / dt;
        mouseRef.current.vy = (e.clientY - mouseRef.current.y) / dt;
      }

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMouseTime.current = now;
    };

    const resolveCollision = (b1, b2) => {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = b1.collisionRadius + b2.collisionRadius;

      if (distance < minDistance) {
        // Resolve overlap
        const overlap = minDistance - distance;
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * overlap * 0.5;
        const moveY = Math.sin(angle) * overlap * 0.5;

        b1.x -= moveX;
        b1.y -= moveY;
        b2.x += moveX;
        b2.y += moveY;

        // Elastic collision
        const nx = dx / distance;
        const ny = dy / distance;
        const tx = -ny;
        const ty = nx;

        const dpTan1 = b1.vx * tx + b1.vy * ty;
        const dpTan2 = b2.vx * tx + b2.vy * ty;
        const dpNorm1 = b1.vx * nx + b1.vy * ny;
        const dpNorm2 = b2.vx * nx + b2.vy * ny;

        const m1 = b1.mass;
        const m2 = b2.mass;

        const p1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
        const p2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

        b1.vx = tx * dpTan1 + nx * p1;
        b1.vy = ty * dpTan1 + ny * p1;
        b2.vx = tx * dpTan2 + nx * p2;
        b2.vy = ty * dpTan2 + ny * p2;
      }
    };

    const animate = () => {
      if (!containerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const cursorRadius = 120; // Radius around cursor to keep clear

      // 1. Update positions and Wall Collisions
      bubblesState.current.forEach((bubble) => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Wall bounce
        if (bubble.x - bubble.collisionRadius < 0) {
          bubble.x = bubble.collisionRadius;
          bubble.vx *= -1;
        }
        if (bubble.x + bubble.collisionRadius > width) {
          bubble.x = width - bubble.collisionRadius;
          bubble.vx *= -1;
        }
        if (bubble.y - bubble.collisionRadius < 0) {
          bubble.y = bubble.collisionRadius;
          bubble.vy *= -1;
        }
        if (bubble.y + bubble.collisionRadius > height) {
          bubble.y = height - bubble.collisionRadius;
          bubble.vy *= -1;
        }
      });

      // 2. Bubble-Bubble Collisions
      for (let i = 0; i < bubblesState.current.length; i++) {
        for (let j = i + 1; j < bubblesState.current.length; j++) {
          resolveCollision(bubblesState.current[i], bubblesState.current[j]);
        }
      }

      // 3. Cursor Interaction (Strict Repulsion)
      bubblesState.current.forEach((bubble) => {
        const dx = bubble.x - mouseRef.current.x;
        const dy = bubble.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = bubble.collisionRadius + cursorRadius;

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          const overlap = minDistance - distance;

          // Hard push to ensure no overlap
          bubble.x += Math.cos(angle) * overlap;
          bubble.y += Math.sin(angle) * overlap;

          // Add cursor velocity influence
          const pushFactor = 0.15;
          bubble.vx += mouseRef.current.vx * pushFactor + Math.cos(angle) * 0.5;
          bubble.vy += mouseRef.current.vy * pushFactor + Math.sin(angle) * 0.5;
        }

        // Friction
        bubble.vx *= 0.995;
        bubble.vy *= 0.995;

        // Speed limits
        const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
        if (speed < 0.1) {
          bubble.vx = (bubble.vx / speed) * 0.1;
          bubble.vy = (bubble.vy / speed) * 0.1;
        }
        if (speed > 3) {
          bubble.vx = (bubble.vx / speed) * 3;
          bubble.vy = (bubble.vy / speed) * 3;
        }
      });

      // 4. Render
      bubblesState.current.forEach((bubble, index) => {
        const el = bubblesRef.current[index];
        if (el) {
          const visualX = bubble.x - bubble.radius;
          const visualY = bubble.y - bubble.radius;
          el.style.transform = `translate3d(${visualX}px, ${visualY}px, 0)`;
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="interactive-bg" ref={containerRef}>
      {bubblesState.current.map((bubble, index) => (
        <div
          key={bubble.id}
          ref={(el) => (bubblesRef.current[index] = el)}
          className={`blob blob-${bubble.size}`}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            // Use color from JS for base, but CSS handles gradient/glow
            color: bubble.color, // Pass color to CSS via currentColor
            width: bubble.radius * 2,
            height: bubble.radius * 2,
          }}
        ></div>
      ))}
    </div>
  );
};

export default InteractiveBackground;
