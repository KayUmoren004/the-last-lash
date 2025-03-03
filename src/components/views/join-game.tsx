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
import { useGameState } from "@/hooks/contexts/game/use-game-state";
import type { Player } from "@/hooks/contexts/game/game-types";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "lucide-react";

type JoinGameProps = {
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
  gameID: z.string().length(4, {
    message: "The game code must be 4 characters",
  }),
});

export default function JoinGame({ isOpen, setIsOpen }: JoinGameProps) {
  const { joinGame, loading } = useGameState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gameID: "",
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

    await joinGame(values.gameID, player);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Game</DialogTitle>
          <DialogDescription>
            Fill out the form below to join a game.
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

            {/* Code */}
            <FormField
              control={form.control}
              name="gameID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Game Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCD1"
                      {...field}
                      disabled={form.formState.isSubmitting || loading}
                      maxLength={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the game ID provided by the host.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end w-full">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  loading
                }
              >
                {loading && <Loader className="mr-2 animate-spin" size={16} />}
                {loading ? "Joining Game..." : "Join Game"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
