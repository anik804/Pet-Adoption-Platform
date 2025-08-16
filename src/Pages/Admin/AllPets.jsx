import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { usePagination, useSortBy, useTable } from "react-table";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

Modal.setAppElement("#root");

function AllPets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(
          `https://pet-adoption-platform-server-side.vercel.app/pets`
        );
        setPets(res.data.pets || res.data || []);
      } catch {
        setErrorMsg("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleAdopt = async (id) => {
    try {
      await axios.patch(
        `https://pet-adoption-platform-server-side.vercel.app/pets/${id}`,
        { adopted: true }
      );
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: true } : pet))
      );
    } catch {
      setErrorMsg("Failed to update adoption status");
    }
  };

  const handleUnadopt = async (id) => {
    try {
      await axios.patch(
        `https://pet-adoption-platform-server-side.vercel.app/pets/${id}`,
        { adopted: false }
      );
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: false } : pet))
      );
    } catch {
      setErrorMsg("Failed to update adoption status");
    }
  };

  const handleDelete = async () => {
    if (!petToDelete) return;
    try {
      await axios.delete(
        `https://pet-adoption-platform-server-side.vercel.app/pets/${petToDelete._id}`
      );
      setPets((prev) => prev.filter((pet) => pet._id !== petToDelete._id));
      setModalIsOpen(false);
      setPetToDelete(null);
    } catch {
      setErrorMsg("Failed to delete pet");
    }
  };

  const data = useMemo(() => pets, [pets]);

  const columns = useMemo(
    () => [
      {
        Header: "S/N",
        accessor: (_row, i) => i + 1,
        id: "serialNumber",
      },
      {
        Header: "Pet Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Image",
        accessor: "petImage",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="pet"
            className="w-14 h-14 object-cover rounded-md border"
          />
        ),
      },
      {
        Header: "Status",
        accessor: "adopted",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {value ? "Adopted" : "Not Adopted"}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600"
              onClick={() =>
                navigate(`/dashboard/update-pet/${row.original._id}`)
              }
            >
              Update
            </button>
            <button
              className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
              onClick={() => {
                setPetToDelete(row.original);
                setModalIsOpen(true);
              }}
            >
              Delete
            </button>
            {!row.original.adopted ? (
              <button
                className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                onClick={() => handleAdopt(row.original._id)}
              >
                Mark Adopted
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded-md bg-gray-600 text-white text-sm hover:bg-gray-700"
                onClick={() => handleUnadopt(row.original._id)}
              >
                Mark Not Adopted
              </button>
            )}
          </div>
        ),
      },
    ],
    [navigate]
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

  // Skeleton Loader for table rows
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-6 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="w-14 h-14 bg-gray-200 rounded-md"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back to Profile */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition"
        >
          <ArrowLeft size={18} /> Back to Profile
        </button>
      </div>

      {/* Animated Heading */}
      <motion.h2
        className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.span
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent inline-block bg-[length:200%_200%]"
        >
          All Pets Management
        </motion.span>
      </motion.h2>

      {errorMsg && (
        <p className="text-red-600 bg-red-100 px-3 py-2 rounded mb-4">
          {errorMsg}
        </p>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table
          {...getTableProps()}
          className="min-w-[750px] w-full text-sm text-gray-800 dark:text-gray-200"
        >
          <thead className="bg-gray-100 dark:bg-gray-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-100 cursor-pointer select-none"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : page.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No pets found.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.original._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="px-4 py-3 align-middle"
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
      {!loading && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="space-x-2">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
          <span className="text-sm">
            Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}
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
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white dark:bg-gray-900 w-[90%] max-w-md mx-auto p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Confirm Delete
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{petToDelete?.name}</span>?
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AllPets;
