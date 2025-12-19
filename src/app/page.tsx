"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { generateAPIToken } from "@/lib/generage-api-token";

export default function Component() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast<{ message: string }>();

  const api_hash = generateAPIToken("email", "username");

  const generateApiKey = () => {
    setApiKey(api_hash);
    toast({
      type: "foreground",
      message: "API key generated successfully.",
    });
  };
  // const router = useRouter();

  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          {/* <MountainIcon className="h-6 w-6" /> */}
          <span className="sr-only">Banner Craft</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href={session ? "/chat" : "/auth"}
          >
            Get Started
          </Link>
        </nav>
      </header>
      <main className="flex flex-col w-screen items-center">
        <section className="flex flex-col items-center w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Banner Craft
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Generate stunning banners for your products with our
                  AI-powered solution.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="/chat"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="flex flex-col items-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create eye-catching banners with our advanced AI algorithms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Maintain your brand identity across all generated banners.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Easily adjust and fine-tune generated banners to your
                    liking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="flex flex-col items-center w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Pricing
            </h2>
            <Tabs defaultValue="monthly" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">Annually</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <CardDescription>For small businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$29/mo</p>
                      <ul className="mt-4 space-y-2">
                        <li>100 banners/month</li>
                        <li>Basic customization</li>
                        <li>Email support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choose Plan</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>For growing brands</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$99/mo</p>
                      <ul className="mt-4 space-y-2">
                        <li>500 banners/month</li>
                        <li>Advanced customization</li>
                        <li>Priority support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choose Plan</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                      <CardDescription>For large organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">Custom</p>
                      <ul className="mt-4 space-y-2">
                        <li>Unlimited banners</li>
                        <li>Full customization</li>
                        <li>24/7 support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="annually">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <CardDescription>For small businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$290/yr</p>
                      <ul className="mt-4 space-y-2">
                        <li>100 banners/month</li>
                        <li>Basic customization</li>
                        <li>Email support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choose Plan</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>For growing brands</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$990/yr</p>
                      <ul className="mt-4 space-y-2">
                        <li>500 banners/month</li>
                        <li>Advanced customization</li>
                        <li>Priority support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choose Plan</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                      <CardDescription>For large organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">Custom</p>
                      <ul className="mt-4 space-y-2">
                        <li>Unlimited banners</li>
                        <li>Full customization</li>
                        <li>24/7 support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section
          id="api"
          className="flex flex-col items-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              API Access
            </h2>
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <Input
                  id="api-key"
                  placeholder="Generate an API key"
                  value={apiKey}
                  readOnly
                />
              </div>
              <Button onClick={generateApiKey} className="w-full">
                Generate API Key
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Banner Craft. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      <Toaster />
    </div>
  );
}
