"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/views/mode-toggle";
import { useEffect, useMemo, useState } from "react";
import { mediaQueryWidths } from "@/lib/utils";
import JoinGame from "@/components/views/join-game";
import CreateGame from "@/components/views/create-game";

export default function Home() {
  const [pageWidth, setPageWidth] = useState(0);
  const [joinGameOpen, setJoinGameOpen] = useState(false);
  const [createGameOpen, setCreateGameOpen] = useState(false);

  useEffect(() => {
    // Define the resize handler
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };

    // Perform initial check
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine Image dimensions based on screen width
  const imageSize = useMemo(() => {
    if (pageWidth < mediaQueryWidths.sm) {
      return 150;
    } else if (pageWidth < mediaQueryWidths.md) {
      return 200;
    } else if (pageWidth < mediaQueryWidths.lg) {
      return 250;
    } else {
      return 300;
    }
  }, [pageWidth]);

  return (
    <>
      <div className="flex min-h-screen flex-col container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="w-full py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF6B6B]" />
              <span className="text-base sm:text-lg font-medium">
                The Last Lash
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm sm:text-lg">
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-10 sm:py-16 md:py-24 lg:py-32">
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
              <div className="space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
                  Create questions.
                  <br />
                  Play together.
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
                  A party game where you and your friends create the questions,
                  then vote on the best answers.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center md:justify-start gap-4 sm:gap-6 mt-6 md:flex-row md:gap-6">
                  {/* Create Game */}
                  <Button
                    size="lg"
                    className="rounded-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white cursor-pointer"
                    onClick={() => setCreateGameOpen(true)}
                  >
                    Create a game <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* Join Game */}
                  <Button
                    size="lg"
                    className="rounded-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white cursor-pointer"
                    onClick={() => setJoinGameOpen(true)}
                  >
                    Join a game <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div
                className="order-1 relative aspect-square w-full max-w-[300px] sm:max-w-[400px] mx-auto md:max-w-none md:w-auto md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-[#F0F0F0]
              dark:bg-[#1A1A1A] dark:bg-opacity-10 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 aspect-square">
                    <div className="absolute top-1/2 left-0 w-full h-15/16 dark:bg-[#FF6B6B]/10 bg-[#FF6B6B]/30 rounded-3xl transform -translate-y-1/2 -rotate-6"></div>
                    <div className="absolute top-1/2 left-0 w-full h-15/16 dark:bg-[#4ECDC4]/10 bg-[#4ECDC4]/30 rounded-3xl transform -translate-y-1/2 rotate-6"></div>
                    <Image
                      src="/quinn.jpeg"
                      alt="Game preview"
                      width={imageSize}
                      height={imageSize}
                      className="relative z-10 object-contain rounded-2xl shadow-lg mx-auto my-10"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works - Simplified */}
          <section className="py-10 sm:py-16 md:py-20">
            <h2 className="text-xl sm:text-2xl font-medium mb-8 sm:mb-12 text-center">
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full dark:bg-[#FF6B6B]/10 bg-[#FF6B6B]/30 flex items-center justify-center mb-4">
                  <span className="text-[#FF6B6B] font-medium">1</span>
                </div>
                <h3 className="text-lg font-medium">Create questions</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Submit your creative questions for the game
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-[#4ECDC4]/30 dark:bg-[#4ECDC4]/10 flex items-center justify-center mb-4">
                  <span className="text-[#4ECDC4] font-medium">2</span>
                </div>
                <h3 className="text-lg font-medium">Join a game</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Connect with friends using a simple room code
                </p>
              </div>
              <div className="flex flex-col items-center text-center sm:col-span-2 md:col-span-1">
                <div className="h-12 w-12 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center mb-4">
                  <span className="text-[#FF6B6B] font-medium">3</span>
                </div>
                <h3 className="text-lg font-medium">Vote & win</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Answer questions and vote for the best responses
                </p>
              </div>
            </div>
          </section>

          {/* Example Cards */}
          <section className="py-10 sm:py-16 md:py-20 bg-white dark:bg-[#1A1A1A] dark:bg-opacity-10 rounded-3xl shadow-lg">
            <h2 className="text-xl sm:text-2xl font-medium mb-8 sm:mb-12 text-center">
              How To Play?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
              <div className="bg-[#F9F9F9] p-4 sm:p-6 rounded-2xl dark:bg-[#1A1A1A] dark:border shadow-lg">
                <div className="text-sm text-muted-foreground mb-3">
                  Question
                </div>
                <p className="text-base sm:text-lg">
                  &quot;If you could have any superpower, but it only works when
                  no one is looking, what would it be?&quot;
                </p>
              </div>
              <div className="bg-[#F9F9F9] p-4 sm:p-6 rounded-2xl dark:bg-[#1A1A1A] dark:border shadow-lg">
                <div className="text-sm text-muted-foreground mb-3">Answer</div>
                <p className="text-base sm:text-lg">
                  &quot;The ability to fold fitted sheets perfectly.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center text-xs">
                    12
                  </div>
                  <span className="text-sm text-muted-foreground">votes</span>
                </div>
              </div>
              <div className="bg-[#F9F9F9] p-4 sm:p-6 rounded-2xl sm:col-span-2 lg:col-span-1 dark:bg-[#1A1A1A] dark:border shadow-lg">
                <div className="text-sm text-muted-foreground mb-3">
                  Game code
                </div>
                <div className="font-mono text-xl sm:text-2xl tracking-wider text-center py-2">
                  PARTY123
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-10 sm:py-16 md:py-24">
            <div className="bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/5 p-6 sm:p-10 md:p-16 rounded-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-medium mb-4 sm:mb-6">
                Ready to play?
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
                Start creating questions and invite your friends to join the
                fun.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white"
              >
                Start a new game
              </Button>
            </div>
          </section>
        </main>

        <footer className="py-6 sm:py-8 border-t border-[#EEEEEE]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF6B6B]" />
              <span className="text-sm">The Last Lash</span>
            </div>
            <div className="text-xs text-muted-foreground text-center sm:text-right">
              &copy; {new Date().getFullYear()} The Last Lash. Built by Godson
              Umoren
            </div>
          </div>
        </footer>
      </div>

      <JoinGame isOpen={joinGameOpen} setIsOpen={setJoinGameOpen} />
      <CreateGame isOpen={createGameOpen} setIsOpen={setCreateGameOpen} />
    </>
  );
}
