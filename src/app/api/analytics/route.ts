import { NextResponse, type NextRequest } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";

const allowed = new Set(["page_view","product_view","product_click","quote_click","service_click"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const eventType=String(body.eventType??""); const path=String(body.path??"").slice(0,500);
    const visitorId=String(body.visitorId??"").slice(0,100); const sessionId=String(body.sessionId??"").slice(0,100);
    if(!allowed.has(eventType)||!path.startsWith("/")||!visitorId||!sessionId) return NextResponse.json({ok:false},{status:400});
    await recordAnalyticsEvent({visitorId,sessionId,eventType,path,productSlug:String(body.productSlug??"").slice(0,160)||undefined,productTitle:String(body.productTitle??"").slice(0,240)||undefined,referrer:request.headers.get("referer")??undefined,userAgent:request.headers.get("user-agent")??undefined});
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({ok:false},{status:400}); }
}
