function BaseTable({
  columns = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = "Data tidak ditemukan",
  tableClassName = "w-full",
}) {
  return (
    <div className="overflow-auto max-h-[600px] rounded-lg shadow-sm bg-white">
      <table className={tableClassName}>
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className ?? "p-4"}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BaseTable;