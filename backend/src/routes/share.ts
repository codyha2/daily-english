import { Router } from "express";
import { dataStore } from "../services/dataStore.js";
import { BADGES } from "../services/gamification.js";

export const shareRouter = Router();

// Generate shareable badge image
shareRouter.post("/badge/:badgeId", async (req, res) => {
    await dataStore.init();
    const { badgeId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const { users, userBadges } = dataStore.snapshot;

    // Check if user has this badge
    const earned = userBadges.find(
        (ub) => ub.userId === userId && ub.badgeId === badgeId
    );

    if (!earned) {
        return res.status(404).json({ error: "Badge not earned by user" });
    }

    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) {
        return res.status(404).json({ error: "Badge not found" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Since we don't have canvas/image generation library installed,
    // we'll return a simple base64-encoded SVG for now
    const svg = generateBadgeSVG(badge, user, earned.earnedAt);
    const base64 = Buffer.from(svg).toString("base64");

    const shareText = `🎉 Tôi vừa đạt được huy hiệu "${badge.name}" trong Daily Basic English! ${user.xp} XP | ${user.streak} ngày streak 🔥`;

    res.json({
        imageBase64: `data:image/svg+xml;base64,${base64}`,
        shareText,
    });
});

function generateBadgeSVG(
    badge: { name: string; icon: string; description: string },
    user: { name: string; xp: number; streak: number },
    earnedAt: string
): string {
    const date = new Date(earnedAt).toLocaleDateString("vi-VN");

    return `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="600" height="400" fill="url(#grad)" rx="20"/>
  
  <!-- Badge icon -->
  <text x="300" y="120" font-size="80" text-anchor="middle">${badge.icon}</text>
  
  <!-- Badge name -->
  <text x="300" y="180" font-size="32" font-weight="bold" fill="white" text-anchor="middle">
    ${badge.name}
  </text>
  
  <!-- Badge description -->
  <text x="300" y="210" font-size="16" fill="#e0e0e0" text-anchor="middle">
    ${badge.description}
  </text>
  
  <!-- User stats -->
  <text x="300" y="270" font-size="24" fill="white" text-anchor="middle">
    ${user.name}
  </text>
  
  <text x="300" y="310" font-size="18" fill="#f0f0f0" text-anchor="middle">
    ${user.xp} XP • ${user.streak} ngày streak 🔥
  </text>
  
  <!-- Earned date -->
  <text x="300" y="350" font-size="14" fill="#d0d0d0" text-anchor="middle">
    Đạt được: ${date}
  </text>
  
  <!-- App branding -->
  <text x="300" y="380" font-size="12" fill="#c0c0c0" text-anchor="middle">
    Daily Basic English
  </text>
</svg>
  `.trim();
}
