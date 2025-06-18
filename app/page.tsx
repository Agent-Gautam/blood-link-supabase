import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplet, Heart, Calendar, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-50 to-red-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Donate Blood, <span className="text-red-600">Save Lives</span>
              </h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of donors and help save lives. Every donation
                counts and can help up to three people in need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    <Heart className="mr-2 h-4 w-4" />
                    Become a Donor
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" asChild>
                  <Link href="/requests">Find Blood Requests</Link>
                </Button> */}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?key=hbt10"
                alt="Blood Donation"
                className="rounded-lg object-cover"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600">
                1,200+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Active Donors
              </div>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600">
                50+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Partner Hospitals
              </div>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600">
                3,500+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Lives Saved
              </div>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600">
                120+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Blood Drives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How BloodLink Works</h2>
            <p className="text-gray-500 mt-2">
              Connecting donors with those in need through our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Droplet className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Donate Blood</h3>
              <p className="text-gray-500">
                Register as a donor and find nearby donation camps or hospitals
                where you can donate blood.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Organize Camps</h3>
              <p className="text-gray-500">
                Organizations can create and manage blood donation camps to
                collect blood from willing donors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Request Blood</h3>
              <p className="text-gray-500">
                Hospitals and individuals can request blood of specific types
                for patients in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Camps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Upcoming Donation Camps</h2>
            <Button variant="outline" asChild>
              <Link href="/camps">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* This would be populated from the database */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  City Hospital Blood Drive
                </h3>
                <p className="text-gray-500 mb-4">123 Main St, Downtown</p>
                <div className="flex justify-between text-sm">
                  <span>June 15, 2023</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/camps/1">Register</Link>
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  University Campus Drive
                </h3>
                <p className="text-gray-500 mb-4">
                  University Campus, West Wing
                </p>
                <div className="flex justify-between text-sm">
                  <span>June 20, 2023</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/camps/2">Register</Link>
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Community Center Drive
                </h3>
                <p className="text-gray-500 mb-4">456 Park Ave, Midtown</p>
                <div className="flex justify-between text-sm">
                  <span>June 25, 2023</span>
                  <span>8:00 AM - 3:00 PM</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/camps/3">Register</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Donor Stories</h2>
            <p className="text-gray-500 mt-2">
              Hear from our community of blood donors
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-gray-500">Regular Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been donating blood for over 5 years now. It's a simple
                way to make a big difference in someone's life."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-medium">Jane Smith</h4>
                  <p className="text-sm text-gray-500">First-time Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was nervous about donating for the first time, but the
                process was easy and the staff was so supportive."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-medium">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Blood Recipient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Blood donors saved my life after my accident. I'm forever
                grateful to everyone who donates."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Save Lives?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join our community of donors today and help make a difference in
            someone's life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                <Heart className="mr-2 h-4 w-4" />
                Become a Donor
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-red-600"
              asChild
            >
              <Link href="/education">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
