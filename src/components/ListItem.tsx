import { Quiz } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Badge from "./Badge";

export type ListItemProps = {
  item: Quiz;
  onDelete: (id: string) => void;
};

const ListItem = ({ item, onDelete }: ListItemProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  function handleNavigation() {
    router.push(`/quiz/edit/${item.id}`);
  }

  function closeConfirm() {
    setShowConfirm(false);
  }

  useEffect(() => {
    if (showConfirm === false) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center border border-primary p-2 mb-2">
        <div>
          <div
            className="fw-bold clickable d-flex gap-2"
            onClick={handleNavigation}
            style={{ cursor: "pointer" }}
          >
            {item.title}
            <Badge isPublished={item.published} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              Created:{" "}
              {new Date(item.createdAt ?? item.updatedAt)
                .toISOString()
                .slice(0, 10)}
            </small>
            <small className="text-muted">
              Updated: {new Date(item.updatedAt).toISOString().slice(0, 10)}
            </small>
          </div>
        </div>

        <div className="d-flex gap-2">
          <a
            href={`/quiz/edit/${item.id}`}
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            Edit
          </a>
          <a
            href={`/quiz/${item.id}`}
            className="btn btn-sm btn-primary d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            View
          </a>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowConfirm(false)}
          />

          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1050 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeConfirm();
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{item.title}</strong>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      onDelete(item.id);
                      setShowConfirm(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ListItem;
