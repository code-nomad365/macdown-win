import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, undo, redo } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { search, searchKeymap } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { foldGutter, foldKeymap } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: 'light' | 'dark';
  onScroll?: (scrollPercentage: number) => void;
}

export interface CodeMirrorEditorRef {
  undo: () => void;
  redo: () => void;
  insertBold: () => void;
  insertItalic: () => void;
  insertCode: () => void;
  insertQuote: () => void;
  insertList: () => void;
  insertOrderedList: () => void;
  insertHeading: () => void;
  insertLink: () => void;
  insertImage: () => void;
  indentLines: () => void;
  outdentLines: () => void;
}

// 淺色主題配置
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    color: '#24292e',
  },
  '.cm-content': {
    caretColor: '#24292e',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#24292e',
  },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: '#d7d4f0',
  },
  '.cm-activeLine': {
    backgroundColor: '#f6f8fa',
  },
  '.cm-gutters': {
    backgroundColor: '#f6f8fa',
    color: '#6e7781',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#e8eaed',
  },
}, { dark: false });

const CodeMirrorEditor = forwardRef<CodeMirrorEditorRef, CodeMirrorEditorProps>(
  ({ value, onChange, theme = 'dark', onScroll }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const themeCompartment = useRef(new Compartment());

    // 暴露方法給父組件
    useImperativeHandle(ref, () => ({
      undo: () => {
        if (viewRef.current) {
          undo(viewRef.current);
        }
      },
      redo: () => {
        if (viewRef.current) {
          redo(viewRef.current);
        }
      },
      insertBold: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `**${selectedText}**` : '**粗體文字**';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + (selectedText ? newText.length : 2) },
          });
          view.focus();
        }
      },
      insertItalic: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `*${selectedText}*` : '*斜體文字*';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + (selectedText ? newText.length : 1) },
          });
          view.focus();
        }
      },
      insertCode: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `\`${selectedText}\`` : '`程式碼`';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + (selectedText ? newText.length : 1) },
          });
          view.focus();
        }
      },
      insertQuote: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `> ${selectedText}` : '> 引用文字';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + newText.length },
          });
          view.focus();
        }
      },
      insertList: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `- ${selectedText}` : '- 列表項目';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + newText.length },
          });
          view.focus();
        }
      },
      insertOrderedList: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `1. ${selectedText}` : '1. 列表項目';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + newText.length },
          });
          view.focus();
        }
      },
      insertHeading: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `## ${selectedText}` : '## 標題';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: { anchor: selection.from + newText.length },
          });
          view.focus();
        }
      },
      insertLink: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const selectedText = view.state.sliceDoc(selection.from, selection.to);
          const newText = selectedText ? `[${selectedText}](url)` : '[連結文字](url)';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: {
              anchor: selection.from + newText.indexOf('url'),
              head: selection.from + newText.indexOf('url') + 3
            },
          });
          view.focus();
        }
      },
      insertImage: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const newText = '![圖片描述](image-url)';
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newText },
            selection: {
              anchor: selection.from + newText.indexOf('image-url'),
              head: selection.from + newText.indexOf('image-url') + 9
            },
          });
          view.focus();
        }
      },
      indentLines: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const doc = view.state.doc;
          const line = doc.lineAt(selection.from);

          view.dispatch({
            changes: { from: line.from, to: line.from, insert: '  ' },
            selection: { anchor: selection.from + 2, head: selection.to + 2 },
          });
          view.focus();
        }
      },
      outdentLines: () => {
        if (viewRef.current) {
          const view = viewRef.current;
          const selection = view.state.selection.main;
          const doc = view.state.doc;
          const line = doc.lineAt(selection.from);
          const lineText = line.text;

          // 移除開頭的空格（最多2個）
          if (lineText.startsWith('  ')) {
            view.dispatch({
              changes: { from: line.from, to: line.from + 2, insert: '' },
              selection: { anchor: Math.max(line.from, selection.from - 2), head: Math.max(line.from, selection.to - 2) },
            });
          } else if (lineText.startsWith(' ')) {
            view.dispatch({
              changes: { from: line.from, to: line.from + 1, insert: '' },
              selection: { anchor: Math.max(line.from, selection.from - 1), head: Math.max(line.from, selection.to - 1) },
            });
          }
          view.focus();
        }
      },
    }));

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        foldGutter(),
        search(),
        autocompletion(),
        markdown(),
        themeCompartment.current.of(theme === 'dark' ? oneDark : lightTheme),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...foldKeymap,
          ...completionKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
          },
          '.cm-scroller': {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
            fontSize: '14px',
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // 添加滾動監聽器
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      // 使用 debounce 避免過度觸發
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (onScroll && view) {
          const scrollDOM = view.scrollDOM;
          const scrollTop = scrollDOM.scrollTop;
          const scrollHeight = scrollDOM.scrollHeight - scrollDOM.clientHeight;
          const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
          onScroll(scrollPercentage);
        }
      }, 50);
    };

    view.scrollDOM.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      view.scrollDOM.removeEventListener('scroll', handleScroll);
      view.destroy();
    };
  }, [onScroll]);

  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (value !== currentValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  // 動態更新主題
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: themeCompartment.current.reconfigure(
          theme === 'dark' ? oneDark : lightTheme
        ),
      });
    }
  }, [theme]);

  return <div ref={editorRef} className="h-full w-full" />;
  }
);

CodeMirrorEditor.displayName = 'CodeMirrorEditor';

export default CodeMirrorEditor;
