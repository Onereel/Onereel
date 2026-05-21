import { Plus, Package } from "lucide-react";

export function GigsTab({ myGigs }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
          My Gigs
        </h2>
        <a
          href="/gigs/create"
          className="flex items-center px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create Gig
        </a>
      </div>

      {myGigs.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-12 text-center">
          <Package
            size={48}
            className="mx-auto text-gray-300 dark:text-white/20 mb-4"
          />
          <p className="text-[#667085] dark:text-white/60 mb-4">
            You haven't created any gigs yet
          </p>
          <a
            href="/gigs/create"
            className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Create Your First Gig
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <a
                    href={`/gigs/${gig.id}`}
                    className="text-xl font-bold text-[#111418] dark:text-white hover:text-[#1DA1F2] transition-colors"
                  >
                    {gig.title}
                  </a>
                  <p className="text-[#667085] dark:text-white/60 mt-2 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <span className="text-[#1DA1F2] font-semibold">
                      ${parseFloat(gig.price).toFixed(0)}
                    </span>
                    <span className="text-[#667085] dark:text-white/60">
                      {gig.delivery_days} days delivery
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gig.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {gig.status}
                    </span>
                    {gig.is_boosted && (
                      <span className="px-3 py-1 bg-gradient-to-r from-[#FFD400] to-[#FFA000] text-[#111418] rounded-full text-xs font-bold">
                        ⭐ Boosted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
