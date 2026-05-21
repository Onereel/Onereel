export function FormField({ label, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
      <label className="block text-sm font-semibold text-[#111418] mb-4">
        {label}
      </label>
      {children}
    </div>
  );
}
