import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiImage,
} from "react-icons/fi";
import { getBookingQr } from "../../../services/bookingService";
import toast from "react-hot-toast";
import logo from "../../../assets/logo.png";

function formatTime(t) {
  if (t == null) return "—";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function statusClasses(status) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 border border-red-200";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || "").split(" ");
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const finalLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    const last = finalLines[maxLines - 1];
    finalLines[maxLines - 1] = `${last}...`;
  }

  finalLines.forEach((line, idx) => {
    ctx.fillText(line, x, y + idx * lineHeight);
  });
  return finalLines.length;
}

export default function UserBookingCard({
  booking,
  resource,
  onCancel,
  onEdit,
  onDelete,
}) {
  const title = resource?.name || `Resource #${booking.resourceId}`;

  const imageUrl = resource?.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  const handleDownloadQr = async () => {
    try {
      // 1. Fetch QR code
      const qrResponse = await getBookingQr(booking.id);
      const qrBlob = new Blob([qrResponse.data], { type: "image/png" });
      const qrUrl = window.URL.createObjectURL(qrBlob);

      // 2. Load images
      const [qrImage, logoImage] = await Promise.all([
        loadImage(qrUrl),
        loadImage(logo),
      ]);

      // 3. Canvas dimensions
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 900;
      canvas.height = 1300;

      // 4. Background – warm cream
      ctx.fillStyle = "#fff7ed";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 5. Main white card with shadow
      ctx.save();
      roundedRect(ctx, 40, 40, 820, 1220, 32);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.shadowColor = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.restore();

      // 6. Logo and header
      ctx.drawImage(logoImage, 70, 80, 60, 60);
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 34px 'Inter', system-ui";
      ctx.fillText("CampusNexus", 150, 125);
      ctx.fillStyle = "#1e293b";
      ctx.font = "500 24px 'Inter'";
      ctx.fillText("Booking Pass", 150, 160);

      // 7. QR code (centered)
      const qrSize = 260;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 210;
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // 8. QR label
      ctx.fillStyle = "#64748b";
      ctx.font = "16px 'Inter'";
      ctx.fillText("Scan to verify booking", qrX + qrSize / 2 - 70, qrY + qrSize + 25);

      // 9. Divider
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, qrY + qrSize + 70);
      ctx.lineTo(830, qrY + qrSize + 70);
      ctx.stroke();

      // 10. Section title
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 26px 'Inter'";
      ctx.fillText("Booking Details", 70, qrY + qrSize + 130);

      // 11. Two‑column grid (more spacing)
      const startY = qrY + qrSize + 180;
      const col1X = 70;
      const col2X = 480;
      const rowHeight = 80;

      const drawDetail = (label, value, x, y) => {
        ctx.fillStyle = "#64748b";
        ctx.font = "16px 'Inter'";
        ctx.fillText(label, x, y);
        ctx.fillStyle = "#0f172a";
        ctx.font = "500 20px 'Inter'";
        drawWrappedText(ctx, value || "—", x, y + 28, 360, 28, 2);
      };

      drawDetail("Resource", title, col1X, startY);
      drawDetail("Location", resource?.location, col1X, startY + rowHeight);
      drawDetail("Date", booking.date, col1X, startY + rowHeight * 2);

      drawDetail("Time", `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`, col2X, startY);
      drawDetail("Attendees", booking.attendeeCount, col2X, startY + rowHeight);
      drawDetail("Status", booking.status?.replaceAll("_", " "), col2X, startY + rowHeight * 2);

      // 12. Purpose box – spacious
      const purposeY = startY + rowHeight * 3 + 20;
      ctx.fillStyle = "#fff7ed";
      roundedRect(ctx, 70, purposeY, 760, 140, 20);
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.font = "16px 'Inter'";
      ctx.fillText("Purpose", 90, purposeY + 35);
      ctx.fillStyle = "#0f172a";
      ctx.font = "500 20px 'Inter'";
      drawWrappedText(
        ctx,
        booking.purpose || "No purpose provided",
        90,
        purposeY + 65,
        700,
        30,
        3
      );

      // 13. Footer
      const footerY = purposeY + 170;
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 22px 'Inter'";
      ctx.fillText("CampusNexus", 70, footerY);
      ctx.fillStyle = "#64748b";
      ctx.font = "15px 'Inter'";
      ctx.fillText("Smart Campus Booking System", 210, footerY);

      // 14. Card border (optional)
      ctx.save();
      roundedRect(ctx, 40, 40, 820, 1220, 32);
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 15. Download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `campusnexus-booking-${booking.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(qrUrl);
      toast.success("Booking pass downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download booking pass");
    }
  };

  const canManage = booking.status === "PENDING";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
      {/* IMAGE SECTION */}
      <div className="relative h-44 w-full overflow-hidden flex-shrink-0 bg-orange-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-orange-300">
            <FiImage size={30} />
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-bold text-white shadow-md">
          Booking
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-8 pb-3 px-5">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
              booking.status
            )}`}
          >
            {booking.status?.replaceAll("_", " ")}
          </span>

          {booking.attendeeCount != null && (
            <span className="flex items-center gap-1 text-sm text-slate-600">
              <FiUsers className="text-orange-500" size={14} />
              {booking.attendeeCount}
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-slate-600">
          {booking.purpose || "—"}
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          {resource?.location && (
            <div className="flex items-center gap-2">
              <FiMapPin className="text-orange-500" size={14} />
              <span>{resource.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FiCalendar className="text-orange-500" size={14} />
            <span>{booking.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="text-orange-500" size={14} />
            <span>
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </span>
          </div>
        </div>

        {booking.status === "REJECTED" && booking.adminRemark && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-800">
            <span className="font-semibold">Remark:</span>{" "}
            {booking.adminRemark}
          </div>
        )}

        {booking.status === "APPROVED" && (
          <button
            type="button"
            onClick={handleDownloadQr}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <FiDownload size={14} />
            Download Booking Pass
          </button>
        )}

        {canManage && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <FiXCircle size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <FiEdit size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(booking.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <FiTrash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}