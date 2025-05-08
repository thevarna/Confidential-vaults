import axios from "axios";

export function addPointsForSwap(address: string){
    try{
    const data = [
        {
          name: "encifher_swap",
          account: address,
          pointSystemId: 7554,
          points:100
        }
      ];
      
      axios.post('https://track.stack.so/event', data, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_STACKSO_API_KEY
        }
      })
    } catch (error) {
        console.log(error)
    }
}

export function addPointsForPayment(address: string){
    try{
    const data = [
        {
          name: "encifher_payment",
          account: address,
          pointSystemId: 7554,
          points:50
        }
      ];
      
      axios.post('https://track.stack.so/event', data, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_STACKSO_API_KEY
        }
      })
    } catch (error) {
        console.log(error)
    }
}