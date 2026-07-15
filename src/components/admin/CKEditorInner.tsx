"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  SimpleUploadAdapter,
  SourceEditing,
  Table,
  TableToolbar,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

/**
 * Trình soạn thảo bài viết. Ảnh chèn trong bài được upload lên
 * /api/v1/uploads (lưu public/uploads, DB chỉ giữ path) qua SimpleUploadAdapter.
 */
export default function CKEditorInner({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_event, editor) => onChange(editor.getData())}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Link,
          List,
          Indent,
          BlockQuote,
          Table,
          TableToolbar,
          Image,
          ImageToolbar,
          ImageUpload,
          ImageCaption,
          ImageStyle,
          ImageResize,
          SimpleUploadAdapter,
          MediaEmbed,
          SourceEditing,
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "link",
          "|",
          "bulletedList",
          "numberedList",
          "outdent",
          "indent",
          "blockQuote",
          "insertTable",
          "|",
          "uploadImage",
          "mediaEmbed",
          "|",
          "undo",
          "redo",
          "|",
          "sourceEditing",
        ],
        heading: {
          options: [
            { model: "paragraph", title: "Đoạn văn", class: "ck-heading_paragraph" },
            { model: "heading2", view: "h2", title: "Tiêu đề H2", class: "ck-heading_heading2" },
            { model: "heading3", view: "h3", title: "Tiêu đề H3", class: "ck-heading_heading3" },
          ],
        },
        simpleUpload: { uploadUrl: "/api/v1/uploads" },
        image: {
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "|",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
          ],
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
        link: {
          decorators: {
            openInNewTab: {
              mode: "manual",
              label: "Mở trong tab mới",
              attributes: { target: "_blank", rel: "noopener noreferrer" },
            },
          },
        },
      }}
    />
  );
}
