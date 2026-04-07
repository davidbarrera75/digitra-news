export const dynamic = "force-dynamic";

import { notFound, permanentRedirect, redirect } from "next/navigation";
import { lookupRedirect, recordRedirectHit } from "@/lib/redirects";

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  // Tag pages aren't implemented yet — check the redirect table for migrated URLs.
  const path = `/tags/${tag}`;
  const r = await lookupRedirect(path);
  if (r) {
    recordRedirectHit(path);
    if (r.statusCode === 308 || r.statusCode === 301) {
      permanentRedirect(r.to);
    } else {
      redirect(r.to);
    }
  }
  notFound();
}
