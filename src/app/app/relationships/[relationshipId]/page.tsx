import { RelationshipDetailPage } from "@/components/relationships";

export default async function RelationshipDetailRoute({ params }: { params: Promise<{ relationshipId: string }> }) {
  const { relationshipId } = await params;
  return <RelationshipDetailPage id={relationshipId} />;
}
