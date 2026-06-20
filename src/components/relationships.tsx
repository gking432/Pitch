import { ArrowLeft } from "lucide-react";
import { relationshipPlaybooks } from "@/lib/strategy";
import { Badge, LabeledValue, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

export function RelationshipsPage() {
  return (
    <>
      <PageHeader
        title="Relationship Strategy"
        subtitle="A relationship-building strategy for clubs, PGA pros, caddies, players, creators, Card Chasers, and trip captains."
      />

      <SectionPanel title="Relationship Playbooks" subtitle="Each relationship type has a different job: credibility, content, referrals, introductions, product feedback, or sales support.">
        <div className="app-grid cols-3">
          {relationshipPlaybooks.map((playbook) => (
            <StrategyCard
              title={playbook.title}
              body={playbook.thesis}
              href={`/app/relationships/${playbook.id}`}
              key={playbook.id}
              meta={<Badge tone="green">{playbook.targets[0]}</Badge>}
            />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Relationship Principles">
        <div className="app-grid cols-3">
          <StrategyCard title="Earn first" body="Start with product, feedback, usefulness, and relevance before asking for promotion." />
          <StrategyCard title="Separate proof from conversion" body="A tour player may create credibility; a trip captain may create orders. Those are different jobs." />
          <StrategyCard title="Reward introductions" body="In golf, one good relationship should lead to the next pro, caddie, club, buyer, or trip." />
        </div>
      </SectionPanel>
    </>
  );
}

export function RelationshipDetailPage({ id }: { id: string }) {
  const playbook = relationshipPlaybooks.find((item) => item.id === id);
  if (!playbook) {
    return (
      <SectionPanel title="Relationship playbook not found">
        <a className="btn btn-secondary" href="/app/relationships">
          Back to Relationship Strategy
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
          <a className="btn btn-outline" href="/app/relationships">
            <ArrowLeft size={17} />
            Relationship Strategy
          </a>
        }
      />

      <div className="detail-grid">
        <div className="app-grid">
          <SectionPanel title="Strategy">
            <ul className="mini-list">
              {playbook.strategy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionPanel>
          <SectionPanel title="Assets to Build">
            <div className="app-grid cols-2">
              {playbook.assets.map((asset) => (
                <StrategyCard title={asset} body="A practical artifact that makes this relationship strategy easier to execute and repeat." key={asset} />
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
              label="How this avoids influencer theater"
              value="The goal is not to collect logos or impressions. The goal is to build useful loops: proof, content, feedback, referrals, and warm introductions."
            />
          </SectionPanel>
        </aside>
      </div>
    </>
  );
}
