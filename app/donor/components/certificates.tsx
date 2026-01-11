"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Certificate from "./certificate";
import { CertificateData } from "../certificates/actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CertificatesProps = {
  certificates: CertificateData[];
};

export default function Certificates({ certificates }: CertificatesProps) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(
    new Set([0])
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const certificateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll position to update current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        certificateRefs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const distance = Math.abs(center - containerCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          }
        });

        setCurrentIndex(closestIndex);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [certificates.length]);

  // Intersection Observer for virtualization
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIndices((prev) => {
          const newVisibleIndices = new Set(prev);
          entries.forEach((entry) => {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            if (entry.isIntersecting) {
              newVisibleIndices.add(index);
              // Also load adjacent items for smooth scrolling
              if (index > 0) newVisibleIndices.add(index - 1);
              if (index < certificates.length - 1)
                newVisibleIndices.add(index + 1);
            } else {
              // Only remove items that are far from current index
              if (Math.abs(index - currentIndex) > 2) {
                newVisibleIndices.delete(index);
              }
            }
          });
          return newVisibleIndices;
        });
      },
      {
        root: containerRef.current,
        rootMargin: "200px", // Load items before they're visible
        threshold: 0.1,
      }
    );

    certificateRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [certificates.length, currentIndex]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= certificates.length) return;

      setCurrentIndex(index);
      const ref = certificateRefs.current[index];
      if (ref && containerRef.current) {
        ref.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    },
    [certificates.length]
  );

  const handlePrevious = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  if (certificates.length === 0) {
    return (
      <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Award className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold mb-2 text-center">
            No Certificates Yet
          </CardTitle>
          <CardDescription className="text-center max-w-md">
            Complete your first blood donation to receive a certificate of
            appreciation.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Donation Certificates
        </CardTitle>
        <CardDescription>
          Your certificates of appreciation for blood donations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">
                Certificate {currentIndex + 1} of {certificates.length}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === certificates.length - 1}
              className="shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Carousel Container */}
          <div
            ref={containerRef}
            className="overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ maxHeight: "520px" }}
          >
            <div className="flex gap-6 px-4 pb-4 items-center">
              {certificates.map((certificate, index) => (
                <div
                  key={certificate.id}
                  ref={(el) => {
                    certificateRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="snap-center"
                >
                  <Certificate
                    certificate={certificate}
                    isVisible={visibleIndices.has(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {certificates.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-red-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to certificate ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
