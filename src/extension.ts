import { type ExtensionContext } from "vscode";

      const user = await generateAccessToken();

      const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

      socket.on("message", async (data) => {
        const formattedMessage = JSON.parse(data.toString());
        const messageType = formattedMessage.metadata.message_type;
        if (messageType === "session_welcome") {
          window.showInformationMessage("WebSocket is up and running");
          const socketId = formattedMessage.payload.session.id;
          const res = await fetch(
            "https://api.twitch.tv/helix/eventsub/subscriptions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "Client-Id": process.env.TWITCH_CLIENT_ID!,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "channel.channel_points_custom_reward_redemption.add",
                version: "1",
                condition: { broadcaster_user_id: user.account.id },
                transport: {
                  method: "websocket",
                  session_id: socketId,
                },
              }),
            }
          );
          const formattedResponse = (await res.json()) as any;
          if (formattedResponse.data[0].status === "enabled") {
            window.showInformationMessage(
              "Subscribed to channel points endpoint"
            );
          }
        } else if (messageType === "notification") {
          // TODO: Handle point rewards based on user config
        }
      });
}

export function deactivate() {}
