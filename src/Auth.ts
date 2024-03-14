import { authentication } from "vscode";

const getSession = async () => {
  try {
    return await authentication.getSession(
      "twitch",
      [
        `TWITCH_CLIENT_ID:${process.env.TWITCH_CLIENT_ID}`,
        "channel:read:redemptions",
      ],
      {
        createIfNone: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const generateAccessToken = async () => {
  const user = await getSession();

  if (user) {
    return user;
  } else {
    throw new Error("There was an issue signing in to Twitch");
  }
};
