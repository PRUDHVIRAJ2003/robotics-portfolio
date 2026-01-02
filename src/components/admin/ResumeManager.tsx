import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Download, Trash2 } from "lucide-react";

const ResumeManager = () => {
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const checkExistingResume = async () => {
    const { data } = await supabase.storage.from("resume").list();
    if (data && data.length > 0) {
      const file = data[0];
      const { data: urlData } = supabase.storage.from("resume").getPublicUrl(file.name);
      setResumeUrl(urlData.publicUrl);
      setResumeName(file.name);
    }
  };

  useState(() => {
    checkExistingResume();
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Error", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "File must be less than 10MB", variant: "destructive" });
      return;
    }

    setUploading(true);

    // Delete existing resume first
    const { data: existingFiles } = await supabase.storage.from("resume").list();
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage.from("resume").remove(existingFiles.map((f) => f.name));
    }

    // Upload new resume
    const fileName = `resume-${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from("resume")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("resume").getPublicUrl(fileName);
    setResumeUrl(urlData.publicUrl);
    setResumeName(fileName);
    toast({ title: "Success", description: "Resume uploaded successfully" });
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!resumeName) return;
    
    const { error } = await supabase.storage.from("resume").remove([resumeName]);
    if (error) {
      toast({ title: "Error", description: "Failed to delete resume", variant: "destructive" });
    } else {
      setResumeUrl(null);
      setResumeName(null);
      toast({ title: "Deleted", description: "Resume removed" });
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold">Resume Management</h2>

      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold">Downloadable Resume</h3>
            <p className="text-sm text-muted-foreground">Upload your resume PDF for visitors to download</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
        />

        {resumeUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">{resumeName}</p>
                <p className="text-xs text-muted-foreground">PDF Document</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" />
                  Preview
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Resume PDF
              </>
            )}
          </Button>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          This resume will be available for download from the hero section.
          The download button links to: <code className="bg-muted px-1 rounded">/resume.pdf</code>
        </p>
      </div>
    </div>
  );
};

export default ResumeManager;
