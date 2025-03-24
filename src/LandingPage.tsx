"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MessageSquare,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamCard from "./staff/components/TeamCard";

// Note: You'll need to create or import a Button component
// If you're using a UI library like MUI or Chakra, use their button component instead
const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  [key: string]: any;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50";
  const variantStyles = {
    default: "bg-[#4f46e5] text-white hover:bg-[#4338ca]",
    outline: "border border-[#cbd5e1] bg-transparent hover:bg-[#f8fafc]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans',sans-serif] bg-[#f8fafc]">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-8 w-8 text-[#4f46e5]" />
            <span className="text-xl font-bold text-[#1e293b]">BU Voice</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[#475569] hover:text-[#4f46e5] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[#475569] hover:text-[#4f46e5] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-[#475569] hover:text-[#4f46e5] transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#team"
              className="text-[#475569] hover:text-[#4f46e5] transition-colors"
            >
              Our Team
            </a>
            <a
              href="#faq"
              className="text-[#475569] hover:text-[#4f46e5] transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div onClick={() => navigate("/login?role=student")}>
              <Button
                variant="outline"
                className="border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white px-4 py-2"
              >
                Student Sign In
              </Button>
            </div>
            <div onClick={() => navigate("/login?role=admin")}>
              <Button className="bg-[#4f46e5] text-white hover:bg-[#4338ca] px-4 py-2">
                Admin Sign In
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1e293b]"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a
                href="#features"
                className="text-[#475569] hover:text-[#4f46e5] py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[#475569] hover:text-[#4f46e5] py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-[#475569] hover:text-[#4f46e5] py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#team"
                className="text-[#475569] hover:text-[#4f46e5] py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Team
              </a>
              <a
                href="#faq"
                className="text-[#475569] hover:text-[#4f46e5] py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-[#cbd5e1]">
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup?role=student");
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white px-4 py-2"
                  >
                    Student Sign Up
                  </Button>
                </div>
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup?role=admin");
                  }}
                >
                  <Button className="w-full bg-[#4f46e5] text-white hover:bg-[#4338ca] px-4 py-2">
                    Admin Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="md:w-1/2 space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e293b] leading-tight"
              >
                Your Voice Matters at{" "}
                <motion.span
                  initial={{ color: "#1e293b" }}
                  animate={{ color: "#4f46e5" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-[#4f46e5]"
                >
                  Babcock University
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-[#475569]"
              >
                BU Voice is a streamlined platform designed to manage and
                resolve student complaints efficiently, ensuring your concerns
                are heard and addressed promptly.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <div onClick={() => "/signup?role=student"}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full sm:w-auto bg-[#4f46e5] text-white hover:bg-[#4338ca] px-8 py-6 text-lg">
                      Get Started <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
                <a href="#how-it-works">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-[#cbd5e1] text-[#475569] hover:bg-[#f8fafc] px-8 py-6 text-lg"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                type: "spring",
                stiffness: 100,
              }}
              className="md:w-1/2"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -inset-1 bg-[#4f46e5] rounded-lg blur-lg opacity-30"
                ></motion.div>
                <div className="relative bg-white p-4 rounded-lg shadow-xl">
                  <img
                    src="https://www.babcock.edu.ng/storage/media/4432a589-a1e9-499c-b8c4-3b91cecc86b0.png"
                    // "https://placehold.co/600x500"
                    alt="BU Voice Dashboard"
                    className="rounded-lg w-full"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-3 text-[#4f46e5]">
                    <CheckCircle className="h-6 w-6 text-[#03781d]" />
                    <span className="font-medium">Quick Resolution</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#4f46e5] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-4xl font-bold mb-2">98%</h3>
                <p className="text-[#e0e7ff]">Resolution Rate</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-4xl font-bold mb-2">24h</h3>
                <p className="text-[#e0e7ff]">Average Response Time</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 1,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-4xl font-bold mb-2">5000+</h3>
                <p className="text-[#e0e7ff]">Students Served</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              Designed for Effective Complaint Management
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              BU Voice streamlines the entire complaint process from submission
              to resolution, making it easier for both students and
              administrators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#dbeafe] rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-[#2563eb]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                Easy Submission
              </h3>
              <p className="text-[#475569]">
                Submit complaints through a simple, intuitive interface designed
                for quick and detailed reporting.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#f0f9f2] rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-[#03781d]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                Real-time Tracking
              </h3>
              <p className="text-[#475569]">
                Monitor the status of your complaints in real-time with detailed
                progress updates and notifications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#ffedd5] rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#f97316]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                Secure & Private
              </h3>
              <p className="text-[#475569]">
                Your complaints are handled with the utmost confidentiality,
                ensuring your privacy and security.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              How BU Voice Works
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              A simple three-step process designed to get your concerns
              addressed quickly and efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                  Submit Your Complaint
                </h3>
                <p className="text-[#475569]">
                  Log in to your student account and fill out the complaint form
                  with all relevant details.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                <ArrowRight className="h-8 w-8 text-[#cbd5e1]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                  Track Progress
                </h3>
                <p className="text-[#475569]">
                  Monitor the status of your complaint as it's reviewed and
                  processed by university administrators.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                <ArrowRight className="h-8 w-8 text-[#cbd5e1]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                  Get Resolution
                </h3>
                <p className="text-[#475569]">
                  Receive updates and resolution details directly through the
                  platform with follow-up options.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              What Students Say
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Hear from students who have used BU Voice to resolve their
              concerns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mr-4 font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-bold text-[#1e293b]">John Doe</h4>
                  <p className="text-sm text-[#94a3b8]">
                    Computer Science, 300 Level
                  </p>
                </div>
              </div>
              <p className="text-[#475569] italic">
                "BU Voice made it so easy to report an issue with my course
                registration. The administration responded within 24 hours and
                my problem was resolved quickly."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mr-4 font-bold">
                  JS
                </div>
                <div>
                  <h4 className="font-bold text-[#1e293b]">Jane Smith</h4>
                  <p className="text-sm text-[#94a3b8]">
                    Business Administration, 400 Level
                  </p>
                </div>
              </div>
              <p className="text-[#475569] italic">
                "I was skeptical at first, but BU Voice really works. My
                accommodation issue was addressed promptly, and I could track
                every step of the process."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#f8fafc] p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mr-4 font-bold">
                  MJ
                </div>
                <div>
                  <h4 className="font-bold text-[#1e293b]">Michael Johnson</h4>
                  <p className="text-sm text-[#94a3b8]">Nursing, 200 Level</p>
                </div>
              </div>
              <p className="text-[#475569] italic">
                "The transparency of BU Voice is what I appreciate most. Being
                able to see exactly who is handling my complaint and what stage
                it's at gives me peace of mind."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              The dedicated professionals behind BU Voice working to make your
              experience better.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TeamCard
              fullname="Ijeoma Chiedozie"
              role="Project Lead"
              details="A Passionate young man filled zeal and burning passion"
            />
            <TeamCard
              fullname="Akisanya Temiloluwa"
              role="Backend Developer"
              details="A Passionate young man filled zeal and burning passion"
            />
            <TeamCard
              fullname="Dada Obafemi"
              role="Frontend Developer"
              details="A Passionate young man filled zeal and burning passion"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Get answers to common questions about BU Voice.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                Who can use BU Voice?
              </h3>
              <p className="text-[#475569]">
                BU Voice is available to all registered students of Babcock
                University. Administrators can also access the platform to
                manage and respond to complaints.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                How long does it take to get a response?
              </h3>
              <p className="text-[#475569]">
                Most complaints receive an initial response within 24 hours.
                Resolution times vary depending on the complexity of the issue,
                but you'll receive regular updates throughout the process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                Is my information kept confidential?
              </h3>
              <p className="text-[#475569]">
                Yes, all complaints are handled with strict confidentiality.
                Only authorized personnel directly involved in resolving your
                issue will have access to your complaint details.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                What types of complaints can I submit?
              </h3>
              <p className="text-[#475569]">
                BU Voice handles a wide range of complaints including academic
                issues, facility problems, administrative concerns, and more. If
                you're unsure, you can always submit your complaint and it will
                be directed to the appropriate department.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4f46e5] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl mb-8 text-[#e0e7ff]">
              Join thousands of students who have successfully resolved their
              concerns through BU Voice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div onClick={() => navigate("/signup?role=student")}>
                <Button className="w-full sm:w-auto bg-white border-1 hover:border-[#4338ca] hover:bg-[#f8fafc] px-8 py-6 text-lg">
                  <div className="text-primary-purple">Student Sign Up</div>
                </Button>
              </div>
              <div onClick={() => navigate("/signup?role=admin")}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-[#4338ca] hover:border-[#4338ca] hover:text-[#4338ca] px-8 py-6 text-lg"
                >
                  Admin Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1e293b] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-8 w-8 text-[#4f46e5]" />
                <span className="text-xl font-bold">BU Voice</span>
              </div>
              <p className="text-[#94a3b8] max-w-md">
                BU Voice is the official complaint management system for Babcock
                University, designed to streamline the process of submitting and
                resolving student concerns.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-[#94a3b8]">
                  Babcock University, Ilishan-Remo, Ogun State, Nigeria
                </li>
                <li className="text-[#94a3b8]">support@buvoice.edu.ng</li>
                <li className="text-[#94a3b8]">+234 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#475569] mt-12 pt-8 text-center text-[#94a3b8]">
            <p>
              &copy; {new Date().getFullYear()} BU Voice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
