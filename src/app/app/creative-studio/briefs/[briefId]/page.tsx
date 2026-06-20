import { CreativeBriefDetailPage } from "@/components/creative-studio";

export default async function CreativeBriefDetailRoute({ params }: { params: Promise<{ briefId: string }> }) {
  const { briefId } = await params;
  return <CreativeBriefDetailPage id={briefId} />;
}
