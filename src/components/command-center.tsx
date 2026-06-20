import { ArrowRight } from "lucide-react";
import { aiIntegrations, campaigns, creativeStrategies, distributionPlaybooks, performanceTargets, relationshipPlaybooks } from "@/lib/strategy";
import { Badge, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

const priorities = [
  {
    title: "Win the category narrative",
    body: "Make Del Campo the brand that publicly explains why golf socks are underbuilt, collectible, giftable, custom-ready, and pro-shop-ready."
  },
  {
    title: "Turn custom into a growth lane",
    body: "Sell custom socks by occasion: member-guests, corporate outings, bachelor trips, weddings, college events, and tournaments."
  },
  {
    title: "Systematize green grass",
    body: "Convert existing pro-shop traction into a sample-pack, sell-sheet, display, first-order, and reorder workflow."
  },
  {
    title: "Build relationship loops",
    body: "Use PGA pros, caddies, Card Chasers, creators, and trip captains for proof, feedback, referrals, and warm introductions."
  }
];

export function CommandCenter() {
  return (
    <>
      <PageHeader
        title="Strategy Command Center"
        subtitle="The operating thesis for Del Campo marketing: a strategic map for building the function, choosing the first growth loops, and turning real company assets into repeatable systems."
        actions={
          <a className="btn btn-primary" href="/app/campaigns">
            View Campaign Strategies <ArrowRight size={17} />
          </a>
        }
      />

      <SectionPanel title="The Core Thesis" subtitle="Del Campo should not grow like a normal sock company. It should grow like a modern golf culture brand with a measurable operating system.">
        <div className="app-grid cols-4">
          {priorities.map((priority) => (
            <StrategyCard title={priority.title} body={priority.body} key={priority.title} />
          ))}
        </div>
      </SectionPanel>

      <div className="app-grid cols-2" style={{ marginTop: 16 }}>
      <SectionPanel title="First Campaign Systems" subtitle="Campaigns are strategy briefs with audiences, offers, channel plans, creative direction, and target metrics.">
          <div className="card-list">
            {campaigns.slice(0, 5).map((campaign) => (
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
              />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Strategy Map" subtitle="Each tab answers a real question the Head of Marketing would need to solve.">
          <div className="card-list">
            <StrategyCard
              title="Relationship Strategy"
              body={`${relationshipPlaybooks.length} relationship playbooks for clubs, pros, caddies, creators, players, and trip captains.`}
              href="/app/relationships"
              meta={<Badge tone="gold">Proof + referrals</Badge>}
            />
            <StrategyCard
              title="Distribution Strategy"
              body={`${distributionPlaybooks.length} channel playbooks for pro shops, custom, retail, and licensed growth.`}
              href="/app/distribution"
              meta={<Badge tone="blue">Revenue beyond DTC</Badge>}
            />
            <StrategyCard
              title="Creative System"
              body={`${creativeStrategies.length} systems for briefs, actual creative output, and asset reuse discipline.`}
              href="/app/creative-studio"
              meta={<Badge tone="green">Make the assets</Badge>}
            />
            <StrategyCard
              title="Targets + Measurement"
              body={`${performanceTargets.length} measurement areas with targets and decision thresholds for future real reporting.`}
              href="/app/performance"
              meta={<Badge tone="red">Accountability</Badge>}
            />
            <StrategyCard
              title="AI Integrations"
              body={`${aiIntegrations.length} practical AI workflows for marketing operations, reporting, creative, and follow-up.`}
              href="/app/action-queue"
              meta={<Badge tone="blue">Operations layer</Badge>}
            />
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="90-Day Operating Sequence" subtitle="A realistic early-stage sequence: learn fast, ship useful assets, then systematize what works.">
        <div className="app-grid cols-3">
          <StrategyCard
            title="Days 1-30: Map and Focus"
            body="Audit DTC, custom, wholesale, pro-shop, creative, Clubhouse, and relationship motions. Choose the first three loops and define targets."
            meta={<Badge tone="green">Clarity</Badge>}
          />
          <StrategyCard
            title="Days 31-60: Launch and Learn"
            body="Ship the campaign assets for Sock of the Trip, Pro Shop Drop, On the Bag, and Clubhouse Custom Pack. Track signals honestly."
            meta={<Badge tone="blue">Execution</Badge>}
          />
          <StrategyCard
            title="Days 61-90: Systematize"
            body="Turn winning hooks, relationship proof, custom inquiries, and pro-shop feedback into repeatable calendars, automations, and reporting."
            meta={<Badge tone="gold">Operating rhythm</Badge>}
          />
        </div>
      </SectionPanel>
    </>
  );
}
