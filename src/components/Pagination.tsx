// \src\components\Pagination.tsx
"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page > 4) pages.push(1, "...");

      for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        pages.push(i);
      }

      if (page < totalPages - 3) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center p-4 space-x-2 text-gray-600">
      <button
        disabled={!hasPrev}
        className="flex items-center px-3 py-2 text-sm font-medium transition bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <div className="flex items-center space-x-2">
        {getPageNumbers().map((p, index) =>
          typeof p === "number" ? (
            <button
              key={index}
              className={`px-3 py-2 text-sm font-medium rounded-full ${
                page === p ? "bg-LamaPurple text-white" : "bg-gray-100 hover:bg-gray-200"
              } transition`}
              onClick={() => changePage(p)}
            >
              {p}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-500">
              {p}
            </span>
          )
        )}
      </div>

      <button
        disabled={!hasNext}
        className="flex items-center px-3 py-2 text-sm font-medium transition bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page + 1)}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
