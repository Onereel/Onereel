import { Plus } from "lucide-react";

export function MobilePostButton() {
  return (
    <a
      href="/collaborations/create"
      className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center justify-center"
    >
      <Plus size={28} strokeWidth={3} />
    </a>
  );
}
