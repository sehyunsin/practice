//npm install stripe

//pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Example Product',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


//pages/index.js
export default function Home() {
    const handleCheckout = async () => {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.url;
    };
  
    return (
      <div>
        <h1>Stripe 결제 시스템</h1>
        <button onClick={handleCheckout}>결제하기</button>
      </div>
    );
  }


  //pages/success.js
  export default function Success() {
    return (
      <div>
        <h1>결제가 성공적으로 처리되었습니다!</h1>
      </div>
    );
  }


  //pages/cancel.js
  export default function Cancel() {
    return (
      <div>
        <h1>결제가 취소되었습니다.</h1>
      </div>
    );
  }
  


  //.env.local
  STRIPE_SECRET_KEY=your-stripe-secret-key
