"use client";
import { GameStateProvider } from "@/hooks/contexts/game/use-game-state";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PlayerProvider } from "@/hooks/contexts/player/use-player";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PlayerProvider>
          <GameStateProvider>{children}</GameStateProvider>
        </PlayerProvider>
      </ThemeProvider>
      <Toaster richColors />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
