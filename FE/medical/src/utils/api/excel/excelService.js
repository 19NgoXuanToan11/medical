import axios from "axios";

const API_BASE_URL = "https://localhost:7111/api";

export class ExcelService {
  // Download Excel template
  static async downloadTemplate() {
    try {
      const response = await axios.get(`${API_BASE_URL}/ExcelImport/template`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "StudentImportTemplate.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      console.error("Error downloading template:", error);
      throw new Error(
        error.response?.data?.message ||
          "Không thể tải xuống template. Vui lòng thử lại sau."
      );
    }
  }

  // Import Excel file
  static async importFile(file) {
    try {
      if (!file) {
        throw new Error("Vui lòng chọn file trước khi tải lên.");
      }

      // Validate file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Chỉ chấp nhận file Excel (.xlsx, .xls)");
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/ExcelImport/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error importing file:", error);
      if (error.message) {
        throw error;
      }
      throw new Error(
        error.response?.data?.message ||
          "Lỗi khi tải lên file. Vui lòng kiểm tra định dạng và thử lại."
      );
    }
  }
}

export default ExcelService;
