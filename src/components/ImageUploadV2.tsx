import React, { useRef, useState, useEffect } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (file: File | null) => void;
    onRemove: () => void;
    className?: string;
    maxSize?: number; // in MB
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    className,
    maxSize = 5,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds the limit of ${maxSize}MB`);
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (JPG or PNG)");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("space-y-4 w-full", className)}>
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center min-h-[160px]",
                    preview
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                />

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
                        />
                        <div className={cn(
                            "z-10 flex flex-col items-center gap-2 transition-all duration-300",
                            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        )}>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="bg-background/80 backdrop-blur-sm"
                            >
                                Change Image
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                        <div className="p-3 rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Click to upload image</p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG or WebP (Max {maxSize}MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
