# MagicSuccess Thailand — Website Improvement Backlog

> เอกสารนี้ใช้เก็บรายการปรับปรุงก่อนพัฒนาจริง ยังไม่ถือว่าเริ่ม Implementation หรือ Deployment

## WEB-001 — Google Sign-In และ Admin Console

- **สถานะ:** Backlog / รอรวมงานเพื่อพัฒนาครั้งเดียว
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ผู้ร้องขอ:** Jack
- **ลำดับความสำคัญ:** High
- **ขอบเขตปัจจุบัน:** Requirements และ Data Design เท่านั้น

### เป้าหมาย

1. เพิ่มการลงชื่อเข้าใช้ด้วย Google Account
2. หากอีเมลที่ยืนยันแล้วตรงกับ `sakunchinnasee@gmail.com` ให้แสดงเมนู **ผู้ดูแลเว็บไซต์**
3. ผู้ใช้ทั่วไปที่ลงชื่อเข้าใช้แล้วต้องไม่เห็นหรือเข้าถึงข้อมูลผู้ดูแล
4. Admin Console ใช้ติดตามการใช้งาน สุขภาพเนื้อหา งานปรับปรุง และประวัติการเปลี่ยนแปลงเว็บไซต์

### ข้อกำหนดด้านสิทธิ์และความปลอดภัย

- ใช้ Google OAuth/OpenID Connect และตรวจสอบ token ฝั่ง Server
- ตรวจสิทธิ์ Admin ฝั่ง Server ทุกครั้ง ห้ามอาศัยการซ่อนเมนูด้วย JavaScript เพียงอย่างเดียว
- ใช้ allowlist ของอีเมล Admin โดยเก็บใน Environment Variable หรือฐานข้อมูล ไม่ฝังสิทธิ์ลับไว้ใน Frontend
- อนุญาต Admin เมื่อ Google ยืนยันอีเมลแล้ว (`email_verified=true`) และอีเมลตรงแบบ exact match
- Session ต้องมีอายุ จำกัด cookie เป็น `HttpOnly`, `Secure`, `SameSite` และรองรับการออกจากระบบ
- บันทึก Audit Log สำหรับการกระทำของ Admin
- ไม่เก็บข้อมูลส่วนบุคคลเกินความจำเป็น และกำหนดระยะเวลาการเก็บข้อมูล
- หน้าและ API ของ Admin ต้องไม่ถูก index โดย Search Engine
- การเปลี่ยนแปลงข้อมูลสำคัญควรมี Confirmation และป้องกัน CSRF/replay ตามรูปแบบระบบที่เลือก

### ข้อมูลที่ควรแสดงใน Admin Dashboard

#### 1. Executive Overview

- ผู้ใช้งานวันนี้, 7 วัน, 30 วัน
- Sessions และ Page Views
- ผู้ใช้ใหม่เทียบกับผู้ใช้กลับมา
- Average Engagement Time
- Engagement Rate หรือ Bounce/Exit indicator
- จำนวนหน้าที่เปิดต่อ Session
- แนวโน้มเทียบช่วงก่อนหน้า เช่น 7 วันล่าสุดเทียบ 7 วันก่อน
- วันที่และเวลาที่ข้อมูล Analytics อัปเดตล่าสุด

#### 2. Content Performance

- หน้าที่มีผู้เข้าชมสูงสุด
- บทความที่มีผู้เข้าชมสูงสุด
- วิดีโอ/Podcast/Shorts ที่ถูกเปิดดูหรือคลิกมากที่สุด
- Landing Page ยอดนิยม
- Exit Page สูงสุด
- เวลาเฉลี่ยบนแต่ละหน้า
- Scroll Depth เช่น 25%, 50%, 75%, 90%
- CTA clicks เช่น YouTube, Facebook, อ่านบทความต่อ, เปิด Playlist
- Search terms ภายในเว็บไซต์ หากเพิ่มระบบค้นหา
- เนื้อหาที่ไม่มีผู้เข้าชมหรือมี Engagement ต่ำ เพื่อใช้พิจารณาปรับปรุง

#### 3. Audience and Acquisition

- แหล่งที่มาของผู้ใช้: Direct, Organic Search, Social, Referral, Campaign
- UTM Campaign/Source/Medium
- ประเทศ/เมืองในระดับที่ไม่ระบุตัวบุคคล
- ภาษา
- Device: Mobile, Desktop, Tablet
- Browser และ Operating System
- ช่วงวันและเวลาที่มีผู้ใช้มากที่สุด
- Google Sign-In: จำนวนบัญชีที่สมัคร, Active users, Last sign-in โดยแสดงเท่าที่จำเป็น

#### 4. Search and SEO Health

- Organic clicks, impressions, CTR และ average position หากเชื่อม Google Search Console
- Search query และ Landing Page ที่นำผู้ใช้เข้าเว็บไซต์
- หน้าที่ไม่มี title/description/canonical ที่ถูกต้อง
- Broken links และหน้า 404
- Sitemap/robots status
- Core Web Vitals และ Lighthouse summary
- หน้าโหลดช้าและ asset ที่มีขนาดใหญ่ผิดปกติ

#### 5. Website Reliability

- Uptime และเหตุการณ์ที่เว็บไซต์เข้าถึงไม่ได้
- Client-side JavaScript errors
- API/Server errors แยกตาม endpoint
- Login failures และ OAuth callback errors
- Build/Deployment ล่าสุด: เวลา, version/commit, ผู้ดำเนินการ และผลสำเร็จ/ล้มเหลว
- YouTube sync ล่าสุด: เวลา, จำนวนรายการ และ error
- Article build ล่าสุด: เวลา, จำนวนบทความ และ error

#### 6. Improvement Backlog

- รหัสงาน
- ชื่องานและรายละเอียด
- หมวด: Feature, Content, SEO, Performance, Security, Bug, Analytics
- Priority: Critical, High, Medium, Low
- สถานะ: Backlog, Approved, In Progress, Review, Done, Rejected
- วันที่บันทึก ผู้ร้องขอ ผู้รับผิดชอบ และ Due date
- Effort estimate และ Dependency
- Acceptance criteria
- หมายเหตุและไฟล์/หน้าที่เกี่ยวข้อง
- ลิงก์ไป Change Log เมื่อดำเนินการเสร็จ

#### 7. Change Log / Release History

- Version หรือ Release ID
- วันที่และเวลาที่เปลี่ยนแปลง
- สรุปสิ่งที่เพิ่ม แก้ไข หรือลบ
- หน้าหรือไฟล์ที่ได้รับผลกระทบ
- ผู้อนุมัติและผู้ดำเนินการ
- Commit/Deployment reference
- ผลการตรวจสอบและ Test summary
- Rollback reference หากมี

#### 8. System Records / Saved Items

- รายการที่ผู้ใช้หรือ Admin บันทึกไว้ในระบบ
- ประเภทรายการ เช่น Bookmark, Draft, Improvement request, Content idea, Admin note
- เจ้าของรายการ
- วันที่สร้างและแก้ไขล่าสุด
- สถานะและ Tag
- ประวัติการแก้ไข
- Export/Search/Filter ตามสิทธิ์
- Retention และ Delete policy ของแต่ละประเภทข้อมูล

#### 9. Security and Audit

- Successful/failed Admin sign-ins
- การเปลี่ยนสิทธิ์หรือการตั้งค่าระบบ
- การสร้าง แก้ไข ลบ หรือ Export ข้อมูล
- IP/device information เฉพาะระดับที่จำเป็นและสอดคล้องกับ Privacy Policy
- เหตุการณ์ผิดปกติ เช่น login failure ซ้ำหรือการเรียก Admin API โดยไม่มีสิทธิ์
- Audit Log ควรแก้ไขย้อนหลังไม่ได้โดยผู้ใช้ทั่วไป

### โครงสร้างเมนู Admin ที่แนะนำ

1. ภาพรวม
2. Analytics
3. เนื้อหา
4. SEO & Performance
5. งานปรับปรุง
6. Change Log
7. รายการที่บันทึก
8. System Health
9. Security & Audit
10. Settings

### Events ที่ควรวางแผนเก็บ

- `page_view`
- `session_start`
- `sign_in` / `sign_out`
- `article_open`
- `article_complete`
- `video_open`
- `youtube_click`
- `social_click`
- `cta_click`
- `scroll_depth`
- `search`
- `share`
- `admin_login`
- `admin_action`
- `improvement_created`
- `improvement_status_changed`
- `saved_item_created`
- `saved_item_updated`

ทุก Event ควรมี schema ชัดเจน หลีกเลี่ยงการส่งอีเมลหรือข้อมูลส่วนบุคคลไปยังระบบ Analytics โดยไม่จำเป็น

### ผลกระทบต่อสถาปัตยกรรมปัจจุบัน

เว็บไซต์ปัจจุบันเป็น Static HTML/CSS/JavaScript และยังไม่มี Backend, Database, Authentication หรือ Analytics Provider งานนี้จึงต้องเพิ่มองค์ประกอบอย่างน้อย:

- Google OAuth client และ consent configuration
- Backend/API สำหรับ session และ authorization
- Database สำหรับผู้ใช้ Backlog Change Log Saved Items และ Audit Log
- Analytics collection/reporting
- Admin routes และ server-side access control
- Privacy/Cookie disclosure ตามข้อมูลที่เก็บจริง

### แนวทางแบ่งระยะเมื่อเริ่มพัฒนา

#### Phase 1 — Foundation

- เลือก Backend/Database/Analytics stack
- ออกแบบ schema และ Privacy policy
- Google Sign-In
- Server-side Admin authorization

#### Phase 2 — Admin MVP

- Overview
- Page/content analytics
- Improvement Backlog
- Change Log
- Saved Items

#### Phase 3 — Operations and Growth

- SEO/Search Console
- Performance and error monitoring
- System Health
- Security/Audit dashboard
- Export, filters และ scheduled reports

### Acceptance Criteria เบื้องต้น

- ผู้ใช้ทั่วไปลงชื่อเข้าใช้ได้ แต่ไม่เห็นและเรียก Admin route/API ไม่ได้
- เฉพาะบัญชี Admin ที่ยืนยันแล้วเข้าถึง Admin Console ได้
- Dashboard แสดงช่วงเวลาและเวลาอัปเดตของข้อมูลชัดเจน
- Top pages และ content performance ตรวจสอบย้อนกลับได้
- Backlog, Change Log และ Saved Items มี Search/Filter/History
- Admin actions สำคัญมี Audit Log
- ไม่มี secret หรือ authorization logic สำคัญอยู่ใน Frontend bundle
- มี Privacy disclosure ตามข้อมูลที่เก็บจริง

### ประเด็นที่ต้องตัดสินใจก่อนเริ่ม Implementation

- Backend/Hosting ที่จะใช้
- Database ที่จะใช้
- Analytics provider และ consent model
- ขอบเขตข้อมูลของผู้ใช้ทั่วไปหลัง Sign-In
- ความหมายและประเภทของ “รายการที่บันทึกในระบบ”
- ผู้ดูแลมีบัญชีเดียวหรือรองรับหลายบัญชีในอนาคต
- ระยะเวลาการเก็บ Analytics, Saved Items และ Audit Logs

---

## WEB-002 — FAQs & Prompt Library

- **สถานะ:** Backlog / รอรวมงานเพื่อพัฒนาครั้งเดียว
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ผู้ร้องขอ:** Jack
- **ลำดับความสำคัญ:** High
- **ขอบเขตปัจจุบัน:** Information Architecture และ Content Requirements เท่านั้น

### เป้าหมาย

1. เพิ่มเมนู **FAQs** บนเว็บไซต์
2. จัดกลุ่มคำถาม–คำตอบตามเรื่อง เพื่อให้ค้นหาและเรียนรู้ได้ง่าย
3. เพิ่มตัวอย่าง Prompt ที่นำไปใช้งานจริงได้ โดยมีโครงสร้างมาตรฐาน
4. จัดทำคำถาม–คำตอบเชิงลึก 6 หมวด หมวดละ 30 ข้อ รวม **180 FAQs**
5. รองรับการเพิ่ม แก้ไข จัดลำดับ และบันทึกประวัติเนื้อหาผ่านระบบผู้ดูแลในอนาคต

### กลุ่มเนื้อหาหลักของเมนู FAQs

- AI Technology
- AI Tools
- Trip ทั่วไทย
- ช่องทางรายได้

กลุ่มเนื้อหาหลักใช้เป็น Navigation/Topic Hub ส่วนชุด FAQ เชิงลึกด้านล่างสามารถเชื่อมเข้า Topic ที่เกี่ยวข้องและค้นหารวมกันได้

### ชุด FAQ เชิงลึกที่ต้องจัดทำ

| รหัส | หมวด | จำนวนขั้นต่ำ |
|---|---|---:|
| FAQ-MKT | Marketing for Sales | 30 |
| FAQ-FIN | Financial | 30 |
| FAQ-YT | YouTube | 30 |
| FAQ-FB | Facebook | 30 |
| FAQ-WEB | Website | 30 |
| FAQ-PPRM | PPRM / Risk Management ของ กฟผ. | 30 |
|  | **รวม** | **180** |

### Prompt Framework มาตรฐาน

ตัวอย่าง Prompt ทุกชุดควรมีองค์ประกอบต่อไปนี้:

1. **Role — บทบาทของ AI**
2. **Action/Task — ภารกิจหลัก**
3. **Context/Input — บริบทหรือข้อมูลเข้า**
4. **Format — รูปแบบผลลัพธ์**
5. **Constraints/Tone — ข้อจำกัด โทน และสิ่งที่ห้ามทำ**

#### ตัวอย่าง

> คุณคือผู้ช่วยการเงินที่ระมัดระวัง ช่วยอ่านตารางยอดขายด้านล่าง แล้วสรุปส่วนต่างจากเป้า พร้อมคำอธิบายที่เป็นไปได้ แสดงผลเป็นตารางสั้นและข้อสังเกต ระบุว่าเป็นการวิเคราะห์เบื้องต้นที่มนุษย์ต้องตรวจสอบ และห้ามแต่งตัวเลขหรือเติมข้อมูลที่ไม่มีในแหล่งข้อมูล

### โครงสร้างข้อมูล FAQ ที่แนะนำ

FAQ แต่ละรายการควรมี:

- รหัส FAQ
- คำถาม
- คำตอบสั้น
- คำอธิบายเพิ่มเติม
- Topic หลักและหมวดย่อย
- Tags/Keywords
- ระดับ: Beginner, Intermediate, Advanced
- ตัวอย่าง Prompt
- ตัวอย่างการใช้งาน
- ข้อควรระวังหรือข้อจำกัด
- แหล่งอ้างอิงและวันที่ตรวจสอบข้อมูล
- สถานะ: Draft, Review, Published, Archived
- ผู้เขียน ผู้ตรวจ และวันที่อัปเดตล่าสุด
- Related FAQs

### รูปแบบคำตอบที่ควรใช้

- เริ่มด้วยคำตอบตรงประเด็น
- ใช้ภาษาที่ผู้เริ่มต้นเข้าใจได้
- แยกข้อเท็จจริง คำแนะนำ ตัวอย่าง และข้อจำกัดออกจากกัน
- ห้ามแต่งตัวเลข ข้อกำหนด หรือชื่อระบบ
- เรื่องการเงินให้ระบุว่าเป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการเงินเฉพาะบุคคล
- เรื่ององค์กร/กฎระเบียบให้ระบุแหล่งอ้างอิงและวันที่ตรวจสอบ
- เรื่อง AI Tools ให้แจ้งว่าความสามารถ ราคา และข้อจำกัดอาจเปลี่ยนแปลง
- เรื่องท่องเที่ยวให้ระบุวันที่ตรวจสอบข้อมูล เวลาเปิด และข้อจำกัดตามฤดูกาลเมื่อเกี่ยวข้อง

### ข้อกำหนดเฉพาะแต่ละหมวด

#### Marketing for Sales — 30 FAQs

- Customer persona และ pain points
- Value proposition
- Marketing funnel และ customer journey
- Lead generation/qualification
- Sales script และ objection handling
- Campaign planning
- KPI เช่น conversion rate, CAC, ROAS และ retention
- การใช้ AI วิเคราะห์ยอดขายโดยไม่แต่งข้อมูล
- Prompt สำหรับสรุปยอดขาย แคมเปญ และข้อเสนอแนะ

#### Financial — 30 FAQs

- รายรับ รายจ่าย กระแสเงินสด กำไร และงบประมาณ
- การอ่านตารางหรือรายงานการเงินเบื้องต้น
- การเทียบ Actual กับ Target/Budget
- Variance analysis
- Forecast และ Scenario แบบระบุสมมติฐาน
- Financial risk และข้อจำกัดของการวิเคราะห์ด้วย AI
- Prompt ที่บังคับไม่ให้แต่งตัวเลข และต้องแสดงวิธีคำนวณ
- Disclaimer ว่ามนุษย์ต้องตรวจสอบก่อนตัดสินใจ

#### YouTube — 30 FAQs

- การวางช่องและกลุ่มผู้ชม
- Topic, hook, title, thumbnail และ retention
- Shorts, Videos และ Podcasts
- Script, storyboard, production และ publishing checklist
- SEO, playlist, analytics และ content iteration
- Copyright, reused content และ disclosure
- Prompt สำหรับคิดหัวข้อ เขียนบท และวิเคราะห์ผลงาน

#### Facebook — 30 FAQs

- Page positioning และ content pillars
- Post, Reels, Video, Story และ Live
- Caption, hook, CTA และ hashtag
- Engagement, reach, watch time และ conversion
- Content calendar และ community management
- Ads เบื้องต้นและการอ่านผลลัพธ์
- Copyright, privacy และ platform policy
- Prompt สำหรับสร้างโพสต์และวิเคราะห์ Insight

#### Website — 30 FAQs

- Domain, hosting, HTTPS และ deployment
- UX/UI, responsive design และ accessibility
- SEO, sitemap, robots, metadata และ structured data
- Performance และ Core Web Vitals
- Analytics, conversion และ content performance
- Authentication, privacy, security และ backup
- Maintenance, testing, change log และ incident response
- Prompt สำหรับ audit หน้าเว็บ วางเนื้อหา และเขียน acceptance criteria

#### PPRM / Risk Management ของ กฟผ. — 30 FAQs

- นิยาม Risk Management
- Risk Inventory
- Risk identification และ risk statement
- Cause, event, impact
- Likelihood, impact และ risk level
- Risk appetite/tolerance ตามเอกสารที่ได้รับอนุญาต
- Key Risk Indicator (KRI)
- Risk Treatment Plan
- Control, owner, due date และผลการดำเนินงาน
- Residual risk
- Monitoring, reporting และ evidence
- ตัวอย่าง Prompt สำหรับช่วยตรวจความครบถ้วนโดยไม่สร้างข้อมูลแทนเจ้าของความเสี่ยง

> **ข้อควรระวังเรื่องคำว่า PPRM:** ยังไม่กำหนดคำเต็มอย่างเป็นทางการบนเว็บไซต์จนกว่าจะตรวจสอบจากคู่มือ เอกสาร หรือผู้ดูแลระบบ PPRM ของ กฟผ. โดยตรง คำว่า “Policy and Planning Risk Management” ให้ถือเป็นสมมติฐานที่ยังไม่ยืนยัน ไม่ควรเผยแพร่เป็นข้อเท็จจริง

### ฟังก์ชันหน้า FAQs ที่แนะนำ

- Search แบบ full-text
- Filter ตาม Topic, Tag และระดับความยาก
- Accordion สำหรับเปิด–ปิดคำตอบ
- Copy Prompt
- Related FAQs
- Share link เฉพาะคำถาม
- Deep link ด้วย URL slug
- แสดงวันที่อัปเดตและแหล่งอ้างอิง
- ปุ่มแจ้งข้อมูลผิดหรือเสนอคำถามใหม่
- FAQ view count, search term และ helpful/not helpful feedback
- รองรับ Schema.org `FAQPage` เฉพาะเนื้อหาที่เข้าเงื่อนไขและแสดงบนหน้าอย่างถูกต้อง

### ข้อมูลที่ควรแสดงใน Admin Console

- จำนวน FAQ ทั้งหมด แยก Draft/Review/Published/Archived
- หมวดที่มีผู้เข้าชมสูงสุด
- คำถามที่เปิดอ่านสูงสุด
- Prompt ที่ถูก Copy มากที่สุด
- Search terms ที่ผู้ใช้ค้นหา
- Search ที่ไม่พบคำตอบ เพื่อสร้าง FAQ ใหม่
- Helpful/Not helpful score
- FAQ ที่ไม่ได้อัปเดตเกินระยะเวลาที่กำหนด
- FAQ ที่ไม่มีแหล่งอ้างอิงหรือรอตรวจสอบ
- Content owner และ review due date
- Change history ของคำถามและคำตอบแต่ละรายการ

### Acceptance Criteria เบื้องต้น

- เมนู FAQs เข้าถึงได้ทั้ง Desktop และ Mobile
- ผู้ใช้ค้นหาและกรอง FAQ ได้
- FAQ เชิงลึกครบ 6 หมวด หมวดละอย่างน้อย 30 ข้อ
- Prompt ทุกตัวมี Role, Task, Context, Format และ Constraints
- เนื้อหาการเงินและองค์กรมีข้อจำกัด/คำเตือนที่เหมาะสม
- คำเต็ม PPRM ต้องผ่านการยืนยันจากแหล่งทางการก่อนเผยแพร่
- Admin จัดการสถานะ ลำดับ หมวด Tag และประวัติการแก้ไขได้
- Analytics แสดง FAQ ยอดนิยม Prompt copies Search terms และ content gaps ได้
- หน้า FAQ รองรับ SEO, Accessibility และ Deep link

### ประเด็นที่ต้องตัดสินใจก่อนเริ่ม Implementation

- จะเผยแพร่ครบ 180 ข้อพร้อมกันหรือทยอยเป็น Batch
- ผู้รับผิดชอบตรวจเนื้อหาแต่ละหมวด
- แหล่งอ้างอิงทางการสำหรับ PPRM/Risk Management
- ขอบเขต Financial FAQ ว่าเน้นการเงินส่วนบุคคล ธุรกิจ หรือทั้งสองด้าน
- Taxonomy ระหว่าง Topic Hub 4 กลุ่มกับ FAQ เชิงลึก 6 หมวด
- วิธีจัดเก็บ: Markdown/JSON หรือ Database ผ่าน Admin Console
- Analytics และ Feedback provider ที่จะใช้

---

## WEB-003 — Product Recommendations & Shopee Affiliate Revenue

- **สถานะ:** Backlog / รอรวมงานเพื่อพัฒนาครั้งเดียว
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ผู้ร้องขอ:** Jack
- **ลำดับความสำคัญ:** High
- **ขอบเขตปัจจุบัน:** Business Requirements, Content Model และ Compliance เท่านั้น

### เป้าหมาย

1. เพิ่มเมนู **แนะนำสินค้า** บนเว็บไซต์
2. แนะนำสินค้าจาก Shopee โดยแบ่งหมวดหมู่ชัดเจน
3. สร้างรายได้ผ่าน Shopee Affiliate หรือช่องทางที่ได้รับอนุมัติ
4. ช่วยผู้ใช้เลือกสินค้าโดยให้ข้อมูลที่เป็นประโยชน์ โปร่งใส และไม่กล่าวอ้างเกินจริง
5. เชื่อมข้อมูลยอดคลิก Conversion และรายได้เข้าสู่ Admin Console ในอนาคต

### หมวดสินค้า

#### 1. ไอทีและเทคโนโลยี

- คอมพิวเตอร์ โน้ตบุ๊ก แท็บเล็ต และสมาร์ตโฟน
- อุปกรณ์เสริม เช่น Keyboard, Mouse, Monitor, Storage และ Hub
- Network, Smart Home และอุปกรณ์สำนักงาน
- กล้อง ไมโครโฟน ไฟ และอุปกรณ์สร้างคอนเทนต์

#### 2. AI และการเรียนรู้

- อุปกรณ์สำหรับเรียนออนไลน์และทำงานกับ AI
- หนังสือ คู่มือ และสื่อการเรียนรู้
- อุปกรณ์จดบันทึก นำเสนอ และเรียนภาษา
- อุปกรณ์สำหรับ Coding, Robotics และ STEM
- สินค้าประกอบการสร้างคอนเทนต์หรือทดลอง AI โดยต้องไม่ทำให้เข้าใจผิดว่าเป็นบริการ AI หากเป็นเพียง Hardware/Accessory

#### 3. สุขภาพและยา

- แยกหมวดย่อยเป็น **สินค้าสุขภาพทั่วไป**, **อุปกรณ์สุขภาพ**, **อาหารเสริม** และ **ยา/ผลิตภัณฑ์ที่อยู่ภายใต้ข้อกำกับ**
- ให้ความสำคัญกับข้อมูลฉลาก เลขทะเบียน/อย. ผู้ผลิต วิธีใช้ และข้อควรระวัง
- ไม่วินิจฉัยโรค ไม่สั่งยา และไม่เสนอให้ใช้แทนคำแนะนำของแพทย์หรือเภสัชกร
- ห้ามกล่าวอ้างว่ารักษา ป้องกัน หรือรับประกันผล หากไม่มีหลักฐานและไม่ได้รับอนุญาตตามกฎหมาย
- ยาและผลิตภัณฑ์ควบคุมต้องผ่านการตรวจสอบว่าสามารถโฆษณาและขายผ่านช่องทางดังกล่าวได้ก่อนเผยแพร่
- ควรพิจารณาเริ่มจากสินค้าสุขภาพทั่วไปและอุปกรณ์ที่มีความเสี่ยงต่ำก่อน ส่วน “ยา” ให้เป็น Phase หลังจากตรวจข้อกฎหมายและนโยบายแพลตฟอร์ม

#### 4. ของใช้ในบ้าน

- เครื่องใช้ไฟฟ้าและอุปกรณ์ครัว
- อุปกรณ์ทำความสะอาดและจัดเก็บ
- ของใช้ประจำวัน
- อุปกรณ์ประหยัดพลังงานและ Smart Home
- สินค้าเพื่อความปลอดภัยและความสะดวกในบ้าน

### รูปแบบหน้าแนะนำสินค้า

- หน้ารวมหมวดสินค้า
- หน้ารายการสินค้า พร้อม Search, Filter และ Sort
- Product Card: รูป ชื่อ จุดเด่น ช่วงราคา คะแนน/รีวิว และปุ่มดูสินค้า
- หน้ารายละเอียดหรือบทความรีวิว/เปรียบเทียบ
- ส่วน “เหมาะกับใคร” และ “อาจไม่เหมาะกับใคร”
- ข้อดี ข้อจำกัด และสิ่งที่ต้องตรวจสอบก่อนซื้อ
- วันที่ตรวจสอบข้อมูลล่าสุด
- Affiliate disclosure ใกล้ปุ่มหรือลิงก์ที่สร้างรายได้
- Related products และบทความที่เกี่ยวข้อง
- รองรับ Mobile และ Accessibility

### หลักเกณฑ์คัดเลือกสินค้า

- เกี่ยวข้องกับกลุ่มผู้อ่านและเนื้อหาของ MagicSuccess Thailand
- ร้านค้าและสินค้ามีข้อมูลชัดเจน
- คะแนน รีวิว และจำนวนคำสั่งซื้ออยู่ในระดับเหมาะสม โดยไม่ใช้เป็นหลักฐานคุณภาพเพียงอย่างเดียว
- ราคาและคุณสมบัติสมเหตุสมผลเมื่อเทียบกับทางเลือก
- ตรวจสอบความถูกต้องของรายละเอียดจากหน้าสินค้าล่าสุด
- หลีกเลี่ยงสินค้าปลอม ละเมิดลิขสิทธิ์ อันตราย ผิดกฎหมาย หรือผิดนโยบายแพลตฟอร์ม
- การได้รับค่าคอมมิชชันต้องไม่ทำให้คำแนะนำเอนเอียงหรือปกปิดข้อจำกัด

### Affiliate Disclosure

หน้าและลิงก์ที่สร้างรายได้ต้องแสดงข้อความชัดเจน เช่น:

> เว็บไซต์อาจได้รับค่าคอมมิชชันจากลิงก์แนะนำสินค้า โดยผู้ซื้อไม่เสียค่าใช้จ่ายเพิ่ม การคัดเลือกสินค้าพิจารณาจากความเหมาะสมและข้อมูลที่ตรวจสอบได้ ไม่ใช่ค่าคอมมิชชันเพียงอย่างเดียว

ข้อความจริงต้องปรับให้สอดคล้องกับเงื่อนไข Shopee Affiliate และกฎหมาย/แนวทางโฆษณาที่ใช้บังคับ ณ วันที่เผยแพร่

### โครงสร้างข้อมูลสินค้า

- Product ID ภายในระบบ
- ชื่อสินค้าและ Slug
- หมวดหลักและหมวดย่อย
- รูปภาพและ Alt text
- คำอธิบายสั้น
- จุดเด่น
- ข้อจำกัด/ข้อควรระวัง
- เหมาะกับใคร/ไม่เหมาะกับใคร
- ช่วงราคาและสกุลเงิน
- Shopee URL และ Affiliate URL
- Shop name และ Shop status หากตรวจสอบได้
- Rating, review count และ sold count พร้อมวันที่ดึงข้อมูล
- Availability/Stock status
- Tags
- วันที่ตรวจสอบล่าสุดและผู้ตรวจ
- สถานะ: Draft, Review, Published, Paused, Archived
- Affiliate disclosure version
- Related content/products

### Analytics Events ที่ควรเก็บ

- `product_impression`
- `product_open`
- `affiliate_click`
- `category_view`
- `product_search`
- `product_filter`
- `comparison_view`
- `out_of_stock_report`
- `product_feedback`

หาก Shopee Affiliate มีรายงาน Conversion/Order/Commission ให้เชื่อมข้อมูลแบบ Aggregate โดยไม่เก็บข้อมูลผู้ซื้อเกินความจำเป็น

### ข้อมูลใน Admin Console

- จำนวนสินค้าแยกตามหมวดและสถานะ
- Product views และ Affiliate clicks
- Click-through rate (CTR)
- Conversion, Orders และ Commission หากมีข้อมูลจาก Affiliate Platform
- รายได้รายวัน/สัปดาห์/เดือน และเทียบช่วงก่อนหน้า
- สินค้าที่มี Click/Conversion/Revenue สูงสุด
- สินค้าที่มีผู้เข้าชมแต่ไม่มี Click หรือ Conversion
- หมวดสินค้าที่ทำรายได้สูงสุด
- Top landing pages และแหล่งที่มาของผู้ใช้
- ลิงก์เสีย สินค้าหมด สินค้าหาย หรือราคาเปลี่ยนผิดปกติ
- สินค้าที่เกินรอบตรวจสอบข้อมูล
- สินค้าสุขภาพ/ยาที่รอ Compliance Review
- Disclosure status และผู้ตรวจล่าสุด
- Change history ของข้อมูลสินค้าและลิงก์ Affiliate

### SEO และ Content Strategy

- หน้าหมวดสินค้า
- บทความ “วิธีเลือก”
- บทความเปรียบเทียบสินค้า
- บทความแนะนำตามงบประมาณหรือ Use Case
- FAQ ที่เชื่อมกับสินค้า
- Structured data ใช้ตามประเภทเนื้อหาและหลักเกณฑ์ Search Engine โดยไม่ใส่ rating/review ที่เว็บไซต์ไม่ได้เก็บหรือแสดงจริง
- หลีกเลี่ยงหน้า Thin Content ที่มีเพียงลิงก์ขายสินค้า
- ทุกหน้าต้องให้คุณค่าด้านข้อมูลก่อนการขาย

### Acceptance Criteria เบื้องต้น

- มีเมนูแนะนำสินค้าและ 4 หมวดหลัก
- ผู้ใช้ Search, Filter และ Sort สินค้าได้
- Affiliate link มี Disclosure ชัดเจน
- ข้อมูลราคา คะแนน รีวิว และสถานะสินค้ามีวันที่ตรวจสอบล่าสุด
- ไม่มีการรับประกันราคา สต็อก ผลลัพธ์ หรือคุณภาพเกินข้อมูลที่ตรวจสอบได้
- สินค้าสุขภาพและยาผ่าน Compliance Review ก่อนเผยแพร่
- Admin ระงับสินค้า/ลิงก์ได้ทันที
- มีระบบตรวจลิงก์เสีย สินค้าหมด และข้อมูลเก่า
- Analytics แยก Impression, View, Click และ Conversion ได้ตามข้อมูลที่ได้รับอนุญาต
- หน้าเว็บรองรับ SEO, Mobile และ Accessibility

### ประเด็นที่ต้องตัดสินใจก่อนเริ่ม Implementation

- บัญชีและเงื่อนไข Shopee Affiliate ที่จะใช้
- วิธีสร้างและจัดการ Affiliate links
- มี API/Product feed ที่ได้รับอนุญาตหรือใช้การบันทึกแบบ Manual
- ความถี่ในการตรวจราคา สต็อก และสถานะสินค้า
- จะเริ่มด้วยจำนวนสินค้ากี่รายการต่อหมวด
- เกณฑ์คะแนน รีวิว ร้านค้า และคุณภาพที่ใช้คัดเลือก
- ขอบเขตหมวดสุขภาพ และจะรวม “ยา” ในรุ่นแรกหรือไม่
- ผู้รับผิดชอบ Compliance Review
- วิธีนำข้อมูล Commission เข้าสู่ Admin Console
- Retention และ Privacy policy สำหรับ Click/Conversion data

---

## WEB-004 — Legal & Trust Center

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- Privacy Policy
- Cookie Policy และหน้าจัดการ Consent
- Terms of Use
- Affiliate Disclosure
- Medical Disclaimer
- Financial Disclaimer
- ช่องทางติดต่อเรื่องข้อมูลส่วนบุคคลและคำขอลบ/ส่งออกข้อมูล
- แสดง Version และวันที่มีผลบังคับใช้ของเอกสาร
- เชื่อมเอกสารจาก Footer, หน้าลงชื่อเข้าใช้, FAQs และหน้าสินค้า

### Acceptance Criteria

- เอกสารสอดคล้องกับข้อมูลและบริการที่เว็บไซต์เก็บ/ใช้งานจริง
- ผู้ใช้เปลี่ยนการตั้งค่า Consent ได้ภายหลัง
- ไม่โหลด Analytics ที่ต้องขอ Consent ก่อนผู้ใช้อนุญาต
- Affiliate, สุขภาพ และการเงินมี Disclosure ใกล้เนื้อหาที่เกี่ยวข้อง

---

## WEB-005 — SEO Foundation Fix

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- เพิ่ม Canonical URL ให้หน้าแรก, YouTube, คลังบทความ และหน้าใหม่ทั้งหมด
- ใช้ Open Graph/Twitter metadata แบบ Absolute URL
- แก้ Organization structured data ให้ `url` เป็นโดเมนจริง
- เพิ่ม Breadcrumb และ Article structured data ตามประเภทหน้า
- ตรวจ title, description, heading และ image alt
- Build Sitemap อัตโนมัติและตรวจทุก URL ก่อน Deploy
- เชื่อม Google Search Console
- แสดง Organic clicks, impressions, CTR, query และ average position ใน Admin

### Acceptance Criteria

- หน้าที่ Index ได้ทุกหน้ามี Canonical ที่ถูกต้อง
- Structured data ผ่าน Validator โดยไม่มี Critical error
- Sitemap สอดคล้องกับหน้าที่เผยแพร่จริง
- Admin เห็น Search performance และหน้า SEO ผิดปกติ

---

## WEB-006 — Unified Site Search & Discovery

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- ค้นหารวมบทความ วิดีโอ FAQs และสินค้า
- Filter ตามประเภท หมวด Tag ระดับ และวันที่
- Sort ตามความเกี่ยวข้อง ล่าสุด และความนิยม
- Autocomplete และคำค้นแนะนำโดยไม่เปิดเผยข้อมูลส่วนบุคคล
- Related Content และ Topic Hub
- เก็บ Search terms และ Zero-result searches เพื่อหา Content Gap
- รองรับ Keyboard, Screen Reader และ Mobile

### Acceptance Criteria

- ผลค้นหาแสดงประเภทและแหล่งที่มาชัดเจน
- ผู้ใช้กรองและเปิด Deep link ได้
- Admin เห็นคำค้นยอดนิยมและคำค้นที่ไม่พบผลลัพธ์
- ระบบไม่ส่งข้อมูลส่วนบุคคลไปกับ Search analytics โดยไม่จำเป็น

---

## WEB-007 — Error Pages & Reliability Monitoring

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- หน้า 404 แบบแบรนด์ พร้อม Search และทางกลับหน้าหลัก
- หน้า/ข้อความ Error สำหรับโหลดบทความ วิดีโอ Search และ Login ไม่สำเร็จ
- Broken-link checker
- Uptime monitoring
- Client-side error monitoring และ API error monitoring เมื่อมี Backend
- Incident log และสถานะการแก้ไข

### Acceptance Criteria

- URL ที่ไม่มีจริงเข้าสู่ประสบการณ์ 404 ที่ใช้งานได้
- Admin เห็น Broken links, error rate และเหตุการณ์เว็บไซต์ล่ม
- Error message ไม่เปิดเผย Secret, token หรือรายละเอียดระบบภายใน

---

## WEB-008 — Performance, Asset Optimization & PWA Basics

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** Medium/High

### ขอบเขต

- เพิ่ม favicon, touch icons และ Web App Manifest
- แปลงและบีบอัดภาพเป็น WebP/AVIF ตามความเหมาะสม
- Responsive images ด้วย `srcset`/`sizes`
- Lazy loading สำหรับ media ที่อยู่นอกจอ
- กำหนดขนาดรูปเพื่อลด Layout Shift
- Minify/cache static assets และใช้ versioned assets
- ตรวจ Core Web Vitals และกำหนด Performance Budget
- พิจารณา PWA/offline เฉพาะหน้าที่ให้ประโยชน์จริง

### Acceptance Criteria

- ไม่มีภาพต้นทางขนาดใหญ่ถูกส่งโดยไม่จำเป็น
- หน้า Mobile ผ่านเกณฑ์ Performance Budget ที่กำหนด
- favicon/manifest ทำงานบน Browser และ Mobile ที่รองรับ
- Admin หรือ Build Report แสดง Core Web Vitals/Lighthouse summary

---

## WEB-009 — YouTube Sync Health & Freshness Monitoring

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### เหตุผลจากการตรวจ

ข้อมูลวิดีโอใน Local Project ระบุการอัปเดตล่าสุดวันที่ 2 สิงหาคม 2569 แม้ระบบตั้งใจ Sync ทุก 6 ชั่วโมง จึงต้องเพิ่มการตรวจความสดใหม่และแจ้งเตือน

### ขอบเขต

- Last attempted sync และ Last successful sync
- จำนวน Podcast, Shorts และ Videos ที่ดึงได้
- Duration, API quota และ Error message ที่ปลอดภัย
- Alert หากเกิน 12 ชั่วโมงไม่มี Successful sync
- Manual retry สำหรับ Admin พร้อม Audit Log
- ตรวจ Duplicate, Deleted/Private videos และ thumbnail ที่เสีย

### Acceptance Criteria

- Admin เห็นความสดใหม่และผล Sync ล่าสุด
- ระบบแจ้งเตือนเมื่อข้อมูลเกิน Freshness threshold
- Retry ไม่สร้างข้อมูลซ้ำและไม่เปิดเผย API key

---

## WEB-010 — Member Experience & Personal Library

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** Medium
- **Dependency:** WEB-001 Google Sign-In

### ขอบเขต

- Bookmark บทความ วิดีโอ FAQs, Prompts และสินค้า
- Reading/View history และ Recently Viewed
- Saved Prompts และ Saved Products
- เลือกหัวข้อความสนใจ เช่น AI, ท่องเที่ยว, การเงิน และ Content Creation
- แนะนำเนื้อหาเฉพาะบุคคลแบบโปร่งใส
- Export และ Delete personal data
- ตั้งค่า Privacy และ Personalization

### Acceptance Criteria

- Saved Items แยกตามบัญชีและป้องกันการเข้าถึงข้ามบัญชี
- ผู้ใช้ลบประวัติ ปิด Personalization และส่งออกข้อมูลได้
- ระบบเก็บข้อมูลเท่าที่จำเป็นและแจ้งวัตถุประสงค์ชัดเจน

---

## WEB-011 — Newsletter & Lead Magnet

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- สมัคร Newsletter โดยมี Consent ชัดเจน
- Double opt-in หาก Provider รองรับ
- Lead Magnet เช่น Prompt Pack, Travel Checklist, Financial Template และ AI Starter Guide
- หน้า Thank You และ Unsubscribe
- UTM/Source attribution
- วัด View → Signup → Confirmed subscriber
- เชื่อม Admin เพื่อดู Subscriber growth, conversion และ source

### Acceptance Criteria

- ผู้ใช้สมัครและยกเลิกได้ง่าย
- ไม่เพิ่มอีเมลเข้ารายการโดยไม่มี Consent
- Lead Magnet ส่งมอบได้และมี Version/Update date
- Admin เห็น Conversion โดยไม่เปิดเผยข้อมูลเกินสิทธิ์

---

## WEB-012 — Digital Products & Services

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** Medium

### ขอบเขต

- Prompt Packs
- E-books และ Templates
- Mini Courses และ Workshops
- บริการให้คำปรึกษาหรือช่วยวางระบบ
- Catalog, Landing page, Pricing และ FAQ
- แยก Free/Paid content ชัดเจน
- Terms, Refund/Delivery policy และ Support channel
- Revenue analytics แยกจาก Affiliate

### Acceptance Criteria

- ขอบเขตสินค้า ราคา สิ่งที่จะได้รับ และเงื่อนไขชัดเจน
- ไม่มีการรับชำระเงินจริงก่อนเลือก Payment/Tax/Privacy workflow และได้รับอนุมัติ
- Admin เห็นยอดขาย Conversion Refund และสถานะส่งมอบตามข้อมูลที่ได้รับอนุญาต

---

## WEB-013 — Content Quality & Review Governance

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** High

### ขอบเขต

- Author, Reviewer, Published date และ Updated date
- แหล่งอ้างอิงและวันที่ตรวจสอบข้อมูล
- Content status: Draft, Review, Published, Update Required, Archived
- Review Due Date ตามความเสี่ยงของหมวด
- Disclaimer สำหรับ AI Tools, การเงิน, สุขภาพ, การลงทุน และท่องเที่ยว
- Fact-check checklist และห้ามแต่งข้อมูล
- Version history และ Change summary
- Admin queue สำหรับเนื้อหาเก่า ไม่มีแหล่งอ้างอิง หรือรอตรวจ

### Acceptance Criteria

- เนื้อหาความเสี่ยงสูงผ่าน Reviewer ก่อนเผยแพร่
- ผู้อ่านเห็นวันที่อัปเดตและ Disclaimer ที่เกี่ยวข้อง
- Admin ตรวจหาเนื้อหาเก่า/ขาดแหล่งอ้างอิงได้

---

## WEB-014 — Accessibility & Consistent Navigation

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** Medium

### ขอบเขต

- เมนูหลักเหมือนกันทุกหน้า และรองรับเมนูใหม่ FAQs/สินค้า/สมาชิก
- Semantic HTML และ aria-label ที่จำเป็น
- Keyboard navigation และ visible focus
- Color contrast
- Alt text และ decorative image handling
- Reduced Motion
- Form labels, validation และ error announcement
- Accessibility check ใน Build/QA

### Acceptance Criteria

- ฟังก์ชันหลักใช้งานด้วย Keyboard ได้
- Focus order และ Screen Reader labels มีความหมาย
- Navigation ไม่แตกต่างกันโดยไม่จำเป็นระหว่างหน้า
- ไม่มี Critical accessibility issue ตามเกณฑ์ที่กำหนด

---

## WEB-015 — Conversion & Business KPI Dashboard

- **สถานะ:** Backlog / ยังไม่เริ่มพัฒนา
- **วันที่บันทึก:** 8 สิงหาคม 2569
- **ลำดับความสำคัญ:** Medium
- **Dependency:** WEB-001 Admin Console และ Analytics integration

### ขอบเขต

- Funnel: Landing Page → Content engagement → Signup/Product click/Purchase
- KPI แยกตามเป้าหมาย:
  - Awareness: Users, Reach, Organic impressions
  - Engagement: Engaged sessions, reading/video interaction, scroll depth
  - Lead: Newsletter signup, account creation, saved item
  - Revenue: Affiliate clicks, conversions, orders, commission, digital-product sales
- Conversion rate และ Drop-off ของแต่ละขั้น
- Attribution ตาม Source/Medium/Campaign เท่าที่ข้อมูลรองรับ
- เปรียบเทียบช่วงเวลาและกำหนด Target
- Data freshness, consent coverage และข้อจำกัดของข้อมูล

### Acceptance Criteria

- Dashboard ไม่สรุปผลจาก Page Views เพียงตัวเดียว
- KPI ทุกตัวมีนิยาม แหล่งข้อมูล ช่วงเวลา และเวลาอัปเดต
- Funnel ตรวจย้อนกลับได้โดยไม่เปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น
- Admin แยก Organic, Social, Newsletter และ Affiliate performance ได้

---

## Recommended Delivery Sequence

### Phase A — Foundation & Trust

- WEB-004 Legal & Trust Center
- WEB-005 SEO Foundation
- WEB-006 Site Search
- WEB-007 Error & Reliability
- WEB-009 YouTube Sync Health

### Phase B — Identity & Administration

- WEB-001 Google Sign-In & Admin Console
- WEB-010 Member Experience
- WEB-014 Accessibility & Navigation

### Phase C — Knowledge System

- WEB-002 FAQs & Prompt Library
- WEB-013 Content Quality Governance

### Phase D — Revenue

- WEB-003 Shopee Affiliate Products
- WEB-015 Conversion Dashboard

### Phase E — Growth

- WEB-008 Performance/PWA
- WEB-011 Newsletter & Lead Magnet
- WEB-012 Digital Products & Services

---

## MVP Implementation Review — 8 สิงหาคม 2569

> สถานะนี้บันทึกสิ่งที่มีอยู่จริงใน working tree สำหรับ Coordinator review เท่านั้น ยังไม่ Deploy, Push, Stage หรือ Commit และไม่แทน Acceptance Criteria ฉบับเต็มด้านบน

| งาน | สถานะ MVP | สิ่งที่เสร็จในรอบนี้ | สิ่งที่ยังต้องทำก่อน Done |
|---|---|---|---|
| WEB-001 | Review / Boundary implemented | API boundary, default-deny service status, server-side member/admin checks และ env allowlist contract | OAuth adapter, session/DB, Admin UI, audit และ provider tests |
| WEB-002 | Review / Partial | FAQ search/filter/deep link/copy prompt และ starter set 18/180 ครบ 6 หมวด | เขียนและตรวจอีก 162 ข้อ, official sources/reviewers, admin history |
| WEB-003 | Review / Architecture only | 4-category catalog UX, disclosure, verified-data gate และ 0 fake listings | Shopee approval/feed, real listings, link/compliance review, conversion import |
| WEB-004 | Review / MVP | Privacy, cookies/consent, terms, affiliate, medical, financial และ data-request disclosure | ยืนยัน privacy contact และ legal review เมื่อ provider ถูกเลือก |
| WEB-005 | Review / MVP | Canonical/absolute OG สำหรับ public hubs, Organization URL, generated sitemap/checks | Search Console/GA Data integrations และ full structured-data validation |
| WEB-006 | Review / MVP | Local unified search across articles/videos/FAQs/products พร้อม type/sort | autocomplete, related-content ranking และ consented server analytics |
| WEB-007 | Review / MVP | Branded 404, safe load errors และ local broken-link check | uptime/client/API monitoring provider และ incident dashboard |
| WEB-008 | Review / MVP | Manifest, icon, service worker cache, reduced motion และ build pipeline | measured Lighthouse/CWV budget, responsive image variants และ cache headers on host |
| WEB-009 | Review / Partial | Existing sync preserved; public freshness remains visible in data | persisted attempt/success health, >12h alert, authorized retry/audit |
| WEB-010 | Review / Boundary only | Member unavailable state and authenticated API ownership boundary | OAuth/DB, bookmark/history/preferences, export/delete UI and tests |
| WEB-011 | Review / Boundary only | Honest unavailable state; no email collection without provider | provider, consent record, double opt-in, unsubscribe, lead magnet delivery |
| WEB-012 | Review / Boundary only | Honest catalog/payment unavailable state; no fake price or checkout | approved catalog, terms/refund/delivery/tax/support and payment integration |
| WEB-013 | Review / MVP foundation | Published governance policy, statuses, high-risk gate and no-fabrication rules | backfill verified author/reviewer/source/due-date metadata across existing content |
| WEB-014 | Review / MVP | Unified primary navigation on main hubs, skip links, labels, focus/reduced motion | automated browser accessibility audit and article-template navigation parity review |
| WEB-015 | Review / Boundary only | KPI sources defined as provider-backed; no sample users/revenue/analytics | real GA/affiliate/payment data, definitions, freshness and protected dashboard |

### Change Log — MVP-2026-08-08

- เพิ่มหน้า FAQs, products, search, legal, services, governance และ branded 404
- เพิ่ม FAQ starter set 18/180 อย่างชัดเจน; ไม่ขยายคำเต็ม PPRM และไม่สร้าง reference แทน
- เพิ่ม product data model ว่าง; ไม่มี Shopee listing, rating, price, order, commission หรือ revenue จำลอง
- เพิ่ม default-deny backend contract สำหรับ OAuth/Admin/Member/GA/Database/Newsletter/Affiliate/Payment
- เพิ่ม manifest/service worker, sitemap build, syntax/site/security tests และ setup documentation
- คง analytics consent แบบ opt-in; ไม่มี analytics script โหลดก่อนอนุญาต
