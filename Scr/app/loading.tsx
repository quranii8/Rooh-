export default function Loading() {
  return (
    <div className="grid place-items-center py-32">
      <div className="spinner" />
      <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
        جاري التحميل...
      </p>
    </div>
  );
}
