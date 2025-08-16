import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { usePagination, useSortBy, useTable } from "react-table";
import { motion } from "framer-motion";

Modal.setAppElement("#root");

function AllDonations() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns`
        );
        setCampaigns(res.data.campaigns || res.data || []);
      } catch {
        setErrorMsg("Failed to fetch donation campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await axios.delete(
        `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/${campaignToDelete._id}`
      );
      setCampaigns((prev) =>
        prev.filter((c) => c._id !== campaignToDelete._id)
      );
      setModalIsOpen(false);
      setCampaignToDelete(null);
    } catch {
      setErrorMsg("Failed to delete donation campaign");
    }
  };

  const handlePauseToggle = async (id, pause) => {
    try {
      await axios.patch(
        `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/${id}`,
        { paused: pause }
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? { ...c, paused: pause } : c))
      );
    } catch {
      setErrorMsg("Failed to update campaign status");
    }
  };

  const data = useMemo(() => campaigns, [campaigns]);

  const columns = useMemo(
    () => [
      { Header: "S/N", accessor: (_row, i) => i + 1, id: "serialNumber" },
      { Header: "Pet Name", accessor: "petName" },
      { Header: "Max Donation", accessor: "maxDonation", Cell: ({ value }) => `$${value}` },
      { Header: "Donated Amount", accessor: "donatedAmount", Cell: ({ value }) => `$${value}` },
      { Header: "Status", accessor: "paused", Cell: ({ value }) => (value ? "Paused" : "Active") },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-2 py-1 rounded text-white text-sm ${
                row.original.paused ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
              onClick={() => handlePauseToggle(row.original._id, !row.original.paused)}
            >
              {row.original.paused ? "Unpause" : "Pause"}
            </button>
            <button
              className="px-2 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
              onClick={() => {
                setCampaignToDelete(row.original);
                setModalIsOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-pulse text-lg text-gray-600">Loading donation campaigns...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Animated Heading */}
      <motion.h1
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, color: ["#1E3A8A", "#9333EA", "#DC2626", "#16A34A", "#1E3A8A"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        All Donation Campaigns
      </motion.h1>

      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-[600px] w-full border border-gray-300 text-sm sm:text-base">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="border px-3 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No donation campaigns found.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.original._id} className="border-t hover:bg-gray-50 transition">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="border px-3 py-2 align-middle whitespace-nowrap"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="space-x-2 flex flex-wrap justify-center sm:justify-start">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-2 py-1 border rounded disabled:opacity-50">
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-2 py-1 border rounded disabled:opacity-50">
            {"<"}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="px-2 py-1 border rounded disabled:opacity-50">
            {">"}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-2 py-1 border rounded disabled:opacity-50">
            {">>"}
          </button>
        </div>
        <span className="text-sm">
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <motion.button
          onClick={() => navigate("/dashboard/profile")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅ Back
        </motion.button>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white w-[90%] max-w-md mx-auto p-6 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>
          Are you sure you want to delete the campaign "{campaignToDelete?.petName}"?
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <button onClick={() => setModalIsOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
            No
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Yes
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AllDonations;
