import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { TextAlign } from '@tiptap/extension-text-align';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { ActionIcon, Tooltip, Menu, ColorSwatch } from '@mantine/core';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListChecks,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Minus,
  Undo,
  Redo,
  ImageIcon,
  Youtube as YoutubeIcon,
  Link as LinkIcon,
  Unlink,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Palette,
  RemoveFormatting,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TEXT_COLORS = [
  '#000000', '#374151', '#DC2626', '#EA580C', '#D97706', 
  '#65A30D', '#16A34A', '#0D9488', '#0284C7', '#2563EB',
  '#7C3AED', '#C026D3', '#DB2777', '#64748B',
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FDE68A', '#FED7AA', '#FECACA', '#E9D5FF',
  '#BFDBFE', '#A7F3D0', '#99F6E4', '#E2E8F0',
];

export function TipTapEditor({ content, onChange, placeholder = 'Write something...', minHeight = '200px' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-md',
        },
        width: 640,
        height: 360,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {/* Undo / Redo */}
        <Tooltip label="Undo">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Redo">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <Tooltip label="Bold">
          <ActionIcon
            variant={editor.isActive('bold') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Italic">
          <ActionIcon
            variant={editor.isActive('italic') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Underline">
          <ActionIcon
            variant={editor.isActive('underline') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Strikethrough">
          <ActionIcon
            variant={editor.isActive('strike') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Code">
          <ActionIcon
            variant={editor.isActive('code') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Color */}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Tooltip label="Text Color">
              <ActionIcon variant="subtle" color="gray" size="sm">
                <Palette size={16} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <div className="p-2">
              <p className="text-xs text-gray-500 mb-2">Text Color</p>
              <div className="flex flex-wrap gap-1">
                {TEXT_COLORS.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    size={20}
                    className="cursor-pointer"
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
              <button
                className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Reset color
              </button>
            </div>
          </Menu.Dropdown>
        </Menu>

        {/* Highlight */}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Tooltip label="Highlight">
              <ActionIcon
                variant={editor.isActive('highlight') ? 'filled' : 'subtle'}
                color="gray"
                size="sm"
              >
                <Highlighter size={16} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <div className="p-2">
              <p className="text-xs text-gray-500 mb-2">Highlight Color</p>
              <div className="flex flex-wrap gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    size={20}
                    className="cursor-pointer"
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                  />
                ))}
              </div>
              <button
                className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
              >
                Remove highlight
              </button>
            </div>
          </Menu.Dropdown>
        </Menu>

        {/* Subscript / Superscript */}
        <Tooltip label="Subscript">
          <ActionIcon
            variant={editor.isActive('subscript') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <SubscriptIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Superscript">
          <ActionIcon
            variant={editor.isActive('superscript') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <SuperscriptIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <Tooltip label="Heading 1">
          <ActionIcon
            variant={editor.isActive('heading', { level: 1 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Heading 2">
          <ActionIcon
            variant={editor.isActive('heading', { level: 2 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Heading 3">
          <ActionIcon
            variant={editor.isActive('heading', { level: 3 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <Tooltip label="Align Left">
          <ActionIcon
            variant={editor.isActive({ textAlign: 'left' }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Align Center">
          <ActionIcon
            variant={editor.isActive({ textAlign: 'center' }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Align Right">
          <ActionIcon
            variant={editor.isActive({ textAlign: 'right' }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Justify">
          <ActionIcon
            variant={editor.isActive({ textAlign: 'justify' }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Tooltip label="Bullet List">
          <ActionIcon
            variant={editor.isActive('bulletList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ActionIcon>
        </Tooltip>
        
        <Tooltip label="Ordered List">
          <ActionIcon
            variant={editor.isActive('orderedList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Task List">
          <ActionIcon
            variant={editor.isActive('taskList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListChecks size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Block Elements */}
        <Tooltip label="Blockquote">
          <ActionIcon
            variant={editor.isActive('blockquote') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Horizontal Rule">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Links & Media */}
        <Tooltip label="Add Link">
          <ActionIcon
            variant={editor.isActive('link') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={setLink}
          >
            <LinkIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Remove Link">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
          >
            <Unlink size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Add Image">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={addImage}
          >
            <ImageIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Add YouTube Video">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={addYoutubeVideo}
          >
            <YoutubeIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Clear Formatting */}
        <Tooltip label="Clear Formatting">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <RemoveFormatting size={16} />
          </ActionIcon>
        </Tooltip>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4"
      />

     
    </div>
  );
}
