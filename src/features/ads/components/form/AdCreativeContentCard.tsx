import { useFormContext } from "react-hook-form";
import { HelpCircle, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface AdCreativeContentCardProps {
  adImagePreview: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdCreativeContentCard({
  adImagePreview,
  handleImageUpload,
}: AdCreativeContentCardProps) {
  const { register, watch, setValue } = useFormContext();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>Creative & Content</CardTitle>
        <CardDescription>
          Provide the visual assets and text content for the ad.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Ad Image <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() =>
              document.getElementById("ad-image-upload-edit")?.click()
            }
          >
            {adImagePreview ? (
              <img
                src={adImagePreview}
                alt="Preview"
                className="max-h-48 object-contain mb-4 rounded-md shadow-sm"
              />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mb-3" />
            )}
            <div className="text-sm text-gray-600 font-medium">
              Click to upload or drag and drop
            </div>
            <div className="text-xs text-gray-500 mt-1">
              PNG, JPG or WEBP (MAX. 2MB)
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 bg-teal-600 text-white border-transparent hover:bg-teal-700 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("ad-image-upload-edit")?.click();
              }}
            >
              Browse file
            </Button>
            <input
              id="ad-image-upload-edit"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Short Description <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <RichTextEditor
            content={watch("description")}
            onChange={(content) => setValue("description", content)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <Switch
              checked={watch("handover")}
              onCheckedChange={(checked) => setValue("handover", checked)}
            />
            <Label className="cursor-pointer">Handover</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={watch("developer")}
              onCheckedChange={(checked) => setValue("developer", checked)}
            />
            <Label className="cursor-pointer">Developer</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={watch("price")}
              onCheckedChange={(checked) => setValue("price", checked)}
            />
            <Label className="cursor-pointer">Price</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={watch("rate")}
              onCheckedChange={(checked) => setValue("rate", checked)}
            />
            <Label className="cursor-pointer">Rate</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Call-to-Action Button Text
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Input
              placeholder="e.g. Hurry Up!"
              {...register("ctaButtonText")}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Call-to-Action Link
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Input
              placeholder="https://example.com"
              {...register("ctaUrl")}
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
