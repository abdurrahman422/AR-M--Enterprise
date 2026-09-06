"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function id(store: Storage,key:string){let value=store.getItem(key);if(!value){value=crypto.randomUUID();store.setItem(key,value)}return value}
function send(eventType:string, path:string, productSlug?:string, productTitle?:string){
  const payload={eventType,path,productSlug,productTitle,visitorId:id(localStorage,"arm_visitor_id"),sessionId:id(sessionStorage,"arm_session_id")};
  void fetch("/api/analytics",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),keepalive:true});
}

export function SiteAnalytics(){
  const pathname=usePathname();
  useEffect(()=>{const product=pathname.match(/^\/products\/([^/]+)$/);send(product?"product_view":"page_view",pathname,product?.[1]);},[pathname]);
  useEffect(()=>{const handler=(event:MouseEvent)=>{const target=(event.target as HTMLElement).closest<HTMLElement>("[data-analytics-event]");if(!target)return;send(target.dataset.analyticsEvent||"product_click",target.dataset.analyticsPath||pathname,target.dataset.productSlug,target.dataset.productTitle)};document.addEventListener("click",handler);return()=>document.removeEventListener("click",handler)},[pathname]);
  return null;
}
