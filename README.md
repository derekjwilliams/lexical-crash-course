# lexical-crash-course

This is based on the excellent tutorial by Usman Abdur Rehman

His code can be found here: https://github.com/usmanabdurrehman/React-tutorials/tree/Lexical

His excellent video tutorial can be found here: https://www.youtube.com/watch?v=XI6nufqMSek

## Also See

https://stackblitz.com/edit/facebook-lexical-rjf2em?file=src%2Fplugins%2FToolbarPlugin.tsx

## TODOS

- [ ] Convert to StyleX after project is at parity with the end of the [crash course video](https://www.youtube.com/watch?v=aXAQ_ZVFI5Q)

- [ ] Use react compiler and remove the use of useCallback

- [x] Configure prettier

- [ ] Move functionality into hooks, e.g.

```
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRangeSelection, TOGGLE_BOLD_COMMAND } from "lexical";
import { useEffect } from "react";

export function useToggleBold() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LexicalNode])) {
      return;
    }

    return editor.registerCommand(
      TOGGLE_BOLD_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = editor.getSelection();
          if ($isRangeSelection(selection)) {
            selection.toggleFormat("bold");
          }
        });

        return true;
      },
      "transaction"
    );
  }, [editor]);

  return () => {
    editor.dispatchCommand(TOGGLE_BOLD_COMMAND);// Use editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") instead
  };
}

```

use:

```
import { useToggleBold } from "./useToggleBold";

export default function MyEditorToolbar() {
  const toggleBold = useToggleBold();

  return (
    <button onClick={toggleBold}>
      <span aria-label="Format as bold" role="button">
        B
      </span>
    </button>
  );
}
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
