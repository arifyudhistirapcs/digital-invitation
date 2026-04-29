import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

const BASE_URL =
  "https://putyourinvitation.id/the-wedding-of-yudhit-aryani/?to=";

function encodeGuestName(name: string): string {
  return encodeURIComponent(name).replace(/%20/g, "%20");
}

export async function GET() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  if (!name?.trim()) {
    return Response.json({ error: "Nama tamu wajib diisi" }, { status: 400 });
  }

  const trimmed = name.trim();
  const slug = encodeGuestName(trimmed);
  const link = BASE_URL + slug;

  const { data, error } = await supabase
    .from("guests")
    .insert({ name: trimmed, slug, link })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: "ID wajib diisi" }, { status: 400 });
  }

  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
