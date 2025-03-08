"use client";

import { useState } from "react";
import { useGameState } from "@/hooks/contexts/game/use-game-state";
import { usePlayer } from "@/hooks/contexts/player/use-player";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { HostView } from "./host-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Player } from "@/hooks/contexts/game/game-types";
import { toast } from "sonner";
import { PlayerLobbyView } from "./player-view";

export default function Page() {
  const { code, entity } = useParams();
  const { player, playerLoading, setPlayer } = usePlayer();
  const { game, loading, updatePlayer } = useGameState();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  // Handle player update
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);

    // In a real implementation, this would also update the player in the database
    updatePlayer(updatedPlayer);

    toast.success("Profile Updated", {
      description: "Your player profile has been updated",
      duration: 3000,
    });
  };

  // Handle leaving the game
  const handleLeaveGame = () => {
    setShowLeaveDialog(true);
  };

  // Confirm leaving the game
  const confirmLeaveGame = () => {
    // In a real implementation, this would remove the player from the game
    // removePlayerFromGame(player.id, gameID);

    // Clear player data
    localStorage.removeItem("player");

    // Redirect to homepage
    router.push("/");

    toast.info("Left Game", {
      description: "You have successfully left the game",
      duration: 3000,
    });
  };

  // Handle starting the game (for host)
  const handleStartGame = () => {
    // In a real implementation, this would update the game state
    // startGame(gameID);

    toast("Game Started", {
      description: "The game is now starting!",
      duration: 3000,
    });

    // Redirect to the actual game page
    // router.push(`/game/play/${code}`);
  };

  // Handle deleting the lobby (for host)
  const handleDeleteLobby = () => {
    setShowDeleteDialog(true);
  };

  // Confirm deleting the lobby
  const confirmDeleteLobby = () => {
    // In a real implementation, this would delete the game
    // deleteGame(gameID);

    // Redirect to homepage
    router.push("/");

    toast.success("Lobby Deleted", {
      description: "The game lobby has been deleted",
      duration: 3000,
    });
  };

  if (playerLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin h-8 w-8" />
          <p className="text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!player || !game) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg">Player or game not found</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => router.push("/")}
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {entity === "s" ? (
        <HostView game={game} code={code as string} />
      ) : (
        <PlayerLobbyView
          game={game}
          code={code as string}
          player={player}
          onUpdatePlayer={handleUpdatePlayer}
          onLeaveGame={handleLeaveGame}
          onStartGame={player.isHost ? handleStartGame : undefined}
          onDeleteLobby={player.isHost ? handleDeleteLobby : undefined}
        />
      )}

      {/* Leave Game Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this game? You won&apos;t be able
              to rejoin unless someone shares the code with you again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLeaveGame}
              className="bg-red-500 hover:bg-red-600"
            >
              Leave Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lobby Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game Lobby?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this game lobby? This will kick
              all players and the lobby will no longer be accessible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLobby}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Lobby
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
