"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type XPLevelProps = {
  xp: number | null;
};

type LevelInfo = {
  level: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  progressColor: string;
  xpRequired: number;
};

const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: "New Donor",
    icon: <Star className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    progressColor: "bg-blue-600",
    xpRequired: 0,
  },
  {
    level: 5,
    name: "Regular Donor",
    icon: <Trophy className="h-5 w-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    progressColor: "bg-green-600",
    xpRequired: 500,
  },
  {
    level: 10,
    name: "Community Hero",
    icon: <Zap className="h-5 w-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    progressColor: "bg-purple-600",
    xpRequired: 1000,
  },
  {
    level: 20,
    name: "Elite Donor",
    icon: <Crown className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    progressColor: "bg-amber-600",
    xpRequired: 2000,
  },
];

function getCurrentLevel(xp: number): LevelInfo {
  // Find the highest level the user has achieved
  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      break;
    }
  }
  return currentLevel;
}

function getNextLevel(xp: number): LevelInfo | null {
  // Find the next level to achieve
  for (const level of LEVELS) {
    if (xp < level.xpRequired) {
      return level;
    }
  }
  return null; // Max level reached
}

function calculateProgress(
  xp: number,
  currentLevel: LevelInfo,
  nextLevel: LevelInfo | null
): number {
  if (!nextLevel) {
    return 100; // Max level reached
  }
  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  return Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
}

export default function XPLevel({ xp }: XPLevelProps) {
  const currentXP = xp ?? 0;
  const currentLevel = getCurrentLevel(currentXP);
  const nextLevel = getNextLevel(currentXP);
  const progress = calculateProgress(currentXP, currentLevel, nextLevel);
  const xpToNext = nextLevel ? nextLevel.xpRequired - currentXP : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border-2 ${currentLevel.borderColor} ${currentLevel.bgColor} p-6 shadow-lg`}
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-current to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${currentLevel.bgColor} border ${currentLevel.borderColor}`}
            >
              <div className={currentLevel.color}>{currentLevel.icon}</div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Donor Level
              </p>
              <h3 className={`text-xl font-bold ${currentLevel.color}`}>
                {currentLevel.name}
              </h3>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${currentLevel.color} ${currentLevel.borderColor} border-2 font-bold text-lg px-3 py-1`}
          >
            Level {currentLevel.level}
          </Badge>
        </div>

        {/* XP Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${currentLevel.color}`} />
              <span className="text-sm font-medium text-muted-foreground">
                Experience Points
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${currentLevel.color}`}>
                {currentXP}
              </span>
              <span className="text-sm text-muted-foreground">XP</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${currentLevel.progressColor} shadow-sm`}
              />
            </div>
            {nextLevel ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {currentLevel.xpRequired} XP
                </span>
                <span className={`font-semibold ${currentLevel.color}`}>
                  {xpToNext} XP to {nextLevel.name}
                </span>
                <span className="text-muted-foreground">
                  {nextLevel.xpRequired} XP
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-xs">
                <span
                  className={`font-semibold ${currentLevel.color} flex items-center gap-1`}
                >
                  <Crown className="h-3 w-3" />
                  Maximum Level Achieved!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Level Milestones Preview */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Level Milestones
          </p>
          <div className="flex items-center gap-2">
            {LEVELS.map((level) => {
              const isAchieved = currentXP >= level.xpRequired;
              const isCurrent = level.level === currentLevel.level;
              return (
                <div
                  key={level.level}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    isAchieved
                      ? `${level.bgColor} ${level.borderColor} border`
                      : "bg-white/30"
                  } ${isCurrent ? "ring-2 ring-offset-1 " + level.borderColor : ""}`}
                  title={`${level.name} - ${level.xpRequired} XP`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
