export default function ConfigBanner({
  label,
  configured,
}: {
  label: string;
  configured: boolean;
}) {
  if (configured) return null;
  return (
    <p className="notice">
      ⚠️ ยังไม่ได้ตั้งค่าฐานข้อมูล{label} — หน้านี้โหลดข้อมูลไม่ได้ แจ้งผู้ดูแลระบบ
    </p>
  );
}
