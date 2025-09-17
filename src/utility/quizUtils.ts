import { newId } from "@/utility/generateId";
import type {
  Quiz,
  Block,
  HeadingBlock,
  FooterBlock,
  ButtonBlock,
  QuestionBlock,
} from "@/types";

export const defaultQuiz = (): Quiz => ({
  id: newId(),
  title: "Untitled Quiz",
  updatedAt: new Date().toISOString(),
  published: false,
  blocks: [],
  createdAt: new Date().toISOString(),
});

export function makeBlock(type: Block["type"]): Block {
  switch (type) {
    case "heading":
      return { type: "heading", text: "Heading" } as HeadingBlock;
    case "footer":
      return { type: "footer", text: "Footer" } as FooterBlock;
    case "button":
      return { type: "button", label: "Submit" } as ButtonBlock;
    case "question":
    default:
      return {
        type: "question",
        question: "Your question?",
        options: ["Option 1", "Option 2"],
        multiple: false,
      } as QuestionBlock;
  }
}
