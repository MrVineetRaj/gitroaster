import { db } from "@/lib/prisma";
import Razorpay from "razorpay";
import { Payments } from "razorpay/dist/types/payments";
import { Subscriptions } from "razorpay/dist/types/subscriptions";

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

  async createSubscription({
    planId,
    member_count,
    username,
    orgname,
    email,
  }: {
    planId: string;
    member_count: number;
    username: string;
    orgname: string;
    email: string;
  }) {
    const subscription = await this.razorpayInstance.subscriptions.create({
      plan_id: planId,
      customer_notify: true,
      quantity: member_count,
      total_count: 10*12,
      notes: {
        username,
        orgname,
        email,
      },
    });

    return subscription;
  }
}

export class RazorpayActions {
  async upsertSubscriptionDetails(
    isPaymentIncluded: boolean,
    subscription: Subscriptions.RazorpaySubscription,
    payment?: Payments.RazorpayPayment
  ) {
    const subscriptionFromDb = await db.subscription.findUnique({
      where: {
        subscriptionId: subscription.id,
      },
    });
    await db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        planId: subscription.plan_id,
        status: subscription.status,
        cycleStart: subscription.current_start
          ? new Date(+subscription.current_start * 1000)
          : null,
        cycleEnd: subscription.current_end
          ? new Date(+subscription.current_end * 1000)
          : null,
        upcomingPayment: subscription.charge_at
          ? new Date(+subscription.charge_at * 1000)
          : null,
      },
    });

    if (isPaymentIncluded && payment) {
      await db.payments.upsert({
        where: {
          paymentId: payment.id,
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          paymentId: payment.id,
          orgname: subscriptionFromDb?.orgname!,
          username: subscriptionFromDb?.username!,
          amount: +payment.amount,
          currency: payment.currency,
          status: payment.status,
          invoiceId: payment.invoice_id ? payment.invoice_id : null,
          orderId: payment.order_id,
          method: payment.method,
          paymentDetails:
            (payment as unknown as { [key: string]: unknown })[
              payment.method
            ] ?? {},
          email: payment.email,
          contact: String(payment.contact),
        },
      });
    }
  }
}
export const razorpayInstance = new RazorpayInstance();
export const razorpayActions = new RazorpayActions();

/**
 *   paymentId String @id
  orgname String 
  username String 
  amount Int
  currency String
  status PaymentStatus @default(pending)
  invoiceId String 
  orderId String 
  method String
  paymentDetails Json 
  email String
  contact String


 */
