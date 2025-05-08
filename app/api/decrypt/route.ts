export async function POST(req: Request) {
    const { handle }: { handle: string } = await req.json();
    try {
      const coprocessorUrl = process.env.COPROCESSOR_URL || 'https://monad.decrypt.rpc.encifher.io';
      const response = await fetch(`${coprocessorUrl}/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                handle
            }),
        })
        const decryptedValue = await response.json();
        return Response.json(decryptedValue);
    } catch (error) {
        throw new Error('Failed to decrypt');
    }
}
