import { AnimatedHero } from "@/components/dashboard/AnimatedHero";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { FeaturesSection } from "@/components/dashboard/FeaturesSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Hospital, Users, HeartPulse, Handshake, Calendar, Quote } from "lucide-react";
import Link from "next/link";

const upcomingCamps = [
  { name: "City Hospital Blood Drive", date: "2024-07-10", location: "City Hospital, Main Hall" },
  { name: "Community Camp", date: "2024-07-15", location: "Central Park Pavilion" },
  { name: "Tech Park Donation", date: "2024-07-22", location: "Tech Park Auditorium" },
];

const testimonials = [
  { name: "Amit S.", text: "Donating blood through BloodLink was seamless and rewarding!", role: "Donor" },
  { name: "Priya R.", text: "I found a donor for my father in hours. Thank you, BloodLink!", role: "Recipient" },
  { name: "Dr. Mehta", text: "Organizing camps has never been easier.", role: "Camp Organizer" },
];

const partners = [
  { name: "Red Cross", logo: "/partner-redcross.svg" },
  { name: "City Hospital", logo: "/partner-hospital.svg" },
  { name: "Health NGO", logo: "/partner-ngo.svg" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section aria-label="Hero" className="bg-gradient-to-r from-blue-50 via-white to-red-50 py-20 md:py-32 relative overflow-hidden border-b border-red-100">
        <div className="absolute inset-0 bg-[url('/blood-drops-bg.svg')] bg-cover bg-center opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <AnimatedHero />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Intro Section */}
      <section aria-label="About BloodLink" className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">What is BloodLink?</h2>
          <p className="text-lg md:text-xl text-gray-700">
            BloodLink is a modern platform connecting donors, recipients, and organizations to make blood donation easier, safer, and more impactful. Join us in saving lives and building a healthier community.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Why Donate Blood Section */}
      <section aria-label="Why Donate Blood" className="py-16 bg-gradient-to-br from-red-50 to-blue-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700 text-center mb-8">Why Donate Blood?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center p-6 text-center shadow-md">
              <HeartPulse className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Save Lives</h3>
              <p className="text-gray-600">Your donation can save up to three lives and make a real difference in emergencies.</p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center shadow-md">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Community Impact</h3>
              <p className="text-gray-600">Support your community and help hospitals maintain a healthy blood supply.</p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center shadow-md">
              <Handshake className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feel Good</h3>
              <p className="text-gray-600">Experience the joy of giving and receive health benefits as a regular donor.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Donate Section */}
      <section aria-label="How to Donate" className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 text-center mb-8">How to Donate</h2>
          <ol className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between items-center">
            <li className="flex flex-col items-center max-w-xs">
              <span className="bg-red-100 text-red-700 rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl mb-3">1</span>
              <p className="font-medium mb-1">Register as a Donor</p>
              <p className="text-gray-600 text-center">Sign up and complete your donor profile.</p>
            </li>
            <li className="flex flex-col items-center max-w-xs">
              <span className="bg-blue-100 text-blue-700 rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl mb-3">2</span>
              <p className="font-medium mb-1">Find a Camp</p>
              <p className="text-gray-600 text-center">Search for nearby donation camps or events.</p>
            </li>
            <li className="flex flex-col items-center max-w-xs">
              <span className="bg-red-100 text-red-700 rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl mb-3">3</span>
              <p className="font-medium mb-1">Donate Blood</p>
              <p className="text-gray-600 text-center">Attend the camp, donate, and help save lives!</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Upcoming Donation Camps Section */}
      <section aria-label="Upcoming Donation Camps" className="py-16 bg-gradient-to-br from-blue-50 to-red-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-red-700">Upcoming Donation Camps</h2>
            <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/donor/donation-camps">View All Camps</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingCamps.map((camp, idx) => (
              <Card key={idx} className="p-6 flex flex-col gap-2 shadow-md">
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-lg mb-1">{camp.name}</h3>
                <p className="text-gray-600 text-sm">{camp.date} &middot; {camp.location}</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/donor/donation-camps">Register</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section aria-label="Testimonials" className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 text-center mb-8">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="p-6 flex flex-col items-center text-center shadow-md">
                <Quote className="h-8 w-8 text-red-400 mb-2" />
                <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                <div className="font-semibold text-red-700">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section aria-label="FAQ" className="py-16 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700 text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Who can donate blood?</AccordionTrigger>
              <AccordionContent>
                Most healthy adults aged 18-65 can donate blood. There are some medical and travel restrictions—check with your local guidelines.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How often can I donate?</AccordionTrigger>
              <AccordionContent>
                You can typically donate whole blood every 3 months. Platelet and plasma donation intervals may differ.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Is blood donation safe?</AccordionTrigger>
              <AccordionContent>
                Yes! All equipment is sterile and single-use. Donors are carefully screened for safety.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Partners Section */}
      <section aria-label="Partners and Supporters" className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-6">Our Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((p, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={p.logo} alt={p.name} className="h-12 w-auto mb-2 grayscale hover:grayscale-0 transition-all" />
                <span className="text-sm text-gray-600">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
