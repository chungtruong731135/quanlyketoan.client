import React from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import axios from "axios";
import * as authHelper from "@/app/modules/auth/core/AuthHelpers";

import { API_URL, FILE_URL } from "@/utils/baseAPI";

const editorConfiguration = {
  toolbar: ["bold", "italic"],
};

const uploadAdapter = (loader) => {
  const { token } = authHelper.getAuth();

  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        try {
          const file = await loader.file;
          const response = await axios.request({
            method: "POST",
            url: `${API_URL}/api/v1/attachments/public`,
            data: {
              files: file,
            },
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          resolve({
            default: `${FILE_URL}${response.data.data[0].url}`,
          });
        } catch (error) {
          console.log(error);
        }
      });
    },
    abort: () => {},
  };
};
function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}
const TDEditorNew = ({ data, onChange }) => {
  return (
    <>
      {/* <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [uploadPlugin],
      }}
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    /> */}
      <CKEditor
        editor={Editor}
        config={{
          extraPlugins: [uploadPlugin],
          toolbar: [
            "undo",
            "redo",
            "removeFormat",
            "|",
            "heading",
            "selectAll",
            "fontSize",
            "fontFamily",
            "fontColor",
            "|",
            "bold",
            "italic",
            "specialCharacters",
            "|",
            "link",
            "insertImage",
            "insertTable",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "|",
            "code",
            "sourceEditing",
            "htmlEmbed",
          ],
        }}
        data={data}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </>
  );
};

export default TDEditorNew;
