"use client";

import { CertificateData } from "../certificates/actions";
import { formatDate } from "@/lib/utils";
import { Building2, Award, Download, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

type CertificateProps = {
  certificate: CertificateData;
  isVisible: boolean;
};

export default function Certificate({
  certificate,
  isVisible,
}: CertificateProps) {
  if (!isVisible) {
    // Return a placeholder div to maintain layout
    return (
      <div className="flex-shrink-0 w-full md:w-[800px] h-[500px] opacity-0 pointer-events-none" />
    );
  }

  const donationDate = formatDate(certificate.donation_date);
  const placeOfDonation =
    certificate.camp_location ||
    certificate.camp_name ||
    "Blood Donation Center";

  const handleDownload = () => {
    toast.success("Certificate download started!", {
      description: "Your certificate is being prepared for download.",
    });
  };

  const handleShare = async () => {
    const shareText = `I received a certificate of appreciation for donating ${certificate.units_donated} unit${certificate.units_donated > 1 ? "s" : ""} of blood on ${donationDate.date} at ${placeOfDonation}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Blood Donation Certificate",
          text: shareText,
        });
        toast.success("Certificate shared!", {
          description: "Thank you for sharing your achievement.",
        });
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          // Fallback to clipboard if share fails
          try {
            await navigator.clipboard.writeText(shareText);
            toast.info("Certificate link copied!", {
              description: "Share text copied to clipboard.",
            });
          } catch {
            toast.error("Failed to share certificate");
          }
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Certificate link copied!", {
          description: "Share text copied to clipboard.",
        });
      } catch {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 w-full md:w-[800px] h-[500px] bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-lg shadow-2xl border-4 border-amber-200 overflow-hidden relative"
    >
      {/* Decorative Borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600" />
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600" />

      {/* Certificate Content */}
      <div className="h-full flex flex-col p-6 md:p-8 relative">
        {/* Action Buttons - Top Right */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white border-amber-300 shadow-md"
            aria-label="Download certificate"
          >
            <Download className="h-4 w-4 text-amber-700" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white border-amber-300 shadow-md"
            aria-label="Share certificate"
          >
            <Share2 className="h-4 w-4 text-amber-700" />
          </Button>
        </div>

        {/* Organisation Logo - Top */}
        <div className="flex justify-center mb-4">
          {certificate.organisation_logo_url ? (
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-[3px] border-amber-300 shadow-md">
              <AvatarImage
                src={certificate.organisation_logo_url}
                alt={certificate.organisation_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-amber-100 text-amber-700 text-lg">
                <Building2 className="h-10 w-10 md:h-12 md:w-12" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-amber-100 border-[3px] border-amber-300 flex items-center justify-center shadow-md">
              <Building2 className="h-10 w-10 md:h-12 md:w-12 text-amber-700" />
            </div>
          )}
        </div>

        {/* Organisation Name */}
        <div className="text-center mb-2">
          <h3 className="text-lg md:text-xl font-bold text-amber-900">
            {certificate.organisation_name}
          </h3>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <Award className="h-8 w-8 md:h-10 md:w-10 text-amber-600 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-amber-800 tracking-wide">
              CERTIFICATE OF APPRECIATION
            </h2>
            <Award className="h-8 w-8 md:h-10 md:w-10 text-amber-600 ml-2" />
          </div>
          <p className="text-sm md:text-base text-amber-700 font-medium">
            For Generous Blood Donation
          </p>
        </div>

        {/* Main Declaration - Paragraph Format */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 max-w-2xl">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              This is to certify that{" "}
              <span className="font-bold text-gray-900 underline decoration-2 decoration-amber-500 underline-offset-2">
                {certificate.donor_name}
              </span>{" "}
              has generously donated{" "}
              <span className="font-bold text-gray-900 underline decoration-2 decoration-amber-500 underline-offset-2">
                {certificate.units_donated} unit
                {certificate.units_donated > 1 ? "s" : ""} of blood
              </span>{" "}
              on{" "}
              <span className="font-bold text-gray-900 underline decoration-2 decoration-amber-500 underline-offset-2">
                {donationDate.date}
              </span>{" "}
              at{" "}
              <span className="font-bold text-gray-900 underline decoration-2 decoration-amber-500 underline-offset-2">
                {placeOfDonation}
              </span>
              . This certificate is presented in recognition of their selfless
              contribution towards saving lives and supporting the community.
            </p>
          </div>
        </div>

        {/* Footer - Issued By Section */}
        <div className="mt-4 pt-4 border-t-2 border-amber-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground mb-1">Issued by</p>
              <p className="text-sm md:text-base font-semibold text-amber-900">
                {certificate.organisation_name}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="text-sm md:text-base font-semibold text-amber-900">
                {donationDate.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
