import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { FiUserPlus, FiX, FiChevronDown } from "react-icons/fi";
import { assignTicket, getAllStaffUsers } from "../../../../services/ticketService";

// Custom dropdown component
function CustomDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-2.5 text-sm text-white outline-none transition-all hover:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 ${
          open ? "ring-2 ring-orange-500/20 border-orange-500/40" : ""
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-orange-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-xl">
          <div className="max-h-56 overflow-y-auto custom-scroll">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm transition-all ${
                  option.value === value
                    ? "bg-orange-500/20 text-orange-300 font-semibold"
                    : "text-zinc-300 hover:bg-orange-500/10 hover:text-orange-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(251,146,60,0.4);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(251,146,60,0.6);
        }
      `}</style>
    </div>
  );
}

export default function AssignStaffModal({ ticket, onClose, onAssigned }) {
  const [staffUsers, setStaffUsers] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      const response = await getAllStaffUsers();
      setStaffUsers(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load staff users");
    }
  };

  const handleAssign = async () => {
    if (!staffId) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      setLoading(true);
      await assignTicket(ticket.id, { staffId: Number(staffId) });
      toast.success("Staff assigned successfully");
      if (onAssigned) onAssigned();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to assign staff");
    } finally {
      setLoading(false);
    }
  };

  // Prepare options for custom dropdown
  const staffOptions = [
    { value: "", label: "Choose staff" },
    ...staffUsers.map((staff) => ({
      value: staff.id,
      label: `${staff.fullName} - ${staff.email}`,
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Assign Staff</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400">Ticket</p>
            <p className="font-semibold text-white">{ticket.title}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300">
              Select Staff Member
            </label>
            <CustomDropdown
              value={staffId}
              options={staffOptions}
              onChange={(val) => setStaffId(val)}
              placeholder="Choose staff"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-orange-500/20 pt-6">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-orange-500/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <FiUserPlus size={16} />
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}