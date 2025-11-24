import { Router } from "express";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import dayjs from "dayjs";
import { dataStore } from "../services/dataStore.js";

export const usersRouter = Router();

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  dailyGoal: z.number().min(10).max(30).default(10),
  language: z.enum(["vi", "en"]).default("vi"),
});

usersRouter.post("/", async (req, res) => {
  await dataStore.init();
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const user = {
    id: uuid(),
    xp: 0,
    streak: 0,
    lastSessionAt: undefined,
    notificationTime: "20:00",
    ...parsed.data,
  };
  await dataStore.save((store) => {
    store.users.push(user);
  });
  res.status(201).json({ user });
});

usersRouter.get("/:userId", async (req, res) => {
  await dataStore.init();
  const { userId } = req.params;
  const user = dataStore.snapshot.users.find((item) => item.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

const updatePrefsSchema = z.object({
  dailyGoal: z.number().min(5).max(50).optional(),
  language: z.enum(["vi", "en"]).optional(),
  notificationTime: z.string().optional(),
});

usersRouter.patch("/:userId", async (req, res) => {
  await dataStore.init();
  const parsed = updatePrefsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const { userId } = req.params;
  let updated;
  await dataStore.save((store) => {
    const user = store.users.find((item) => item.id === userId);
    if (!user) return;
    Object.assign(user, parsed.data);
    updated = user;
  });
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json({ user: updated });
});

usersRouter.get("/:userId/streak", async (req, res) => {
  await dataStore.init();
  const { userId } = req.params;
  const user = dataStore.snapshot.users.find((item) => item.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const activeToday = dayjs(user.lastSessionAt).isSame(dayjs(), "day");
  res.json({ streak: user.streak, activeToday });
});


