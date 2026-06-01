import type { ReactNode } from "react";

type SectionFrameProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SectionFrame({ title, subtitle, children }: SectionFrameProps) {
  return (
    <section className="section-frame">
      <header>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
