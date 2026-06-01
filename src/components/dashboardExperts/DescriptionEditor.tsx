'use client'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

interface RichTextEditorProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder ?? 'Write text here...'}
        />
    )
}
