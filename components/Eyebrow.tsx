type Props = {
  children: React.ReactNode;
  index?: string;
  className?: string;
};

/** Mono label that opens a section, with a rule running to the edge. */
export default function Eyebrow({ children, index, className }: Props) {
  return (
    <p className={className ? `eyebrow ${className}` : "eyebrow"}>
      {index ? <span className="eyebrow-index">{index}</span> : null}
      <span>{children}</span>
    </p>
  );
}
