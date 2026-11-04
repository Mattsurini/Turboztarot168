import Link from "next/link";
import { lineOaUrl, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="halo"></div>
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <Link className="wordmark" href="/">
              <b>Turboz</b>
              <i>tarot</i>
              <b>168</b>
            </Link>
            <p className="footer__about">{SITE.description}</p>
          </div>
          <div>
            <h4>เมนู</h4>
            <ul>
              <li><Link className="foot" href="/services">บริการดูดวง</Link></li>
              <li><Link className="foot" href="/articles">บทความ</Link></li>
              <li><Link className="foot" href="/queue">คิวดูดวง</Link></li>
              <li><Link className="foot" href="/terms">ข้อตกลง</Link></li>
              <li><Link className="foot" href="/privacy">นโยบายความเป็นส่วนตัว</Link></li>
            </ul>
          </div>
          <div>
            <h4>จองคิวดูดวงผ่าน LINE</h4>
            <a
              className="btn btn--line"
              href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}
            >
              LINE Official Account
            </a>
          </div>
        </div>
      </div>
      <p className="footer__base">
        © {new Date().getFullYear()} {SITE.name}: ดูดวงเพื่อความบันเทิงและแนวทาง
      </p>
    </footer>
  );
}
