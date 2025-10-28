"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "./Badge";
import Modal from "./Modal";
import { Quiz } from "@/types/types";

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
          <Link
            href={`/quiz/edit/${item.id}`}
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
          >
            Edit
          </Link>
          <Link
            href={`/quiz/${item.id}`}
            className="btn btn-sm btn-primary d-flex align-items-center"
          >
            View
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <Modal
        open={showConfirm}
        onClose={closeConfirm}
        title="Confirm Deletion"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeConfirm}
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
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{item.title}</strong>?
        </p>
      </Modal>
    </>
  );
};

export default ListItem;
