import { PointyClient } from "@stackr/pointy";

export const client = new PointyClient({
  apiKey: process.env.NEXT_PUBLIC_POINTY_API_KEY || '',
  appId: process.env.NEXT_PUBLIC_POINTY_APP_ID || '',
  signer: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
});