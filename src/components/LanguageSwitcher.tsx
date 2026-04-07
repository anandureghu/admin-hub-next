import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground">
      <Globe className="w-5 h-5 shrink-0" />
      
      <Select
        value={i18n.language}
        onValueChange={(val) => i18n.changeLanguage(val)}
      >
        <SelectTrigger className="w-full h-9 bg-secondary/50 border-border hover:bg-secondary/80 transition-colors focus:ring-1 focus:ring-primary/50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        
        <SelectContent side="top" className="bg-popover border-border shadow-md">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}