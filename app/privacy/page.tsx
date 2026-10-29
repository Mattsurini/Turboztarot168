import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">นโยบายความเป็นส่วนตัว</h1>
      <div className="mt-6 space-y-6 leading-relaxed text-foreground/80">
        <div>
          <h2 className="text-lg font-bold">1. ข้อมูลที่เราเก็บ</h2>
          <p className="mt-2">
            เว็บไซต์นี้ไม่ได้เก็บข้อมูลส่วนตัวของคุณบนเว็บไซต์ การจองคิวดูดวงจะเกิดขึ้นผ่าน LINE
            และข้อมูลที่คุณส่ง (ชื่อเล่น บริการ วันที่ และเวลา) จะถูกเก็บไว้เพื่อการนัดหมายเท่านั้น
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold">2. ข้อมูลคิวและปฏิทิน</h2>
          <p className="mt-2">
            หน้าแรกแสดงเฉพาะช่วงเวลาที่เปิดรับคิวและยังว่างเท่านั้น
            เราไม่เปิดเผยชื่อ รายละเอียดกิจกรรม หรือข้อมูลส่วนตัวของลูกดวงรายอื่น
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold">3. ข้อมูลการสนทนาบน LINE</h2>
          <p className="mt-2">
            การสนทนาบน LINE เป็นความลับระหว่างคุณกับพี่หมอ และจะถูกใช้เพื่อการนัดหมายและให้บริการเท่านั้น
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold">4. ข้อจำกัด</h2>
          <p className="mt-2">
            การดูดวงเป็นการให้แนวทางและความบันเทิง ไม่ใช่การรับประกันผลลัพธ์ใด ๆ
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold">5. ติดต่อ</h2>
          <p className="mt-2">
            หากมีคำถามเกี่ยวกับความเป็นส่วนตัว สามารถติดต่อผ่าน LINE Official Account ของเรา
          </p>
        </div>
      </div>
    </section>
  );
}
