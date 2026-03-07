export const dynamic = "force-dynamic";

import { getCuratedSources } from "@/lib/actions/curated";
import SourcesManager from "./SourcesManager";

export default async function SourcesPage() {
  const sources = await getCuratedSources();
  return <SourcesManager initialSources={JSON.parse(JSON.stringify(sources))} />;
}
