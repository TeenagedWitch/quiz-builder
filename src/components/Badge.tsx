export type BadgeProps = {
  isPublished: boolean;
};

const Badge = ({ isPublished }: BadgeProps) => {
  return (
    <span className={`badge ${isPublished ? "bg-success" : "bg-secondary"}`}>
      {isPublished ? "Published" : "Draft"}
    </span>
  );
};

export default Badge;
