import { ArrowLeft } from "lucide-react";
import { distributionPlaybooks } from "@/lib/strategy";
import { Badge, LabeledValue, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

export function DistributionPage() {
  return (
    <>
      <PageHeader
        title="Distribution Strategy"
        subtitle="Revenue beyond DTC: green grass pro shops, custom/corporate, retail, licensed drops, tournaments, weddings, and college programs."
      />

      <SectionPanel title="Channel Playbooks" subtitle="Each channel needs a different offer, asset set, and measurement system.">
        <div className="app-grid cols-2">
          {distributionPlaybooks.map((playbook) => (
            <StrategyCard
              title={playbook.title}
              body={playbook.thesis}
              href={`/app/distribution/${playbook.id}`}
              key={playbook.id}
              meta={
                <>
                  <Badge tone="green">{playbook.targets[0]}</Badge>
                  <Badge tone="blue">{playbook.assets[0]}</Badge>
                </>
              }
            />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Distribution Logic" subtitle="The role requires more than brand and ads. Marketing has to make sales channels easier to open, support, and measure.">
        <div className="app-grid cols-3">
          <StrategyCard title="Make the first test easy" body="Small assortments, clear displays, low-friction sample packs, and an obvious buyer next step." />
          <StrategyCard title="Sell by occasion" body="Custom socks convert better when tied to events: member-guests, outings, weddings, college weekends, and trips." />
          <StrategyCard title="Create reusable proof" body="Every pro-shop win, custom order, or retail test should become a sell-sheet proof point for the next account." />
        </div>
      </SectionPanel>
    </>
  );
}

export function DistributionDetailPage({ id }: { id: string }) {
  const playbook = distributionPlaybooks.find((item) => item.id === id);
  if (!playbook) {
    return (
      <SectionPanel title="Distribution playbook not found">
        <a className="btn btn-secondary" href="/app/distribution">
          Back to Distribution Strategy
        </a>
      </SectionPanel>
    );
  }

  return (
    <>
      <PageHeader
        title={playbook.title}
        subtitle={playbook.thesis}
        actions={
          <a className="btn btn-outline" href="/app/distribution">
            <ArrowLeft size={17} />
            Distribution Strategy
          </a>
        }
      />

      <div className="detail-grid">
        <div className="app-grid">
          <SectionPanel title="Channel Strategy">
            <ul className="mini-list">
              {playbook.strategy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionPanel>
          <SectionPanel title="Assets to Build">
            <div className="app-grid cols-2">
              {playbook.assets.map((asset) => (
                <StrategyCard title={asset} body="A concrete sales/marketing artifact needed to make this channel repeatable." key={asset} />
              ))}
            </div>
          </SectionPanel>
        </div>

        <aside className="app-grid">
          <SectionPanel title="Audiences">
            <div className="card-meta">
              {playbook.audiences.map((audience) => (
                <Badge tone="blue" key={audience}>
                  {audience}
                </Badge>
              ))}
            </div>
          </SectionPanel>
          <SectionPanel title="Targets">
            <ul className="mini-list">
              {playbook.targets.map((target) => (
                <li key={target}>{target}</li>
              ))}
            </ul>
          </SectionPanel>
          <SectionPanel title="Operating Note">
            <LabeledValue
              label="Marketing's job"
              value="Create the narrative, assets, follow-up system, and proof that make this channel easier for sales, founders, and partners to convert."
            />
          </SectionPanel>
        </aside>
      </div>
    </>
  );
}
