"use client"

import { Chart } from "chart.js";
import { useEffect, useRef } from "react";

export default function BloodTypeChart({ donations }: { donations: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const bloodTypeCounts = donations.reduce((acc: any, donation: any) => {
      acc[donation.blood_type] =
        (acc[donation.blood_type] || 0) + donation.units_donated;
      return acc;
    }, {});

    const total = Object.values(bloodTypeCounts).reduce(
      (sum: number, val: any) => sum + val,
      0
    );
    const data = Object.keys(bloodTypeCounts).map((type) => ({
      type,
      percentage: Math.round((bloodTypeCounts[type] / total) * 100),
    }));

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((d) => `${d.type} (${d.percentage}%)`),
        datasets: [
          {
            data: data.map((d) => d.percentage),
            backgroundColor: [
              "#FF6B6B",
              "#FF8787",
              "#FFA3A3",
              "#FFC1C1",
              "#4ECDC4",
              "#45B7AF",
              "#8A4AF3",
              "#A075F5",
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Blood Type Distribution",
          },
        },
      },
    });
  }, [donations]);

  return <canvas ref={canvasRef} />;
}
