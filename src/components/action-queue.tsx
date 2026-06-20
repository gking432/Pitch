import { aiIntegrations } from "@/lib/strategy";
import { Badge, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

export function ActionQueuePage() {
  return (
    <>
      <PageHeader
        title="AI Integrations"
        subtitle="The AI layer should make marketing operations smoother: reporting, briefs, creative reuse, custom quote follow-up, outreach, and channel learning."
      />

      <SectionPanel title="Practical AI Workflows" subtitle="These are integration concepts that could be built with existing tools before a heavy custom backend.">
        <div className="app-grid cols-2">
          {aiIntegrations.map((integration) => (
            <StrategyCard
              title={integration.title}
              body={integration.role}
              key={integration.title}
              meta={<Badge tone="blue">{integration.tools}</Badge>}
            />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="What AI Should Actually Do Here" subtitle="Less chatbot theater. More operational leverage.">
        <div className="app-grid cols-3">
          <StrategyCard title="Summarize" body="Turn messy channel data into a weekly readout a founder can actually use." />
          <StrategyCard title="Draft" body="Generate first-pass briefs, outreach, email flows, sell-sheet copy, and campaign checklists." />
          <StrategyCard title="Tag" body="Label assets by hook, audience, product, permission, and reuse channel." />
          <StrategyCard title="Route" body="Push custom inquiries, sample-pack follow-ups, and relationship next steps into the right workflow." />
          <StrategyCard title="Detect" body="Flag changes in CAC, conversion, lead quality, creative fatigue, or quote response time." />
          <StrategyCard title="Reuse" body="Recommend where strong proof should appear next: paid, lifecycle, product page, sales deck, or pro-shop collateral." />
        </div>
      </SectionPanel>
    </>
  );
}
