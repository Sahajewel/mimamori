import webpush from "web-push";
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
};

export async function sendPushToSeniorMembers(
  seniorId: string,
  excludeUserId: string,
  payload: NotificationPayload,
) {
  const members = await prisma.seniorMember.findMany({
    where: {
      seniorId,
      userId: { not: excludeUserId },
    },
    include: {
      user: {
        include: {
          pushSubscriptions: true,
        },
      },
    },
  });

  const notifications = members.flatMap((member) =>
    member.user.pushSubscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload),
        );
      } catch (error) {
        console.error("Push failed:", error);
        // expired subscription delete করো
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
    }),
  );

  await Promise.allSettled(notifications);
}
