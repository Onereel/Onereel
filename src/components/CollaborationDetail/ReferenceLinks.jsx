import { ExternalLink } from "lucide-react";

export function ReferenceLinks({ urls }) {
  if (!urls || urls.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111418] mb-3 flex items-center gap-2">
        <ExternalLink size={24} className="text-gray-600" />
        Reference Links
      </h2>
      <div className="space-y-2">
        {urls.map((url, idx) => (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-2 text-[#667085] group-hover:text-purple-600">
              <ExternalLink size={16} />
              <span className="truncate">{url}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
