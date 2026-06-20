import { ArrowLeft } from "lucide-react";
import { creativeStrategies, productImages } from "@/lib/strategy";
import { Badge, LabeledValue, PageHeader, SectionPanel, StrategyCard } from "@/components/ui";

const creativeBriefs = [
  {
    id: "sock-of-the-trip-landing-page",
    title: "Sock of the Trip Landing Page",
    purpose: "Convert trip planners into bundle buyers and custom-sock inquiries.",
    sections: ["Hero with group-trip promise", "Trip pack product block", "Custom trip examples", "Fast quote CTA", "UGC/social proof area"]
  },
  {
    id: "pro-shop-sell-sheet",
    title: "Pro Shop Sell Sheet",
    purpose: "Give club pros and merch buyers a clear reason to test Del Campo.",
    sections: ["Made-in-America proof", "Starter assortment", "Counter display concept", "Custom member-guest angle", "Wholesale next step"]
  },
  {
    id: "custom-quote-page",
    title: "Custom Socks Quote Page",
    purpose: "Turn custom interest into qualified inquiries by occasion.",
    sections: ["Use-case selector", "Mockup examples", "Timeline", "Minimums/process", "Quote form"]
  },
  {
    id: "caddie-crew-kit",
    title: "Caddie Crew Kit",
    purpose: "Make caddie activation simple, useful, and non-cringey.",
    sections: ["Welcome card", "Simple UGC prompts", "Referral code explainer", "Feedback form", "Intro ask"]
  }
];

export function CreativeStudioPage() {
  return (
    <>
      <PageHeader
        title="Creative System"
        subtitle="The operating system for making campaign assets, sell sheets, landing pages, email modules, ad tests, mockups, and UGC prompts."
      />

      <SectionPanel title="Creative Strategy" subtitle="The first creative priority is not polish. It is making the right strategic assets fast.">
        <div className="app-grid cols-3">
          {creativeStrategies.map((strategy) => (
            <StrategyCard title={strategy.title} body={strategy.thesis} key={strategy.title}>
              <div className="card-meta" style={{ marginTop: 10 }}>
                {strategy.outputs.slice(0, 3).map((output) => (
                  <Badge tone="blue" key={output}>
                    {output}
                  </Badge>
                ))}
              </div>
            </StrategyCard>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Buildable Creative Briefs" subtitle="These are concrete assets Gunnar can actually build or direct quickly.">
        <div className="app-grid cols-2">
          {creativeBriefs.map((brief) => (
            <StrategyCard title={brief.title} body={brief.purpose} href={`/app/creative-studio/briefs/${brief.id}`} key={brief.id} meta={<Badge tone="green">Build this</Badge>} />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Visual Territories" subtitle="Use Del Campo product as the hero. Avoid vague golf-stock imagery.">
        <div className="app-grid cols-4">
          {productImages.map((image) => (
            <div className="entity-card" key={image.name}>
              <img alt={image.name} src={image.src} style={{ aspectRatio: "4 / 3", borderRadius: 8, objectFit: "contain", width: "100%" }} />
              <h3 style={{ marginTop: 12 }}>{image.name}</h3>
              <p>Product-forward creative should carry the concept, not disappear into atmosphere.</p>
            </div>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

export function CreativeBriefDetailPage({ id }: { id: string }) {
  const brief = creativeBriefs.find((item) => item.id === id);
  if (!brief) {
    return (
      <SectionPanel title="Creative brief not found">
        <a className="btn btn-secondary" href="/app/creative-studio">
          Back to Creative System
        </a>
      </SectionPanel>
    );
  }

  return (
    <>
      <PageHeader
        title={brief.title}
        subtitle={brief.purpose}
        actions={
          <a className="btn btn-outline" href="/app/creative-studio">
            <ArrowLeft size={17} />
            Creative System
          </a>
        }
      />

      <div className="detail-grid">
        <div className="app-grid">
          <SectionPanel title="Recommended Structure">
            <ul className="mini-list">
              {brief.sections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          </SectionPanel>
          <SectionPanel title="Creative Direction">
            <div className="grid grid-2">
              <LabeledValue label="Tone" value="70% serious operator, 30% Del Campo-native wit." />
              <LabeledValue label="Imagery" value="Real product, visible socks, pro-shop counters, trips, bags, scorecards, and custom mockups." />
              <LabeledValue label="Copy" value="Specific, golf-native, useful. No 'viral growth hacking' language." />
              <LabeledValue label="Output" value="Designed to support revenue motions, not just look nice in a portfolio." />
            </div>
          </SectionPanel>
        </div>
        <aside className="app-grid">
          <SectionPanel title="Why This Helps the Application">
            <p>
              This proves practical creative direction: campaign thinking, conversion path, assets, copy, and production
              judgment. It also lets you show that you can make the thing, not only describe it.
            </p>
          </SectionPanel>
          <SectionPanel title="Fast Next Step">
            <p>Build a rough version of this asset after the strategy system is deployed, then add it as a live example.</p>
          </SectionPanel>
        </aside>
      </div>
    </>
  );
}
