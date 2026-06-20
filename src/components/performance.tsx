import { performanceTargets } from "@/lib/strategy";
import { Badge, LabeledValue, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

const operatingQuestions = [
  "Which campaign deserves more budget or creative time?",
  "Which custom use case is producing qualified inquiries?",
  "Which relationship type creates proof, revenue, or introductions?",
  "Which pro-shop motion is repeatable?",
  "Which creative hook is worth recycling?"
];

export function PerformancePage() {
  return (
    <>
      <PageHeader
        title="Targets + Measurement"
        subtitle="The measurement plan Del Campo would need to know whether each strategy is working once real channel data is connected."
      />

      <SectionPanel title="Target Scorecards" subtitle="Use targets and decision thresholds first; actuals come from Shopify, Klaviyo, Meta, GA4, CRM, and wholesale/custom tracking after implementation.">
        <div className="app-grid cols-2">
          {performanceTargets.map((area) => (
            <StrategyCard title={area.strategy} body="The goal is to create a simple scorecard that drives weekly decisions." key={area.strategy}>
              <ul className="mini-list">
                {area.targets.map((target) => (
                  <li key={target}>{target}</li>
                ))}
              </ul>
            </StrategyCard>
          ))}
        </div>
      </SectionPanel>

      <div className="app-grid cols-2" style={{ marginTop: 16 }}>
        <SectionPanel title="Weekly Leadership Report" subtitle="One page. No vanity metric swamp.">
          <div className="grid grid-2">
            <LabeledValue label="What changed" value="Revenue, leads, creative performance, relationship movement, and wholesale/custom signals." />
            <LabeledValue label="What matters" value="The two or three changes that should alter decisions this week." />
            <LabeledValue label="What we are doing next" value="Specific campaign, creative, partner, or channel actions." />
            <LabeledValue label="What needs leadership input" value="Budget, offer, product, partnership, inventory, or hiring decisions." />
          </div>
        </SectionPanel>

        <SectionPanel title="Operating Questions">
          <ul className="mini-list">
            {operatingQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </SectionPanel>
      </div>

      <SectionPanel title="Decision Thresholds" subtitle="The system should force decisions instead of collecting numbers.">
        <div className="app-grid cols-3">
          <StrategyCard title="Scale" body="If a hook, audience, or channel beats target twice, turn it into a repeatable campaign module." meta={<Badge tone="green">Double down</Badge>} />
          <StrategyCard title="Fix" body="If a strategy has interest but poor conversion, adjust offer, landing page, follow-up, or creative." meta={<Badge tone="gold">Diagnose</Badge>} />
          <StrategyCard title="Stop" body="If a motion cannot produce qualified signal after a fair test, stop feeding it time and move the learning elsewhere." meta={<Badge tone="red">Cut waste</Badge>} />
        </div>
      </SectionPanel>
    </>
  );
}
