import Razorpay from "razorpay";

export class RazorpayInstance {
  razorpayInstance: Razorpay;

  constructor() {
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async getAllPlans() {
    const plans = await this.razorpayInstance.plans.all();
    return plans || [];
  }
}

export const razorpayInstance = new RazorpayInstance();
