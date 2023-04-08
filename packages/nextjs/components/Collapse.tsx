interface CollapseProps {
  title: string;
  content: React.ReactNode;
  badgeContent?: string;
}

export default function Collapse({ title, content, badgeContent }: CollapseProps) {
  return (
    <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 p-0 my-1">
      <div className="collapse-title text-md font-bold flex justify-between items-center">
        {title}
        {badgeContent && <span className="badge badge-sm">{badgeContent}</span>}
      </div>
      <div className="collapse-content">{content}</div>
    </div>
  );
}
