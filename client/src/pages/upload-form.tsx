import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, VideoIcon, Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function UploadForm() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Files uploaded successfully to webhook",
        variant: "default",
      });
      // Reset form
      setPhotoFile(null);
      setVideoFile(null);
      setPhotoPreview(null);
      setVideoPreview(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, or GIF image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an MP4, MOV, or AVI video",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Video must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoFile && !videoFile) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    if (photoFile) formData.append("photo", photoFile);
    if (videoFile) formData.append("video", videoFile);

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">Upload Media Files</h1>
            <p className="text-sm text-muted-foreground">
              Upload photos and videos to your n8n webhook
            </p>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <label className="block text-base font-medium text-foreground">
              Photo
            </label>
            
            {!photoPreview ? (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="min-h-48 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate active-elevate-2 transition-colors bg-muted/30"
                data-testid="dropzone-photo"
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-base text-foreground font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  data-testid="input-photo"
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start gap-4">
                  <img
                    src={photoPreview}
                    alt="Photo preview"
                    className="w-32 h-32 object-cover rounded"
                    data-testid="preview-photo"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate" data-testid="text-photo-name">
                      {photoFile?.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-photo-size">
                      {photoFile && formatFileSize(photoFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removePhoto}
                    data-testid="button-remove-photo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-4">
            <label className="block text-base font-medium text-foreground">
              Video
            </label>
            
            {!videoPreview ? (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="min-h-48 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate active-elevate-2 transition-colors bg-muted/30"
                data-testid="dropzone-video"
              >
                <VideoIcon className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-base text-foreground font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  MP4, MOV, AVI up to 100MB
                </p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo"
                  onChange={handleVideoSelect}
                  className="hidden"
                  data-testid="input-video"
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start gap-4">
                  <video
                    src={videoPreview}
                    controls
                    className="w-48 h-32 object-cover rounded"
                    data-testid="preview-video"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate" data-testid="text-video-name">
                      {videoFile?.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-video-size">
                      {videoFile && formatFileSize(videoFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeVideo}
                    data-testid="button-remove-video"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold"
              disabled={(!photoFile && !videoFile) || uploadMutation.isPending}
              data-testid="button-submit"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {uploadMutation.isSuccess && (
            <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg" data-testid="status-success">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-primary">
                Files uploaded successfully!
              </p>
            </div>
          )}
          
          {uploadMutation.isError && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg" data-testid="status-error">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                {uploadMutation.error instanceof Error 
                  ? uploadMutation.error.message 
                  : "Upload failed. Please try again."}
              </p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
