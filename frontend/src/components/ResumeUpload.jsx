import React, { useState } from "react";
import api from "../services/api";

function ResumeUpload({ onUploadSuccess, currentResumeId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf");
    const isDocx = fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      setError("Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 10MB limit. Please upload a smaller resume file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF or DOCX resume to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      // Post to /resumes/upload using the api instance
      const response = await api.post(
  "/resumes/upload",
  formData
);

      const resumeData = response.data;
      setUploadedResume(resumeData);

      if (onUploadSuccess && resumeData.id) {
        onUploadSuccess(resumeData.id, resumeData);
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Failed to upload resume. Please check your network and try again.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="resume-upload-card">
      <div className="resume-upload-header">
        <div className="resume-upload-icon-box">📄</div>
        <div>
          <h2 className="resume-upload-title">Step 1: Upload Your Resume</h2>
          <p className="resume-upload-subtitle">
            Upload your latest resume in PDF or DOCX format (Max 10MB).
          </p>
        </div>
      </div>

      <div className="resume-dropzone">
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          disabled={uploading}
          className="resume-file-input"
        />
        <label htmlFor="resume-file-input" className="resume-dropzone-label">
          <span className="dropzone-icon">📁</span>
          <span className="dropzone-text">
            {selectedFile ? "Change Selected File" : "Click to Browse or Drag & Drop Resume"}
          </span>
          <span className="dropzone-hint">Supports PDF and DOCX files</span>
        </label>
      </div>

      {selectedFile && (
        <div className="selected-file-preview">
          <div className="file-info-left">
            <span className="file-format-badge">
              {selectedFile.name.endsWith(".pdf") ? "PDF" : "DOCX"}
            </span>
            <div className="file-details">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
            </div>
          </div>

          <button
            type="button"
            className="upload-action-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Uploading Resume...</span>
              </>
            ) : uploadedResume ? (
              "✓ Re-upload"
            ) : (
              "⬆️ Upload Resume"
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="resume-upload-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {uploadedResume && (
        <div className="resume-upload-success">
          <span className="success-icon">✓</span>
          <div>
            <strong>Resume Uploaded Successfully!</strong>
            <p>Resume ID: #{uploadedResume.id} ({uploadedResume.fileName}) ready for AI analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
