"use client";

import { useEffect, useState, useRef } from "react";
import type { Game, Player } from "@/hooks/contexts/game/game-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Users,
  Volume2,
  VolumeX,
  Check,
  LogOut,
  Edit,
  Play,
  Trash2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
interface PlayerLobbyViewProps {
  game: Game;
  code: string;
  player: Player;
  onUpdatePlayer: (player: Player) => void;
  onLeaveGame: () => void;
  onStartGame?: () => void;
  onDeleteLobby?: () => void;
}

export function PlayerLobbyView({
  game,
  code,
  player,
  onUpdatePlayer,
  onLeaveGame,
  onStartGame,
  onDeleteLobby,
}: PlayerLobbyViewProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(player.name);
  const [avatarSeed, setAvatarSeed] = useState<string>(player.name);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ id: string; player: Player; content: string }>
  >([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readyBtnRef = useRef<HTMLButtonElement>(null);

  // Sound effects
  const joinSound = new Audio("/sounds/player-joins/1.mp3");
  const readySound = new Audio("/sounds/ready.mp3");
  const countdownSound = new Audio("/sounds/countdown.mp3");
  const gameStartSound = new Audio("/sounds/game-start.mp3");

  // Control audio muting
  useEffect(() => {
    const allSounds = [joinSound, readySound, countdownSound, gameStartSound];
    allSounds.forEach((sound) => {
      sound.muted = muted;
    });
  }, [muted]);

  // Auto-focus the ready button when component mounts
  useEffect(() => {
    if (!player.isReady && readyBtnRef.current) {
      readyBtnRef.current.focus();
    }
  }, [player.isReady]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start countdown when all players are ready or game is started by host
  useEffect(() => {
    // Game is started by host or all players are ready
    const allPlayersReady = game.players.every((p) => p.isReady);
    const readyToStart = allPlayersReady && game.players.length >= 2;

    if ((game.isStarted || readyToStart) && !countdown && !game.isFinished) {
      setCountdown(5);

      if (!muted) {
        countdownSound
          .play()
          .catch((err) => console.error("Error playing countdown sound:", err));
      }
    }
  }, [game, countdown, muted]);

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    countdownRef.current = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(null);

        // Play game start sound
        if (!muted) {
          gameStartSound
            .play()
            .catch((err) =>
              console.error("Error playing game start sound:", err)
            );
        }

        // Trigger game start animation
        setReaction("🎮");
        setTimeout(() => setReaction(null), 2000);
      }
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown, muted]);

  // Handle marking player as ready
  const handleReady = () => {
    const updatedPlayer = { ...player, isReady: true };
    onUpdatePlayer(updatedPlayer);

    if (!muted) {
      readySound
        .play()
        .catch((err) => console.error("Error playing ready sound:", err));
    }

    toast.info("You're ready!", {
      description: "Waiting for other players to get ready...",
      duration: 3000,
    });
  };

  // Handle player name change
  const handleNameChange = () => {
    if (newName.trim() === "") {
      toast.error("Invalid Name", {
        description: "Name cannot be empty",
        duration: 3000,
      });
      return;
    }

    const updatedPlayer = { ...player, name: newName };
    onUpdatePlayer(updatedPlayer);
    setEditingName(false);

    toast.success("Name Updated", {
      description: `Your name has been changed to ${newName}`,
      duration: 3000,
    });
  };

  // Generate a new avatar
  const generateNewAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    setAvatarSeed(randomSeed);

    const updatedPlayer = { ...player, avatarSeed: randomSeed };
    onUpdatePlayer(updatedPlayer);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      player: player,
      content: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  // Handle sending an emoji reaction
  const handleSendReaction = (emoji: string) => {
    setReaction(emoji);

    // Clear the reaction after 2 seconds
    setTimeout(() => {
      setReaction(null);
    }, 2000);
  };

  // Toggle mute state
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Calculate player join percentage
  const getJoinPercentage = () => {
    return (game.players.length / game.maxPlayers) * 100;
  };

  // Get initials from player name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with Game Code */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{game.name}</h1>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-white border-white mr-2">
                <Users className="w-4 h-4 mr-1" />
                {game.players.length}/{game.maxPlayers} Players
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl sm:text-4xl font-mono font-bold tracking-widest bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
              {code}
            </div>
            <p className="text-white/80 mt-1 text-sm">Game Code</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-white text-lg font-medium">
              {countdown !== null
                ? `Game starting in ${countdown}...`
                : game.isStarted
                ? "Game in progress"
                : game.players.every((p) => p.isReady)
                ? "Everyone is ready!"
                : "Waiting for players to get ready..."}
            </div>
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
          </div>
          <Progress value={getJoinPercentage()} className="mt-2 bg-white/20" />
        </div>

        {/* Player Card and Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Player Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-0 col-span-1">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 border-2 border-white">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed}`}
                  />
                  <AvatarFallback className="bg-purple-500">
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
                {player.isHost && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Crown className="w-4 h-4 text-yellow-900" />
                  </div>
                )}
                {player.isReady && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-white flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Editing Name */}
              {editingName ? (
                <div className="w-full mb-4">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white/20 border-0 text-white placeholder:text-white/50 mb-2"
                    placeholder="Enter new name"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleNameChange}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingName(false);
                        setNewName(player.name);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {player.name}
                  </h3>
                  <div className="text-sm text-white/70 mb-4">
                    {player.isHost ? "Host" : "Player"}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                {!player.isReady ? (
                  <Button
                    ref={readyBtnRef}
                    className="w-full"
                    onClick={handleReady}
                    disabled={game.isStarted}
                  >
                    <Check className="mr-2 h-4 w-4" /> I&apos;m Ready
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled
                  >
                    <Check className="mr-2 h-4 w-4" /> Ready
                  </Button>
                )}

                {!editingName && !game.isStarted && (
                  <Button
                    variant="outline"
                    className="w-full text-white border-white/50 hover:bg-white/20"
                    onClick={() => setEditingName(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Change Name
                  </Button>
                )}

                {!game.isStarted && (
                  <Button
                    variant="outline"
                    className="w-full text-white border-white/50 hover:bg-white/20"
                    onClick={generateNewAvatar}
                  >
                    Change Avatar
                  </Button>
                )}

                {!game.isStarted && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onLeaveGame}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Leave Game
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Players List and Chat */}
          <div className="col-span-1 md:col-span-2">
            <Tabs defaultValue="players" className="w-full">
              <TabsList className="w-full mb-4 bg-white/10">
                <TabsTrigger
                  value="players"
                  className="text-white data-[state=active]:bg-white/20"
                >
                  Players
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="text-white data-[state=active]:bg-white/20"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="emojis"
                  className="text-white data-[state=active]:bg-white/20"
                >
                  Reactions
                </TabsTrigger>
              </TabsList>

              {/* Players Tab */}
              <TabsContent value="players" className="mt-0">
                <Card className="bg-white/10 backdrop-blur-sm border-0">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {game.players.map((p) => (
                        <div
                          key={p.id}
                          className={cn(
                            "p-3 rounded-lg flex flex-col items-center transition-all duration-300",
                            p.isHost
                              ? "bg-white/30 ring-2 ring-yellow-400"
                              : "bg-white/20 hover:bg-white/30"
                          )}
                        >
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-white">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${
                                  //   p.avatarSeed || p.name
                                  p.name
                                }`}
                              />
                              <AvatarFallback className="bg-purple-500">
                                {getInitials(p.name)}
                              </AvatarFallback>
                            </Avatar>
                            {p.isHost && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                                <Crown className="w-3 h-3 text-yellow-900" />
                              </div>
                            )}
                            {p.isReady && (
                              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                            )}
                          </div>
                          <h3 className="mt-2 font-medium text-white text-sm text-center">
                            {p.name}
                          </h3>
                          <div className="mt-1 text-xs text-white/70">
                            {p.isHost ? "Host" : "Player"}
                          </div>
                        </div>
                      ))}

                      {/* Empty Slots */}
                      {Array.from({
                        length: Math.max(
                          0,
                          game.maxPlayers - game.players.length
                        ),
                      }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="p-3 rounded-lg flex flex-col items-center justify-center bg-white/5 border-dashed border-2 border-white/20"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white/30" />
                          </div>
                          <p className="mt-2 text-white/50 text-xs">
                            Waiting...
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="mt-0">
                <Card className="bg-white/10 backdrop-blur-sm border-0">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-64">
                      <div className="flex-1 overflow-y-auto mb-3 p-2 bg-white/5 rounded-lg">
                        {messages.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-white/50 text-sm">
                            No messages yet. Start the conversation!
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "mb-2 p-2 rounded-lg max-w-[80%]",
                                msg.player.id === player.id
                                  ? "bg-indigo-600 ml-auto"
                                  : "bg-white/20"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${
                                      //   msg.player.avatarSeed || msg.player.name
                                      msg.player.name
                                    }`}
                                  />
                                  <AvatarFallback className="bg-purple-500 text-[10px]">
                                    {getInitials(msg.player.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-white">
                                  {msg.player.id === player.id
                                    ? "You"
                                    : msg.player.name}
                                </span>
                              </div>
                              <p className="text-sm text-white">
                                {msg.content}
                              </p>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="bg-white/20 border-0 text-white placeholder:text-white/50"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emojis Tab */}
              <TabsContent value="emojis" className="mt-0">
                <Card className="bg-white/10 backdrop-blur-sm border-0">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {["👍", "👋", "❤️", "😂", "😮", "🎉", "👏", "🔥"].map(
                        (emoji) => (
                          <Button
                            key={emoji}
                            variant="outline"
                            className="h-12 text-xl border-white/20 hover:bg-white/20"
                            onClick={() => handleSendReaction(emoji)}
                          >
                            {emoji}
                          </Button>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Host Controls - Only visible to host */}
        {player.isHost && (
          <Card className="bg-white/10 backdrop-blur-sm border-0 mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white flex items-center mb-4">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" /> Host Controls
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onStartGame}
                  disabled={game.players.length < 2 || game.isStarted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-2 h-4 w-4" /> Start Game
                </Button>
                <Button variant="destructive" onClick={onDeleteLobby}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Lobby
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Countdown Display */}
      {countdown !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="text-9xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Reaction Animation */}
      {reaction && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
          <div className="text-8xl animate-bounce">{reaction}</div>
        </div>
      )}
    </div>
  );
}
