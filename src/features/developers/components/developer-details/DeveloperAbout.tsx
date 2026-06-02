import { DeveloperData } from "@/hooks/use-developer-details";
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";

interface DeveloperAboutProps {
  developer: DeveloperData;
  handleToggleTopDeveloper: (checked: boolean) => void;
  isTogglingTop: boolean;
}

export function DeveloperAbout({ developer, handleToggleTopDeveloper, isTogglingTop }: DeveloperAboutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          About Developer
        </h3>
        <div
          className="text-sm text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: developer.description || "No description available.",
          }}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm text-gray-900 font-medium">
              {developer.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm text-gray-900 font-medium">
              {developer.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Phone</span>
            <span className="text-sm text-gray-900 font-medium">
              {developer.phone_number || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Is Top Developer</span>
            <div className="flex items-center gap-2">
              <Switch
                id="is-top-developer-toggle"
                checked={developer.is_top === 1}
                onCheckedChange={handleToggleTopDeveloper}
                disabled={isTogglingTop}
              />
              <span className="text-sm text-gray-900 font-medium">
                {developer.is_top === 1 ? "Yes" : "No"}
              </span>
            </div>
          </div>
          {developer.website && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Website</span>
              <a
                href={developer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                Visit Site
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
