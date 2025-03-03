"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fieldset } from "../ui/fieldset";
import { Switch } from "../ui/switch";
import { useGameState } from "@/hooks/contexts/game/use-game-state";
import type { Player } from "@/hooks/contexts/game/game-types";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "lucide-react";

type CreateGameProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Your name must be at least 2 characters",
    })
    .max(50, {
      message: "Your name must be at most 50 characters",
    }),
  maxRounds: z.number().int().min(2).max(10).default(5),
  maxPlayers: z.number().int().min(2).default(15),
  isPrivate: z.boolean().default(false),
  createdAt: z.date(),
});

export default function CreateGame({ isOpen, setIsOpen }: CreateGameProps) {
  const { createGame, loading } = useGameState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      maxRounds: 5,
      maxPlayers: 15,
      isPrivate: false,
      createdAt: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const player: Partial<Player> = {
      id: uuidv4(),
      name: values.name,
      score: 0,
      isHost: true,
      isReady: false,
      questions: [],
    };

    await createGame(
      values.name,
      values.maxPlayers,
      values.maxRounds,
      values.isPrivate,
      player
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Game</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new game.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Quinn Phillips"
                      {...field}
                      disabled={form.formState.isSubmitting || loading}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Fieldset
              legend="Game Settings"
              legendClassName="text-lg font-semibold px-2"
              className="flex flex-col gap-4"
            >
              {/* Max Players */}
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Players</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={form.formState.isSubmitting || loading}
                      />
                    </FormControl>
                    <FormDescription>
                      The maximum number of players allowed in the game.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Rounds */}
              <FormField
                control={form.control}
                name="maxRounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Rounds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={form.formState.isSubmitting || loading}
                      />
                    </FormControl>
                    <FormDescription>
                      The maximum number of rounds in the game.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Private Switch */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Private Game?</FormLabel>
                      <FormDescription>
                        Only players with the game ID can join.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={form.formState.isSubmitting || loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Fieldset>
            <div className="flex justify-end w-full">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  !form.formState.isDirty ||
                  loading
                }
              >
                {loading && <Loader className="mr-2 animate-spin" size={16} />}
                {loading ? "Creating Game..." : "Create Game"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
