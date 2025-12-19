'use client'
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return <Button className="bg-red-700 text-[#f0f0f0]" onClick={() => signOut()}>Sign out</Button>;
  }
  return <Button  onClick={() => signIn()}>Sign in</Button>;
}
