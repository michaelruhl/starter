window.addEventListener("DOMContentLoaded", async () => {
  // fetch publishable key from server
  const { publishableKey } = await fetch("/config").then((r) => r.json());
  const stripe = Stripe(publishableKey);

  // fetch client secret for the payment intent from the server
  const { clientSecret } = await fetch("/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: '{}'
  }).then((r) => r.json());

  const elements = stripe.elements({ clientSecret });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  const form = document.getElementById("payment-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { error } = await stripe.confirmPayment({
      //confirmPayment will always redirect to the return_url

      elements,
      confirmParams: {
        return_url: window.location.href.split("?")[0] + "complete.html",
      },
    });
    
    if (error) {
      const messages = document.getElementById("error-messages");
      messages.innerText = error.message;
    }
  });
});
