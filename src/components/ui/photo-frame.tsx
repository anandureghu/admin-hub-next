import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // Added

export const PhotoFrame = ({ title, url }: { title: string, url: string | null | undefined }) => {
    const { t } = useTranslation(); // Initialize translation
    const [error, setError] = useState(false);

    return (
        <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground text-center tracking-wider">
                {title}
            </p>
            {url && !error ? (
                <div className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-secondary/20">
                    <img
                        src={url}
                        alt={title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={() => setError(true)}
                    />
                </div>
            ) : (
                <div className="aspect-square bg-secondary/30 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/60">
                    <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                    <span className="text-[10px] uppercase tracking-wider">
                        {url 
                            ? t("common.photoFrame.errorLoading") 
                            : t("common.photoFrame.notUploaded")
                        }
                    </span>
                </div>
            )}
        </div>
    );
}