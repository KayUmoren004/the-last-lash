"use client";
import { usePlayer } from "@/hooks/contexts/player/use-player";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { code } = useParams();
  const { player, playerLoading } = usePlayer();

  if (playerLoading) {
    return (
      <div>
        Loading
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1>Game Page: {code}</h1>
      <p>Player: {player?.name}</p>
      <p>
        Player ID: {player?.id} | Score: {player?.score}
      </p>
    </div>
  );
}
