# OpenClaw ขั้นสูง: Multi-Agent, Automation และ Security ที่ต้องออกแบบพร้อมกัน

OpenClaw ขั้นสูงไม่ใช่การเพิ่ม Agent ให้มากที่สุด แต่คือการให้แต่ละ Agent รับผิดชอบชัด มีผู้ประสานงานตรวจผล และจำกัดสิทธิ์ตามความจำเป็น ระบบต้องทำงานต่อได้เมื่อบริการหนึ่งล้มเหลว และต้องอธิบายย้อนหลังได้ว่าใครทำอะไร

## สถาปัตยกรรมตัวอย่าง

Main Agent รับคำขอ แยกเป็นงานวิจัย งานสร้างสรรค์ และงานสำนักงาน Specialist รับเฉพาะข้อมูลที่จำเป็น ส่งผลกลับ Main ตรวจ Accuracy, Completeness, Safety และ Usability ก่อนส่งผู้ใช้ งานที่ส่งอีเมล เผยแพร่ แก้ config ลบข้อมูล หรือมีค่าใช้จ่ายต้องมี Approval Gate

## Automation ที่ปลอดภัย

กำหนด owner, schedule, timezone, timeout, retry, idempotency และ delivery ให้ครบ งานที่รันซ้ำต้องไม่ส่งข้อความหรือทำรายการซ้ำโดยไม่ตั้งใจ แยก secret ออกจากไฟล์เนื้อหา จำกัด log ไม่ให้เก็บ token และมี kill switch ปิด job ได้

## ตัวอย่างสถานการณ์ผิดพลาด

หากแหล่งข้อมูลตลาดไม่ตอบ ระบบไม่ควรสร้างตัวเลขแทน ให้ใช้แหล่งสำรองที่อนุมัติหรือส่งสถานะ “ข้อมูลไม่พร้อม” หาก Agent ไม่ตอบตาม SLA ผู้ประสานงานต้องตรวจ session และแจ้งผู้ใช้ ไม่อ้างว่างานเสร็จ

## Checklist ขั้นสูง

สิทธิ์ต่ำสุด / allowlist / pairing / secret rotation / audit log / backup / monitoring / retry limit / deduplication / human review / incident response / ทดสอบ recovery

เริ่มจาก workflow เดียวที่วัดผลได้ ทำ simulation failure อย่างน้อยสองแบบ แล้วจึงเพิ่ม Agent หรือ schedule อย่าขยายระบบก่อนรู้ว่าขั้นใดเป็นคอขวดจริง

แหล่งข้อมูลทางการ: https://docs.openclaw.ai และเอกสาร Gateway, Automation, Security และ Multi-Agent ในชุดเอกสาร OpenClaw
