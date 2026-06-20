import { DistributionDetailPage } from "@/components/distribution";

export default async function DistributionDetailRoute({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  return <DistributionDetailPage id={accountId} />;
}
