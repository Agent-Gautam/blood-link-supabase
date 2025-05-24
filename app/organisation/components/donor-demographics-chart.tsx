
"use client"

import { Chart } from "chart.js";
import { useEffect, useRef } from "react";

export default function DonorDemographicsChart({ donors }: { donors: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ageGroups = [
      { label: "18-24", min: 18, max: 24 },
      { label: "25-34", min: 25, max: 34 },
      { label: "35-44", min: 35, max: 44 },
      { label: "45-54", min: 45, max: 54 },
      { label: "55+", min: 55, max: Infinity },
    ];

    const today = new Date();
    const data = ageGroups.map((group) => {
      return donors.filter((donor: any) => {
        const birthDate = new Date(donor.date_of_birth);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= group.min && age <= group.max;
      }).length;
    });

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ageGroups.map((g) => g.label),
        datasets: [
          {
            label: "Number of Donors",
            data,
            backgroundColor: "#4B5EAA",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Donor Demographics",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }, [donors]);

  return <canvas ref={canvasRef} />;
}
