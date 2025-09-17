export type QuestionBlock =
  | {
      type: "question";
      question: string;
      options: string[];
      multiple?: false;
      correct?: number;
    }
  | {
      type: "question";
      question: string;
      options: string[];
      multiple: true;
      correct?: number[];
    }
  | {
      type: "question";
      question: string;
      options?: undefined;
      multiple?: false;
      correct?: RegExp | string;
    };

export type HeadingBlock = {
  type: "heading";
  text: string;
};

export type FooterBlock = {
  type: "footer";
  text: string;
};

export type ButtonBlock = {
  type: "button";
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
