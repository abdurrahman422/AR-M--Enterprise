import "server-only";
import { isNeonConfigured, queryDatabase } from "@/lib/db/neon";

export type AnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  productViews: number;
  quoteClicks: number;
  topProducts: Array<{ slug: string; title: string; views: number; clicks: number }>;
  recentEvents: Array<{ id: string; eventType: string; path: string; productTitle?: string; createdAt: string }>;
};

export async function recordAnalyticsEvent(input: { visitorId: string; sessionId: string; eventType: string; path: string; productSlug?: string; productTitle?: string; referrer?: string; userAgent?: string }) {
  if (!isNeonConfigured()) return;
  await queryDatabase(`insert into analytics_events(visitor_id,session_id,event_type,path,product_slug,product_title,referrer,user_agent) values($1,$2,$3,$4,$5,$6,$7,$8)`, [input.visitorId,input.sessionId,input.eventType,input.path,input.productSlug||null,input.productTitle||null,input.referrer||null,input.userAgent||null]);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!isNeonConfigured()) return { totalViews:0,uniqueVisitors:0,productViews:0,quoteClicks:0,topProducts:[],recentEvents:[] };
  const [totals, products, events] = await Promise.all([
    queryDatabase<{total_views:string;unique_visitors:string;product_views:string;quote_clicks:string}>(`select count(*) filter(where event_type='page_view')::text total_views,count(distinct visitor_id)::text unique_visitors,count(*) filter(where event_type='product_view')::text product_views,count(*) filter(where event_type='quote_click')::text quote_clicks from analytics_events`),
    queryDatabase<{slug:string;title:string;views:string;clicks:string}>(`select product_slug slug,max(product_title) title,count(*) filter(where event_type='product_view')::text views,count(*) filter(where event_type in ('product_click','quote_click'))::text clicks from analytics_events where product_slug is not null group by product_slug order by count(*) desc limit 10`),
    queryDatabase<{id:string;event_type:string;path:string;product_title:string|null;created_at:Date}>(`select id::text,event_type,path,product_title,created_at from analytics_events order by created_at desc limit 30`),
  ]);
  const t=totals[0]??{total_views:'0',unique_visitors:'0',product_views:'0',quote_clicks:'0'};
  return { totalViews:Number(t.total_views),uniqueVisitors:Number(t.unique_visitors),productViews:Number(t.product_views),quoteClicks:Number(t.quote_clicks),topProducts:products.map(p=>({slug:p.slug,title:p.title,views:Number(p.views),clicks:Number(p.clicks)})),recentEvents:events.map(e=>({id:e.id,eventType:e.event_type,path:e.path,productTitle:e.product_title??undefined,createdAt:e.created_at.toISOString()})) };
}
