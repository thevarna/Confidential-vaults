import { PointyClient } from "@stackr/pointy";


export const client = new PointyClient({
  apiKey: process.env.NEXT_PUBLIC_POINTY_API_KEY as string,
  appId: '134',
  signer: process.env.NEXT_PUBLIC_POINTY_PRIVATE_KEY as string,
});
