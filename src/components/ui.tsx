import { labelize } from "@/lib/format";

export function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "red" | "blue" | "gold" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function PageHeader({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions ? <div className="button-row">{actions}</div> : null}
    </header>
  );
}

export function StrategyCard({
  title,
  body,
  href,
  meta,
  children
}: {
  title: string;
  body: string;
  href?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const content = (
    <div className="entity-card">
      <h3>{title}</h3>
      <p>{body}</p>
      {meta ? <div className="card-meta">{meta}</div> : null}
      {children}
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

export function SectionPanel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-panel">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </section>
  );
}

export function LabeledValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="pitch-card">
      <strong>{labelize(label)}</strong>
      <p>{value}</p>
    </div>
  );
}
