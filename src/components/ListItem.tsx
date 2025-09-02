import { Quiz } from "@/utility/quizStorage";

export type ListItemProps = {
  item: Quiz;
};

const ListItem = ({ item }: ListItemProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center border border-primary p-2 mb-2">
      <div>
        <div className="fw-bold">{item.title}</div>
        <small className="text-muted">
          Updated: {new Date(item.updatedAt).toLocaleString()}
        </small>
      </div>
      <div className="d-flex gap-2">
        <a
          href={`/quiz/edit/${item.id}`}
          className="btn btn-sm btn-outline-primary"
        >
          Edit
        </a>
        <a href={`/quiz/${item.id}`} className="btn btn-sm btn-primary">
          View
        </a>
      </div>
    </div>
  );
};

export default ListItem;
