"use client";
/* eslint-disable @next/next/no-img-element */
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./button";
import { Card } from "./card";
import { Network, Zap, Shield, Globe, Activity } from "lucide-react"; // or your icons
import heroNetwork from "@/components/assets/hero-network.png";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Appbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);
  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav with Auth */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex justify-between items-center p-4 container mx-auto">
          <div className="text-lg font-bold">DPin Uptime</div>
          <div className="flex gap-2">
            <SignedOut>
              <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                <Button className="bg-green-400">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
                <Button className="bg-green-400">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <Button className="bg-green-400">Validator Sign In</Button>
            <Button className="bg-green-400">Validator Sign Up</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Decentralized Uptime
            <br />
            <span className="text-green-400">You Can Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your infrastructure with true reliability. No single point
            of failure, no centralized control. Just pure, distributed
            monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base bg-green-500">
              Get Early Access
            </Button>
            <Button size="lg" variant="secondary" className="text-base">
              View Documentation
            </Button>
          </div>
          <div className="pt-8">
            <Image
              src={heroNetwork}
              alt="Decentralized network visualization"
              className="w-full max-w-3xl mx-auto rounded-lg opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Built for Reliability
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Decentralized Network</h3>
              <p className="text-muted-foreground">
                Distributed monitoring nodes ensure no single point of failure.
                Your uptime checks run across multiple independent validators.
              </p>
            </Card>

            <Card className="p-8 space-y-4 border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Alerts</h3>
              <p className="text-muted-foreground">
                Instant notifications when your services go down. Multiple alert
                channels with customizable thresholds.
              </p>
            </Card>

            <Card className="p-8 space-y-4 border-border">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Tamper-Proof Data</h3>
              <p className="text-muted-foreground">
                Cryptographically verified monitoring data. Transparent,
                immutable records you can always trust.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="space-y-12">
            {[
              {
                step: "Add Your Endpoints",
                desc: "Configure the URLs, APIs, or services you want to monitor. Set custom check intervals and response time thresholds.",
              },
              {
                step: "Distributed Validation",
                desc: "Our network of independent nodes performs continuous health checks from multiple geographic locations and validates results.",
              },
              {
                step: "Get Instant Insights",
                desc: "Access real-time dashboards, historical analytics, and receive alerts through your preferred channels when issues are detected.",
              },
            ].map((item, idx) => (
              <div className="flex gap-6 items-start" key={idx}>
                <div className="w-10 h-10 rounded-full bg-green-500 text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{item.step}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe infrastructure monitoring should be as resilient as the
            systems it protects. By leveraging decentralized technology, we are
            building a monitoring platform that is truly unstoppable—free from
            single points of failure, corporate gatekeepers, and centralized
            control. Your uptime data belongs to you, verified by the network,
            trusted by design.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center space-y-6 bg-card border-border">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Monitor Differently?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the waitlist for early access. Be among the first to
              experience truly decentralized uptime monitoring.
            </p>
            <div className="pt-4">
              <Button size="lg" className="text-base bg-green-500">
                Request Early Access
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-semibold">Uptime Monitor</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
            </nav>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 Uptime Monitor. Building the future of decentralized
            infrastructure.
          </div>
        </div>
      </footer>
    </div>
  );
}
