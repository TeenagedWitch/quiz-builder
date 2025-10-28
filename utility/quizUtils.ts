import { BlockType } from "@/constants/blockTypes";
import type {
  Quiz,
  Block,
  HeadingBlock,
  FooterBlock,
  ButtonBlock,
  QuestionBlock,
} from "@/types/types";
import { newId } from "./generateId";

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
    case BlockType.Heading:
      return { type: BlockType.Heading, text: "Heading" } as HeadingBlock;
    case BlockType.Footer:
      return { type: BlockType.Footer, text: "Footer" } as FooterBlock;
    case BlockType.Button:
      return { type: BlockType.Button, label: "Submit" } as ButtonBlock;
    case BlockType.Question:
    default:
      return {
        type: BlockType.Question,
        question: "Your question?",
        options: ["Option 1", "Option 2"],
        multiple: false,
      } as QuestionBlock;
  }
}
