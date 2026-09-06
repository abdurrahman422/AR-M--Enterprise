import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { queryDatabase } from "@/lib/db/neon";

export async function POST(request:NextRequest){
  await requireAdmin();
  const form=await request.formData(); const file=form.get("file");
  if(!(file instanceof File)||!file.type.startsWith("image/")||file.size>8*1024*1024) return NextResponse.json({message:"Choose a JPG, PNG, WebP or GIF image under 8 MB."},{status:400});
  const rows=await queryDatabase<{id:string}>(`insert into product_media(file_name,content_type,data) values($1,$2,$3) returning id::text`,[file.name,file.type,Buffer.from(await file.arrayBuffer())]);
  return NextResponse.json({url:`/api/media/${rows[0].id}`,fileName:file.name});
}
