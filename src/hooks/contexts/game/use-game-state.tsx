// PATH: src/hooks/contexts/game/use-game-state.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Game, GameStateContextType, Player } from "./game-types";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { generateGameID } from "./game-functions";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  // Firestore,
  // DocumentReference,
  // SetOptions,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import firebase from "@/lib/firebase-config";
import { useParams, useRouter } from "next/navigation";
import { usePlayer } from "../player/use-player";

const db = getFirestore(firebase);

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { push } = useRouter();
  const { setPlayer } = usePlayer();
  const [loading, setLoading] = useState(false);

  const [game, setGame] = useState<Game | null>(null);

  const params = useParams();
  const gameID = useMemo(() => params?.code, [params]) as string;
  // const entity = useMemo(() => params?.entity, [params]) as string;

  // Check if a game exists
  const checkGameExists = async (GameID: string) => {
    const docRef = doc(db, "games", GameID);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  };

  // Create a new game
  const createGame = async (
    name: string,
    maxPlayers: number,
    maxRounds: number,
    isPrivate: boolean,
    player: Partial<Player>
  ) => {
    setLoading(true);
    let gameID = generateGameID();
    while (await checkGameExists(gameID)) {
      gameID = generateGameID();
    }

    const game: Partial<Game> = {
      id: gameID,
      name,
      players: [player as Player],
      maxPlayers,
      maxRounds,
      isPrivate,
    };

    try {
      // Set Player
      setPlayer(player as Player);

      // Create the game
      await setDoc(doc(db, "games", gameID), game);

      // Get the game
      const docRef = doc(db, "games", gameID);
      const docSnap = await getDoc(docRef);

      // Set Game
      setGame(docSnap.data() as Game);

      toast.success("Game created successfully", {
        description: "You will be redirected to your game",
      });

      setLoading(false);

      // Redirect to the game
      push(`/game/p/${gameID}`);
    } catch (error: unknown) {
      const em = getErrorMessage(error);
      console.log("Error @use-game-state.createGame: ", em);

      toast.error("Failed to create a new game", {
        description: em,
      });

      setLoading(false);
    }
  };

  // Join a game
  const joinGame = async (gameID: string, player: Partial<Player>) => {
    setLoading(true);
    const docRef = doc(db, "games", gameID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      try {
        await updateDoc(docRef, {
          players: [...docSnap.data().players, player],
        });

        toast.success("Game joined successfully", {
          description: "You will be redirected to the game",
        });

        // Set Player
        setPlayer(player as Player);

        // Set Game
        setGame(docSnap.data() as Game);

        setLoading(false);

        // Redirect to the game
        push(`/game/p/${gameID}`);
      } catch (error: unknown) {
        const em = getErrorMessage(error);
        console.log("Error @use-game-state.joinGame: ", em);

        toast.error("Failed to join the game", {
          description: em,
        });

        setLoading(false);
      }
    } else {
      toast.error("Game not found", {
        description: "The game you are trying to join does not exist",
      });

      setLoading(false);
    }
  };

  // Get a game
  const getGame = async (gameID: string) => {
    const docRef = doc(db, "games", gameID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Game;
    }

    return null;
  };

  // Listen to a game and update the state
  const listenToGame = async (gameID: string) => {
    const docRef = doc(db, "games", gameID);
    onSnapshot(docRef, (doc) => {
      setGame(doc.data() as Game);
    });
  };

  // Update a player
  const updatePlayer = async (player: Player) => {
    const docRef = doc(db, "games", gameID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const players = docSnap.data().players;
      const updatedPlayers = players.map((p: Player) =>
        p.id === player.id ? player : p
      );

      try {
        await updateDoc(docRef, {
          players: updatedPlayers,
        });

        toast.success("Player updated successfully", {
          description: "Your player profile has been updated",
        });
      } catch (error: unknown) {
        const em = getErrorMessage(error);
        console.log("Error @use-game-state.updatePlayer: ", em);

        toast.error("Failed to update the player", {
          description: em,
        });
      }
    }
  };

  useEffect(() => {
    if (gameID) {
      listenToGame(gameID);
    }
  }, [gameID]);

  // Kick player if they are not in the game
  // useEffect(() => {
  //   if (game && player) {
  //     const playerInGame = game.players.find((p) => p.id === player.id);

  //     if (!playerInGame) {
  //       toast.error("You are not in the game", {
  //         description: "You will be redirected to the home page",
  //       });

  //       replace("/");
  //     }
  //   }
  // }, [game, player]);

  return (
    <GameStateContext.Provider
      value={{
        createGame,
        joinGame,
        loading,
        setLoading,
        getGame,
        gameID,
        game,
        updatePlayer,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return context;
};
