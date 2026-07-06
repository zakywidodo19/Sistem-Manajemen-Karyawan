function Pagination({
  page,
  totalPage,
  onPageChange,
}) {
  if (!totalPage || totalPage <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Previous
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-lg ${
              page === index + 1
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        disabled={page === totalPage}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;