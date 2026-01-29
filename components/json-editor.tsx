"use client";

import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@uiw/react-codemirror";

interface JSONEditorBaseProps {
  value: string;
  className?: string;
}

interface JSONEditorRequestProps extends JSONEditorBaseProps {
  onChange: (value: string) => void;
  editable?: true;
}

interface JSONEditorResponseProps extends JSONEditorBaseProps {
  editable?: false;
}

type JSONEditorProps = JSONEditorRequestProps | JSONEditorResponseProps;

const JSONEditor = (props: JSONEditorProps) => {
  const { resolvedTheme } = useTheme();
  const noFocusOutlineRule = EditorView.theme({
    "&.cm-focused": {
      outline: "none",
    },
  });

  const extensions = [json(), noFocusOutlineRule];
  const theme = resolvedTheme === "dark" ? githubDark : githubLight;

  const { value, className } = props;
  const onChange = "onChange" in props ? props.onChange : undefined;
  const editable = "editable" in props ? props.editable !== false : true;

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      editable={editable}
      extensions={extensions}
      theme={theme}
      className={className}
    />
  );
};

export default JSONEditor;
