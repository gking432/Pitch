import { CampaignDetailPage } from "@/components/campaigns";

export default async function CampaignDetailRoute({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  return <CampaignDetailPage id={campaignId} />;
}
