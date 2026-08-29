import { buttonVariants } from "components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "components/ui/Dialog";
import { Label } from "components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/Select";
import { Switch } from "components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/Tabs";
import { toast } from "components/ui/Toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/Tooltip";
import { m } from "framer-motion";
import { useGameStore } from "libs/Store";
import { useCallback, useEffect } from "react";
import { useTheme } from "@/theme";

export default function SettingsPanel() {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const updateGameOptions = useGameStore((state) => state.updateGameOptions);
  const updateGameTheme = useGameStore((state) => state.updateGameTheme);

  const { resolvedTheme, setTheme } = useTheme();

  const handleGameModeChange = useCallback(
    (gameModeSelection: typeof gameOptions.gameMode | null) => {
      if (gameModeSelection === null) {
        return;
      }

      updateGameOptions({
        gameMode: gameModeSelection,
      });

      toast.add({
        description: `
          ${gameModeSelection} will now launch on your next game
        `,
        title: "Game mode changed!",
      });
    },
    [updateGameOptions]
  );

  const handlePerformanceDisplayChange = useCallback(
    (enablePerformanceDisplay: boolean) =>
      updateGameOptions({
        performanceDisplay: enablePerformanceDisplay,
      }),
    [updateGameOptions]
  );

  const handleDarkModeChange = useCallback(
    (enableDarkMode: boolean) => setTheme(enableDarkMode ? "dark" : "light"),
    [setTheme]
  );

  const handleAntialiasChange = useCallback(
    (enableAntialias: boolean) =>
      updateGameOptions({
        antialias: enableAntialias,
      }),
    [updateGameOptions]
  );

  const handlePowerPreferenceChange = useCallback(
    (powerPreferenceSelection: typeof gameOptions.powerPreference | null) => {
      if (powerPreferenceSelection === null) {
        return;
      }

      updateGameOptions({
        powerPreference: powerPreferenceSelection,
      });
    },
    [updateGameOptions]
  );

  const handleStageShakeChange = useCallback(
    (enableStageShake: boolean) =>
      updateGameOptions({
        ...gameOptions,
        stageShake: enableStageShake,
      }),
    [gameOptions, updateGameOptions]
  );

  useEffect(() => {
    /**
     * Updates the theme in the game store because the useTheme hook won't work
     * inside Pixi components
     */
    updateGameTheme(resolvedTheme);
  }, [resolvedTheme, updateGameTheme]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <m.button
            className={buttonVariants({ variant: "secondary" })}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        }
      >
        Settings
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="graphics">Graphics</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Game Mode</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Select the preferred game mode
                </p>
              </div>
              <Select onValueChange={handleGameModeChange}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={gameOptions.gameMode} />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="classic">classic</SelectItem>
                  <SelectItem value="nemein">nemein</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Performance Display</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Show latency and frame rate
                </p>
              </div>
              <Switch
                checked={gameOptions.performanceDisplay}
                onCheckedChange={handlePerformanceDisplayChange}
              />
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Dark Mode</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Embrace the dark
                </p>
              </div>
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={handleDarkModeChange}
              />
            </div>
          </TabsContent>
          <TabsContent value="graphics">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Antialiasing</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Smooth out block edges
                </p>
              </div>
              <Switch
                checked={gameOptions.antialias}
                onCheckedChange={handleAntialiasChange}
              />
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">GPU Mode</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Change the WebGL GPU power preference
                </p>
              </div>
              <TooltipProvider delay={700}>
                <Tooltip>
                  <TooltipTrigger render={<span className="inline-flex" />}>
                    <Select onValueChange={handlePowerPreferenceChange}>
                      <SelectTrigger className="w-44">
                        <SelectValue
                          placeholder={gameOptions.powerPreference}
                        />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectItem value="default">default</SelectItem>
                        <SelectItem value="high-performance">
                          high performance
                        </SelectItem>
                        <SelectItem value="low-power">low power</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      It is recommended to leave this on default. This option is
                      a hint to help your system pick your preferred GPU
                      configuration if you have more than 1 GPU available.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
          <TabsContent value="accessibility">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Stage Shake</Label>
                <p className="text-gray-600 text-xs dark:text-gray-300">
                  Toggle the shake effect on line clear
                </p>
              </div>
              <Switch
                checked={gameOptions.stageShake}
                onCheckedChange={handleStageShakeChange}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-center">
          <DialogClose className={buttonVariants({ variant: "secondary" })}>
            Confirm
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
