import axios from "../../axios"; // Ensure this import is correct

const handleUpload = async () => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const uploadResponse = await axios.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSnackbar(`File uploaded successfully. URL: ${uploadResponse.data.url}`, "success");
      await analyzeDocument(uploadResponse.data.url);
      onUploadSuccess(); // Refresh document list on successful upload and analysis
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        showSnackbar(`Error uploading file: ${error.response.data.error || error.response.data.message}`, "error");
      } else {
        showSnackbar(`Error uploading file: ${error.message}`, "error");
      }
    } finally {
      setUploading(false);
    }
  }
};

const analyzeDocument = async (sasUrl) => {
  try {
    const response = await axios.post("/analyze", { url: sasUrl });
    console.log("Analysis success:", response.data);
    showSnackbar("Document analysis completed successfully.", "success");
  } catch (error) {
    console.error("Analysis failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      showSnackbar(`Error analyzing document: ${error.response.data.error || error.response.data.message}`, "error");
    } else {
      showSnackbar(`Error analyzing document: ${error.message}`, "error");
    }
  }
};
