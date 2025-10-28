import { BlockType } from "@/constants/blockTypes";

export type QuestionBlock =
  | {
      type: BlockType.Question;
      question: string;
      options: string[];
      multiple?: false;
      correct?: number;
    }
  | {
      type: BlockType.Question;
      question: string;
      options: string[];
      multiple: true;
      correct?: number[];
    }
  | {
      type: BlockType.Question;
      question: string;
      options?: undefined;
      multiple?: false;
      correct?: RegExp | string;
    };

export type HeadingBlock = {
  type: BlockType.Heading;
  text: string;
};

export type FooterBlock = {
  type: BlockType.Footer;
  text: string;
};

export type ButtonBlock = {
  type: BlockType.Button;
  label: string;
};

export type Block = HeadingBlock | QuestionBlock | FooterBlock | ButtonBlock;

export type Quiz = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  published: boolean;
  blocks: Block[];
};
