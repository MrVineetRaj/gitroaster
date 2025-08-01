import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { razorpayActions } from "@/modules/razorpay/utils";

export async function POST(req: NextRequest) {
  // Todo : implement flow for updating subscription access
  const data = await req.json();
  console.log(data);
  const signatureFromRazorPay = req.headers.get("X-Razorpay-Signature");

  if (!signatureFromRazorPay) {
    return NextResponse.json({
      status: 401,
      message: "Signature not found",
    });
  }
  const RAZORPAY_WEBHOOK_SECREt = process.env.RAZORPAY_WEBHOOK_SECREt!;

  const isValid = validateWebhookSignature(
    JSON.stringify(data),
    signatureFromRazorPay,
    RAZORPAY_WEBHOOK_SECREt
  );

  if (!isValid) {
    console.log("false request");
    console.log(data);
    return NextResponse.json({
      status: 401,
      data,
    });
  }
  
  if (
    data.contains.include("subscription") &&
    data.contains.include("payment")
  ) {
    razorpayActions.upsertSubscriptionDetails(
      true,
      data.payload.subscription.entity,
      data.payload.payment.entity
    );
  } else if (data.contains.include("subscription")) {
    razorpayActions.upsertSubscriptionDetails(
      false,
      data.payload.subscription.entity
    );
  }

  return NextResponse.json({
    status: "OK",
    data,
  });
}
