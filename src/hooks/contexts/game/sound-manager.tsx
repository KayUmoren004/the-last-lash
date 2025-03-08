"use client";

import { useEffect, useState } from "react";

interface SoundManagerProps {
  onSoundLoad: (success: boolean) => void;
}

export function SoundManager({ onSoundLoad }: SoundManagerProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Create a dummy audio element to test if audio can be loaded
        const audio = new Audio();

        // Set up event listeners
        const loadPromise = new Promise<void>((resolve, reject) => {
          audio.addEventListener("canplaythrough", () => resolve());
          audio.addEventListener("error", (e) => reject(e));

          // Set a timeout in case loading takes too long
          setTimeout(() => reject(new Error("Audio load timeout")), 5000);
        });

        // Try to load a very small test sound
        audio.src = "/sounds/test-sound.mp3";
        audio.load();

        await loadPromise;
        setLoaded(true);
        onSoundLoad(true);
      } catch (error) {
        console.error("Failed to load sounds:", error);
        setLoaded(false);
        onSoundLoad(false);
      }
    };

    loadSounds();
  }, [onSoundLoad]);

  // This component doesn't render anything visible
  return null;
}
