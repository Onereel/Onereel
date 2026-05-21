import { DollarSign } from "lucide-react";

export function TransactionsTab({ myTransactions, profile }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
        Transactions
      </h2>

      {myTransactions.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-12 text-center">
          <DollarSign
            size={48}
            className="mx-auto text-gray-300 dark:text-white/20 mb-4"
          />
          <p className="text-[#667085] dark:text-white/60">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F9FB] dark:bg-[#1E1E1E]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {myTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                >
                  <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">
                    {tx.job_id ? "Job" : "Gig"} #{tx.job_id || tx.gig_id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    <span
                      className={
                        tx.payer_id === profile.id
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {tx.payer_id === profile.id ? "-" : "+"}$
                      {parseFloat(tx.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "completed" || tx.status === "released"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : tx.status === "held" || tx.status === "in_progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : tx.status === "refunded"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#667085] dark:text-white/60">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
