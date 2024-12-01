import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const CustomEditor = ({ value, onChange, height = 400 }) => {
  return (
    <Editor
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
      value={value}
      init={{
        height,
        menubar: "file edit view insert format tools table",
        plugins: `
          advlist autolink lists link image charmap print preview anchor 
          searchreplace visualblocks code fullscreen insertdatetime media 
          table paste code wordcount
        `,
        toolbar: `
          undo redo | formatselect | bold italic | 
          alignleft aligncenter alignright alignjustify | 
          bullist numlist outdent indent | image
        `,

        image_caption: true, // Cho phép thêm caption vào hình ảnh
        // dialog_type: "image", // Đảm bảo cửa sổ chèn ảnh được kích hoạt đúng cách
        // automatic_uploads: true, // Cho phép tự động tải lên hình ảnh
        // images_upload_url: "/upload-image", // Thêm URL xử lý upload ảnh
        // file_picker_types: "image", // Chỉ chọn tệp hình ảnh
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
              const file = this.files[0];
              const reader = new FileReader();
              reader.onload = function () {
                callback(reader.result, { alt: file.name });
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }
        },
      }}
      onEditorChange={onChange}
      onError={(error) => {
        console.error("TinyMCE Error:", error);
      }}
    />
  );
};

export default CustomEditor;
