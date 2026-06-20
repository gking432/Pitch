import { ArrowLeft } from "lucide-react";
import { campaigns } from "@/lib/strategy";
import { Badge, LabeledValue, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

export function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaign Strategy Library"
        subtitle="Campaigns should be strategic systems: audience, offer, channel plan, creative direction, execution steps, and target metrics."
      />

      <SectionPanel title="Strategic Campaigns" subtitle="These are the first campaign systems I would bring to Del Campo.">
        <div className="app-grid cols-3">
          {campaigns.map((campaign) => (
            <StrategyCard
              title={campaign.title}
              body={campaign.thesis}
              href={`/app/campaigns/${campaign.id}`}
              key={campaign.id}
              meta={
                <>
                  <Badge tone="green">{campaign.strategicRole.split(".")[0]}</Badge>
                  <Badge tone="blue">{campaign.channels[0]}</Badge>
                </>
              }
            >
              <p style={{ marginTop: 10 }}>
                <strong>Target:</strong> {campaign.targets[0]}
              </p>
            </StrategyCard>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

export function CampaignDetailPage({ id }: { id: string }) {
  const campaign = campaigns.find((item) => item.id === id);
  if (!campaign) {
    return (
      <SectionPanel title="Campaign strategy not found">
        <a className="btn btn-secondary" href="/app/campaigns">
          Back to Campaign Strategies
        </a>
      </SectionPanel>
    );
  }

  return (
    <>
      <PageHeader
        title={campaign.title}
        subtitle={campaign.thesis}
        actions={
          <a className="btn btn-outline" href="/app/campaigns">
            <ArrowLeft size={17} />
            Campaign Strategies
          </a>
        }
      />

      <div className="detail-grid">
        <div className="app-grid">
          <SectionPanel title="Strategy Brief">
            <div className="grid grid-2">
              <LabeledValue label="Audience" value={campaign.audience} />
              <LabeledValue label="Strategic Role" value={campaign.strategicRole} />
              <LabeledValue label="Offer" value={campaign.offer} />
              <LabeledValue label="Why It Matters" value={campaign.whyItMatters} />
            </div>
          </SectionPanel>

          <SectionPanel title="Execution Plan" subtitle="The work that would actually need to happen.">
            <ul className="mini-list">
              {campaign.execution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionPanel>

          <SectionPanel title="Creative Direction">
            <ul className="mini-list">
              {campaign.creativeDirection.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionPanel>
        </div>

        <aside className="app-grid">
          <SectionPanel title="Channels">
            <div className="card-meta">
              {campaign.channels.map((channel) => (
                <Badge tone="blue" key={channel}>
                  {channel}
                </Badge>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Targets">
            <ul className="mini-list">
              {campaign.targets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionPanel>

          <SectionPanel title="Next Useful Asset">
            <p>
              Build one public-facing or sales-facing artifact from this strategy: landing page, sell sheet, email
              module, mockup set, ad matrix, or outreach kit.
            </p>
          </SectionPanel>
        </aside>
      </div>
    </>
  );
}
