'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { useEffect } from 'react';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, 
  Table as TableIcon, Undo, Redo, Eraser, Plus, Trash2
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({ onClick, active, title, children, danger }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode; danger?: boolean }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-2 rounded-lg transition-all flex items-center justify-center ${
      active 
        ? 'bg-zinc-900 text-white shadow-sm' 
        : danger 
          ? 'text-red-500 hover:bg-red-50' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-slate-200 mx-1 self-center shrink-0" />;

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-emerald-600 underline' } }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[400px] px-8 py-6 focus:outline-none text-slate-800 leading-relaxed text-[16px] prose-custom',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL:', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border-2 border-slate-200 rounded-[24px] overflow-hidden bg-white shadow-sm focus-within:border-emerald-400/50 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-slate-100 bg-slate-50/50">
        
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Büyük Başlık"><Heading1 size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Orta Başlık"><Heading2 size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Küçük Başlık"><Heading3 size={18} /></ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Kalın"><Bold size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="İtalik"><Italic size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Altı Çizili"><UnderlineIcon size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Üstü Çizili"><Strikethrough size={18} /></ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-1">
            {[
              { color: '#0f172a', label: 'Siyah' },
              { color: '#10b981', label: 'Yeşil' },
              { color: '#ef4444', label: 'Kırmızı' },
              { color: '#3b82f6', label: 'Mavi' },
              { color: '#f59e0b', label: 'Turuncu' },
            ].map(item => (
              <button
                key={item.color}
                type="button"
                onClick={() => editor.chain().focus().setColor(item.color).run()}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${editor.isActive('textStyle', { color: item.color }) ? 'border-zinc-900' : 'border-white'}`}
                style={{ backgroundColor: item.color }}
                title={item.label}
              />
            ))}
            <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className="p-1 text-slate-400 hover:text-slate-900" title="Rengi Sıfırla"><Eraser size={14} /></button>
          </div>
        </div>

        <Divider />

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Sola Sola"><AlignLeft size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Ortala"><AlignCenter size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Sağa Yasla"><AlignRight size={18} /></ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Madde Listesi"><List size={18} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı Liste"><ListOrdered size={18} /></ToolbarButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-100/50 border-b border-slate-100">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Alıntı"><Quote size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Kod"><Code size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Ayırıcı Çizgi"><Minus size={16} /></ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link Ekle"><LinkIcon size={16} /></ToolbarButton>

        <Divider />

        <div className="flex items-center gap-1 outline outline-1 outline-slate-200 rounded-lg p-0.5 bg-white">
          <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} active={false} title="Tablo Ekle"><TableIcon size={16} /></ToolbarButton>
          {editor.isActive('table') && (
            <>
              <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()} active={false} title="Sola Sütun Ekle"><Plus size={14} className="rotate-90 text-[10px]" />S</ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()} active={false} title="Üste Satır Ekle"><Plus size={14} />S</ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} active={false} danger title="Sütun Sil"><Trash2 size={14} />S</ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} active={false} danger title="Satır Sil"><Trash2 size={14} />S</ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} active={false} danger title="Tabloyu Sil"><Trash2 size={16} className="text-red-600" /></ToolbarButton>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} title="Geri Al"><Undo size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} title="İleri Al"><Redo size={16} /></ToolbarButton>
        </div>
      </div>

      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .prose-custom p { margin-bottom: 0.75rem; }
        .prose-custom h1 { font-size: 2rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; color: #0f172a; }
        .prose-custom h2 { font-size: 1.5rem; font-weight: 800; margin-top: 1.25rem; margin-bottom: 0.75rem; color: #1e293b; }
        .prose-custom h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #334155; }
        .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-custom ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-custom table { width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #e2e8f0; }
        .prose-custom th, .prose-custom td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
        .prose-custom th { background-color: #f8fafc; font-weight: 700; }
        .prose-custom blockquote { border-left: 4px solid #10b981; padding-left: 1rem; font-style: italic; color: #64748b; margin-bottom: 1rem; }
        .prose-custom hr { border: 0; border-top: 2px solid #f1f5f9; my: 2rem; }
        .ProseMirror-focused { outline: none !important; }
      `}</style>
    </div>
  );
}
