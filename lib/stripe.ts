import Stripe from "stripe";

export function getStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2026-04-22.dahlia",
  });
}
