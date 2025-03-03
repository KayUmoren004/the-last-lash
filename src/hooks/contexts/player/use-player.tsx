"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "../game/game-types";

type PlayerContextType = {
  player: Player | null;
  setPlayer: (player: Player) => void;
  playerLoading: boolean;
  setPlayerLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerLoading, setPlayerLoading] = useState(true);

  // On mount, get player from local storage
  useEffect(() => {
    const player = localStorage.getItem("player");
    if (player) {
      setPlayer(JSON.parse(player));

      // Set loading to false
      setPlayerLoading(false);
    }
  }, []);

  // If there is a player in context but not in local storage, save it
  useEffect(() => {
    if (player) {
      const localPlayer = localStorage.getItem("player");
      if (!localPlayer) {
        localStorage.setItem("player", JSON.stringify(player));
      }
    }
  }, [player]);

  // Set the player
  const handleSetPlayer = (player: Player) => {
    setPlayer(player);

    // Save player to local storage
    localStorage.setItem("player", JSON.stringify(player));

    // Set loading to false
    setPlayerLoading(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        player: player,
        setPlayer: handleSetPlayer,
        playerLoading,
        setPlayerLoading,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
