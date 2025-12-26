import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code,
  ImageIcon,
  Youtube as YoutubeIcon,
  Link as LinkIcon,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function TipTapEditor({ content, onChange, minHeight = '200px' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-md',
        },
        width: 640,
        height: 360,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
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

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
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

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Tooltip label="Add Link">
          <ActionIcon
            variant={editor.isActive('link') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={addLink}
          >
            <LinkIcon size={16} />
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
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-3 [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_img]:my-4 [&_.ProseMirror_iframe]:my-4"
      />
    </div>
  );
}
