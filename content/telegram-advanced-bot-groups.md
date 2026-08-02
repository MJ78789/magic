# Telegram ขั้นสูง: Bot, Groups, Topics และสิทธิ์ที่ไม่ควรตั้งแบบเดา

เมื่อ Telegram ถูกใช้เป็นหน้าควบคุมงาน ปัญหาหลักไม่ใช่การส่งข้อความ แต่คือใครสั่งอะไรได้ ในห้องไหน และ bot เห็นข้อความมากเพียงใด ระบบที่ปลอดภัยต้องแยกบัญชีผู้ใช้ กลุ่ม Topic และสิทธิ์เครื่องมือ

## Privacy Mode และกลุ่ม

Telegram bot เปิด Privacy Mode เป็นค่าเริ่มต้น ทำให้เห็นเฉพาะข้อความบางประเภทในกลุ่ม หากต้องเห็นข้อความทั้งหมด ต้องพิจารณาปิดผ่าน BotFather หรือให้ bot เป็น admin ตามความจำเป็น หลังเปลี่ยน privacy mode อาจต้องนำ bot ออกจากกลุ่มแล้วเพิ่มใหม่ อย่าปิดเพียงเพราะ bot ไม่ตอบก่อนตรวจ requireMention และ allowlist

## Topics และ Routing

กลุ่มแบบ Forum แยกงานเป็น Topics ได้ เช่น ข่าว กลยุทธ์ และงานทั่วไป กำหนดว่าแต่ละ Topic ส่งไป Agent หรือ workflow ใด และเก็บเรื่องส่วนตัวไว้ใน DM เพื่อป้องกันบริบทปะปน

## ตัวอย่างสิทธิ์เจ้าของคนเดียว

DM ใช้ allowlist ด้วย numeric user ID กลุ่มใช้ allowlist ด้วย group chat ID และ requireMention=true คำสั่ง owner-only ตรวจ user ID ซ้ำอีกชั้น งานเผยแพร่ ลบข้อมูล หรือรัน shell ต้องขอ approval แม้ผู้ส่งอยู่ใน allowlist

## Monitoring และ Incident

ตรวจ log เมื่อ bot เงียบ ดู 409 conflict หากมี polling ซ้ำ ตรวจ webhook หรือ long polling ว่าใช้เพียงวิธีเดียว และ revoke token ผ่าน BotFather หากสงสัยว่ารั่ว หลังแก้ token ต้องอัปเดต secret และ restart Gateway อย่างควบคุม

Checklist ขั้นสูงคือ numeric IDs / group allowlist / Topic routing / Privacy Mode / admin เท่าที่จำเป็น / deduplication / rate limit / audit log / token rotation / recovery test

แหล่งข้อมูลทางการ: https://docs.openclaw.ai/channels/telegram และ https://core.telegram.org/bots/api
