export default function ConfigBanner({
  label,
  configured,
}: {
  label: string;
  configured: boolean;
}) {
  if (configured) return null;
  return (
    <p className="mb-4 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-2 text-sm text-amber-900">
      ⚠️ ยังไม่ได้ตั้งค่าฐานข้อมูล{label} — หน้านี้โหลดข้อมูลไม่ได้ แจ้งผู้ดูแลระบบ
    </p>
  );
}
