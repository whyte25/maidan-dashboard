import { Streamdown } from "streamdown";

export const EditorPreview = ({ markdown }: { markdown: string }) => {
  return (
    <Streamdown
      controls={{
        table: false,
        code: false,
        mermaid: {
          download: false,
          copy: true,
          fullscreen: true,
          panZoom: true,
        },
      }}
      className="not-prose "
    >
      {markdown}
    </Streamdown>
  );
};
