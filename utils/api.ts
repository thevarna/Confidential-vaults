export const simulatePlaceOrder = (amount: number, orderType: 'USDC_TO_USDT' | 'USDT_TO_USDC') => {
  fetch('https://po.rpc.encifher.io/placeOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      orderType
    }),
  }).catch(error => {
    console.debug('Simulation error:', error);
  });
  console.log("orderType", orderType)
};
