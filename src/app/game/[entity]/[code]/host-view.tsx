"use client";

import { useEffect, useState, useRef } from "react";
import type { Game, Player } from "@/hooks/contexts/game/game-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Users, Eye, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HostViewProps {
  game: Game;
  code: string;
}

// PATH: src/app/game/[entity]/[code]/host-view.tsx

export function HostView({ game, code }: HostViewProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [spectatorCount, setSpectatorCount] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("default");
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayerCountRef = useRef<number>(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Track the current playing lobby sound
  const currentLobbySound = useRef<HTMLAudioElement | null | undefined>(null);

  // Sound effects
  const joinSoundMap: {
    [key: number]: HTMLAudioElement;
  } = {
    1: new Audio("/sounds/player-joins/1.mp3"),
    2: new Audio("/sounds/player-joins/2.mp3"),
    3: new Audio("/sounds/player-joins/3.mp3"),
    4: new Audio("/sounds/player-joins/4.mp3"),
    5: new Audio("/sounds/player-joins/5.mp3"),
    6: new Audio("/sounds/player-joins/6.mp3"),
    7: new Audio("/sounds/player-joins/7.mp3"),
    8: new Audio("/sounds/player-joins/8.mp3"),
    9: new Audio("/sounds/player-joins/9.mp3"),
    10: new Audio("/sounds/player-joins/10.mp3"),
    11: new Audio("/sounds/player-joins/11.mp3"),
    12: new Audio("/sounds/player-joins/12.mp3"),
    13: new Audio("/sounds/player-joins/13.mp3"),
    14: new Audio("/sounds/player-joins/14.mp3"),
    15: new Audio("/sounds/player-joins/15.mp3"),
    16: new Audio("/sounds/player-joins/16.mp3"),
    17: new Audio("/sounds/player-joins/17.mp3"),
    18: new Audio("/sounds/player-joins/18.mp3"),
  };

  const lobbySoundMap: {
    [key: number]: HTMLAudioElement;
  } = {
    1: new Audio("/sounds/lobby/1.mp3"),
    // 2: new Audio("/sounds/lobby/2.mp3"),
    // 3: new Audio("/sounds/lobby/3.mp3"),
  };

  // Set loop property on all lobby sounds
  useEffect(() => {
    Object.values(lobbySoundMap).forEach((sound) => {
      sound.loop = true;
    });
  }, []);

  const countdownSound = new Audio("/sounds/countdown.mp3");

  // Auto-focus the start button when welcome overlay is shown
  useEffect(() => {
    if (showWelcome && startButtonRef.current) {
      startButtonRef.current.focus();
    }
  }, [showWelcome]);

  // Control audio muting without stopping playback
  useEffect(() => {
    const allSounds = [
      ...Object.values(joinSoundMap),
      ...Object.values(lobbySoundMap),
      countdownSound,
    ];

    allSounds.forEach((sound) => {
      sound.muted = muted;
    });
  }, [muted]);

  // Play random sound from a map
  const playRandomSound = (soundMap: Record<number, HTMLAudioElement>) => {
    if (!audioEnabled) return;

    const keys = Object.keys(soundMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomSound = soundMap[Number.parseInt(randomKey)];

    // Apply mute state
    randomSound.muted = muted;

    randomSound
      .play()
      .catch((err) => console.error("Error playing sound:", err));

    return randomSound;
  };

  // Handle player join sound
  useEffect(() => {
    if (!game || !audioEnabled) return;

    const currentPlayerCount = game.players.length;

    if (
      currentPlayerCount > lastPlayerCountRef.current &&
      lastPlayerCountRef.current > 0
    ) {
      // Pause the lobby music temporarily
      if (currentLobbySound.current) {
        // Store current time and pause
        const lobbyCurrentTime = currentLobbySound.current.currentTime;
        currentLobbySound.current.pause();

        // Play join sound
        const joinSound = playRandomSound(joinSoundMap);

        // When join sound ends, resume lobby music
        joinSound?.addEventListener("ended", () => {
          if (currentLobbySound.current) {
            currentLobbySound.current.currentTime = lobbyCurrentTime;
            currentLobbySound.current
              .play()
              .catch((err) =>
                console.error("Error resuming lobby sound:", err)
              );
          }
        });
      } else {
        // If no lobby sound is playing, just play the join sound
        playRandomSound(joinSoundMap);
      }
    }

    lastPlayerCountRef.current = currentPlayerCount;
  }, [game, game?.players, audioEnabled]);

  // Start countdown when all players have joined
  useEffect(() => {
    if (!game) return;

    const allPlayersJoined = game.players.length === game.maxPlayers;
    const allPlayersReady = game.players.every((player) => player.isReady);

    if (allPlayersJoined && allPlayersReady && !countdown && !game.isStarted) {
      setCountdown(5);

      if (audioEnabled) {
        // Apply mute state but still play
        countdownSound.muted = muted;
        countdownSound
          .play()
          .catch((err) => console.error("Error playing countdown sound:", err));
      }
    }
  }, [game, countdown, muted, audioEnabled]);

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    countdownRef.current = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(null);
        // Game would start here in a real implementation

        // Stop lobby sounds when game starts
        if (currentLobbySound.current) {
          currentLobbySound.current.pause();
          currentLobbySound.current = null;
        }
      }
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // Start and manage lobby music
  useEffect(() => {
    // Only start lobby music if welcome is dismissed and audio is enabled
    if (!showWelcome && audioEnabled) {
      // Start a random lobby sound if none is currently playing
      if (!currentLobbySound.current) {
        const lobbySound = playRandomSound(lobbySoundMap);
        currentLobbySound.current = lobbySound;

        // repeat the process when the sound ends
        lobbySound?.addEventListener("ended", () => {
          if (currentLobbySound.current) {
            currentLobbySound.current = playRandomSound(lobbySoundMap);
          }
        });
      }
    }

    // Cleanup function
    return () => {
      // Stop all sounds when component unmounts
      if (currentLobbySound.current) {
        currentLobbySound.current.pause();
      }

      Object.values(joinSoundMap).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
      });

      Object.values(lobbySoundMap).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
      });

      countdownSound.pause();
      countdownSound.currentTime = 0;
    };
  }, [showWelcome, audioEnabled]);

  // Generate random spectator count for demo
  useEffect(() => {
    setSpectatorCount(Math.floor(Math.random() * 20));
  }, []);

  // Handle starting the host view
  const handleStartHosting = () => {
    setShowWelcome(false);
    setAudioEnabled(true);
  };

  // Toggle mute state
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Get game status message
  const getStatusMessage = () => {
    if (!game) return "Waiting for game...";
    if (countdown !== null) return `Game starting in ${countdown}...`;
    if (game.isStarted) return "Game in progress";
    if (game.players.length < game.maxPlayers) return "Waiting for players...";
    return "Ready to start";
  };

  // Calculate player join percentage
  const getJoinPercentage = () => {
    if (!game) return 0;
    return (game.players.length / game.maxPlayers) * 100;
  };

  // Get background class based on theme
  const getBackgroundClass = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900";
      case "party":
        return "bg-gradient-to-br from-purple-600 via-pink-500 to-red-500";
      case "ocean":
        return "bg-gradient-to-br from-blue-500 via-teal-400 to-emerald-500";
      default:
        return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
    }
  };

  return (
    <div className={cn("min-h-screen p-6", getBackgroundClass())}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Game Code */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Game Lobby</h1>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-white border-white mr-2">
                <Users className="w-4 h-4 mr-1" />
                {game?.players.length || 0}/{game?.maxPlayers || 0} Players
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                <Eye className="w-4 h-4 mr-1" />
                {spectatorCount} Spectators
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-5xl font-mono font-bold tracking-widest bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white">
              {code}
            </div>
            <p className="text-white/80 mt-2 text-sm">Game Code</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <h2 className="text-xl font-bold mb-2">How to Join</h2>
          <p>
            Players can join this game by visiting{" "}
            <span className="font-mono bg-white/20 px-2 py-1 rounded">
              tll.g-umoren.net/.com
            </span>{" "}
            and entering the game code:{" "}
            <span className="font-mono bg-white/20 px-2 py-1 rounded">
              {code}
            </span>
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="text-white text-xl font-medium">
              {getStatusMessage()}
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <div className="ml-4">
                <select
                  aria-label="Theme Selector"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white/10 border-none text-white rounded-md p-2"
                >
                  <option value="default">Default Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="party">Party Theme</option>
                  <option value="ocean">Ocean Theme</option>
                </select>
              </div>
            </div>
          </div>
          <Progress value={getJoinPercentage()} className="mt-2 bg-white/20" />
        </div>

        {/* Countdown Display */}
        {countdown !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="text-9xl font-bold text-white animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {game?.players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}

          {/* Empty Slots */}
          {game &&
            Array.from({
              length: Math.max(0, game.maxPlayers - game.players.length),
            }).map((_, index) => <EmptyPlayerSlot key={`empty-${index}`} />)}
        </div>
      </div>

      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleStartHosting}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to Game Hosting
              </h2>
              <div className="space-y-4">
                <p>
                  You&apos;re hosting a new game with code:{" "}
                  <span className="font-mono font-bold">{code}</span>
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <h3 className="font-medium mb-2">Game Details</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Maximum Players: {game?.maxPlayers || "Loading..."}</li>
                    <li>Rounds: {game?.maxRounds || "Loading..."}</li>
                    <li>Game Name: {game?.name || "Loading..."}</li>
                  </ul>
                </div>
                <p>
                  Share this code with players so they can join your game. Once
                  everyone is ready, the game will begin automatically.
                </p>
                <div className="pt-4">
                  <Button
                    ref={startButtonRef}
                    className="w-full"
                    size="lg"
                    onClick={handleStartHosting}
                  >
                    Start Hosting
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  // Generate a consistent color based on player name
  const getPlayerColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className={cn(
        "p-4 flex flex-col items-center transition-all duration-300 border-0",
        player.isHost
          ? "bg-white/30 backdrop-blur-sm ring-2 ring-yellow-400"
          : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
      )}
    >
      <div className="relative">
        <Avatar className="w-20 h-20 border-2 border-white">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${player.name}`}
          />
          <AvatarFallback className={getPlayerColor(player.name)}>
            {getInitials(player.name)}
          </AvatarFallback>
        </Avatar>
        {player.isHost && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
            <Crown className="w-4 h-4 text-yellow-900" />
          </div>
        )}
        {player.isReady && (
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></div>
        )}
      </div>
      <h3 className="mt-3 font-bold text-white">{player.name}</h3>
      <div className="mt-1 text-xs text-white/70">
        {player.isHost ? "Host" : "Player"}
      </div>
      <div className="mt-2 text-sm text-white/90">Score: {player.score}</div>
    </Card>
  );
}

function EmptyPlayerSlot() {
  return (
    <Card className="p-4 flex flex-col items-center justify-center h-[180px] bg-white/5 backdrop-blur-sm border-dashed border-2 border-white/20">
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
        <Users className="w-8 h-8 text-white/30" />
      </div>
      <p className="mt-3 text-white/50 text-sm">Waiting for player...</p>
    </Card>
  );
}
