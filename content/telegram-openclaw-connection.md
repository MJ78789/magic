# เชื่อม Telegram กับ OpenClaw อย่างปลอดภัย: จาก BotFather ถึงข้อความแรก

การเชื่อม Telegram กับ OpenClaw ใช้ Bot Token ไม่ใช่รหัสผ่านบัญชี Telegram Bot Token เปรียบเหมือนรหัสผ่านของ bot ต้องเก็บเป็นความลับและ revoke ทันทีหากรั่ว

## ขั้นตอนหลัก

หนึ่ง เปิดแชต @BotFather และตรวจชื่อให้ตรง สั่ง /newbot ตั้งชื่อและ username แล้วรับ token สองเพิ่ม token ใน config หรือ secret ของ OpenClaw โดยไม่เขียนลงเอกสารสาธารณะ สามเปิด Telegram channel และเริ่ม Gateway สี่ส่ง DM หา bot แล้วอนุมัติ pairing code ซึ่งมีอายุจำกัด

ตัวอย่าง config เชิงแนวคิดคือ เปิด channels.telegram, ใส่ botToken ผ่าน secret, ตั้ง dmPolicy เป็น pairing และให้ group ต้อง mention bot ก่อนทำงาน ค่าจริงต้องตรวจจากเอกสารเวอร์ชันที่ติดตั้ง

## ทดสอบก่อนใช้จริง

ส่ง “ping” ใน DM ตรวจว่า session ถูกสร้างและ bot ตอบจาก Agent ที่ตั้งใจ จากนั้นลองข้อความที่ไม่ควรอนุญาต เช่น ผู้ใช้ที่ยังไม่ pair ต้องไม่เข้าถึงเครื่องมือ

## กลุ่มและสิทธิ์

หากเพิ่ม bot เข้ากลุ่ม ให้ระบุ group chat ID และ user ID ใน allowlist ให้ถูกชนิด ID กลุ่ม supergroup มักเป็นเลขติดลบขึ้นต้น -100 ส่วน user ID เป็นเลขผู้ใช้ อย่าใส่ group ID ในรายการผู้ใช้

Checklist คือ token ไม่อยู่ใน Git / DM ใช้ pairing หรือ allowlist / กลุ่มต้องอนุญาตชัด / requireMention ตามบริบท / เครื่องมือเสี่ยงต้อง approval / log ไม่แสดง token / มีวิธี revoke

แหล่งข้อมูลทางการ: https://docs.openclaw.ai/channels/telegram และ https://core.telegram.org/bots/tutorial
