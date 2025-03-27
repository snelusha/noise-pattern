"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Paper from "@/components/paper";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const NoisePattern = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const SCALE = 200;
  const LENGTH = 10;
  const SPACING = 15;

  const existingPoints = new Set<string>();
  const points: { x: number; y: number; opacity: number }[] = [];
  const offsetY = typeof window !== "undefined" ? window.scrollY : 0;

  const getForceOnPoint = (p5: any, x: number, y: number, z: number) => {
    return (p5.noise(x / SCALE, y / SCALE, z) - 0.5) * 2 * p5.TWO_PI;
  };

  const addPoints = (p5: any) => {
    const { width, height } = dimensions;
    for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
      for (let y = -SPACING / 2; y < height + offsetY + SPACING; y += SPACING) {
        const id = `${x}-${y}`;
        if (existingPoints.has(id)) continue;
        existingPoints.add(id);
        points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
      }
    }
  };

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(dimensions.width, dimensions.height).parent(
      canvasParentRef,
    );
    p5.background("#ffffff");
    p5.stroke("#ccc");
    p5.noFill();

    p5.noiseSeed(+new Date());

    addPoints(p5);
  };

  const draw = (p5: any) => {
    p5.background("#ffffff");
    const t = +new Date() / 10000;

    for (const p of points) {
      const { x, y } = p;
      const rad = getForceOnPoint(p5, x, y, t);
      const length = (p5.noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH;
      const nx = x + p5.cos(rad) * length;
      const ny = y + p5.sin(rad) * length;
      p5.stroke(
        180,
        180,
        180,
        (Math.abs(p5.cos(rad)) * 0.5 + 0.5) * p.opacity * 255,
      );
      p5.circle(nx, ny - offsetY, 1);
    }
  };

  const windowResized = (p5: any) => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    addPoints(p5);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Uncomment to enable scroll-based animation
    // const handleScroll = () => {
    //   offsetY = window.scrollY;
    //   // We would need to call addPoints here, but we don't have p5 instance
    //   // This would require a different approach to handle scroll events
    // };
    // window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={canvasRef}
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 -z-1"
      >
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />
      </div>
    </div>
  );
};

export { NoisePattern };
