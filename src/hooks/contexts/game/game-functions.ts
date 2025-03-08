// PATH: src/hooks/contexts/game/game-functions.ts

// Generate Random Room ID (4 numbers and 1 letter)
export const generateGameID = (): string => {
  let roomID = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 4; i++) {
    roomID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return roomID;
};
