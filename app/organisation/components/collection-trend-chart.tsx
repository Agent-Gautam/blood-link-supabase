"use client"

import { Chart } from "chart.js";
import { useEffect, useRef } from "react";

export default function CollectionTrendsChart({ donations }: { donations: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const hours = [9, 11, 13, 15, 17];
    const data = hours.map((hour) => {
      return donations
        .filter((d: any) => new Date(d.donation_date).getHours() === hour)
        .reduce((sum: number, d: any) => sum + d.units_donated, 0);
    });

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: hours.map((h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`),
        datasets: [
          {
            label: "Units Collected",
            data,
            backgroundColor: "#FF6B6B",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Collection Trends",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 28,
          },
        },
      },
    });
  }, [donations]);

  return <canvas ref={canvasRef} />;
}
