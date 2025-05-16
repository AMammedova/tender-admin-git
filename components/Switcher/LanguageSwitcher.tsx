import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const locales = [
    { code: "en", name: "English" },
    { code: "az", name: "Azərbaycanca" },
    { code: "ru", name: "Русский" },
  ];

  const getCurrentLocale = () => {
    const match = pathname ? pathname.match(/^\/(en|az|ru)/) : null;
    return match ? match[1] : "en";
  };

  const handleLocaleChange = (locale: string) => {
    if (pathname) {
      const newPath = pathname.replace(/^\/(en|az|ru)/, `/${locale}`);
      router.push(newPath);
    }
  };

  return (
    <div className="w-36">
      <Select
        defaultValue={getCurrentLocale()}
        onValueChange={handleLocaleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((locale) => (
            <SelectItem key={locale.code} value={locale.code}>
              {locale.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
