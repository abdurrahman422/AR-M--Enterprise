import { NextResponse } from "next/server";
import { queryDatabase } from "@/lib/db/neon";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  if(!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found",{status:404});
  const rows=await queryDatabase<{content_type:string;data:Buffer}>(`select content_type,data from product_media where id=$1`,[id]);
  if(!rows[0]) return new NextResponse("Not found",{status:404});
  return new NextResponse(new Uint8Array(rows[0].data),{headers:{"content-type":rows[0].content_type,"cache-control":"public, max-age=31536000, immutable"}});
}
