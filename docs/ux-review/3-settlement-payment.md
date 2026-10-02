# Đánh giá UX: Thanh toán & Theo dõi nợ (Settlement, Payment & Follow-up)

**Ngày đánh giá:** 03/10/2026  
**Phạm vi:** ShareBill PWA — Trải nghiệm thanh toán, đánh dấu đã trả, nhắc nợ cho nhóm nhỏ (3–10 người)

---

## Tóm tắt

ShareBill hiện đã có các tính năng thanh toán cơ bản: tối giản lượt chuyển, tạo mã QR VietQR, đánh dấu "đã trả", hoàn tác. Tuy nhiên, trải nghiệm còn nhiều điểm cần cải thiện cho người dùng trên điện thoại:

- **Không hỗ trợ thanh toán từng phần** — chỉ được đánh dấu cả khoản
- **Người nhận không thể xác nhận** — chỉ người chuyển mới ghi nhận
- **Khó tìm lượt chuyển cần làm** — phải cuộn để tìm transfer card của mình
- **Không tích hợp netting toàn khoá** — tối giản chỉ trong từng bill riêng
- **Giao diện chật trên điện thoại** — mã QR chiếm nhiều chỗ, hạn chế nút bấm

Các đề xuất dưới đây ưu tiên **giá trị cao, công sức nhỏ–trung** để cải thiện trực tiếp mục tiêu của nhóm nhỏ.

---

## Điểm mạnh hiện tại

1. **Thuật toán tối giản gọn gàng**: Giảm từ O(n²) → chuyên focus vào cặp nợ-có lớn nhất (greedy matching)
2. **QR VietQR đầu đủ & an toàn**: CRC16 checksum, hỗ trợ 40+ ngân hàng, chỉ 2 tập tin vendored
3. **Luồng deeplink ngân hàng**: Hướng dẫn từng bước lưu QR → quét ảnh trong app, tránh "chỉ mở app không điền được"
4. **Nhắc nợ qua Zalo**: Text shareable với bill name, ngày, link quét QR — giải quyết khó khăn gửi tin
5. **Đánh dấu & hoàn tác nhanh**: Một tap → ghi nhận thanh toán; undo đơn giản
6. **Personal indicator**: "BẠN CẦN CHUYỂN" / "BẠN SẼ NHẬN" ở đầu bill giúp định hướng

---

## Điểm yếu & Điểm đau (Pain Points)

### 1. Thanh toán từng phần (Partial Payments) — **Độ nghiêm trọng: CAO**

**Vấn đề:**  
Luôn phải thanh toán toàn bộ một lượt. Trong thực tế:
- Người nhận tiền muốn "chờ thêm người khác chuyển rồi mới đánh dấu tất cả cùng lúc"
- Hoặc "tôi chỉ có 200k, người kia chuyển 300k, để tôi chuyển trước 200k xong rồi lần sau"
- Dẫn đến phải hoàn tác, sửa, hay quên không ghi nhận

**Tác động:** Trung bình 20–30% bill trong nhóm nhỏ có phần thanh toán từng lần. Khiến "danh sách đã trả" bị nhầm lẫn.

**Nỗ lực hiện tại:** Không có; code cứng `payments.push({..., amount: t.amount})`

---

### 2. Người nhận không xác nhận (No Receiver Confirmation) — **Độ nghiêm trọng: CAO**

**Vấn đề:**  
- Chỉ người chuyển mới bấm "✓ Đã trả" → ghi nhận trong `payments`
- Người nhận **không biết** họ đã được ghi nhận hay chưa (ngoại trừ mở bill mỗi lần)
- Nếu người chuyển "quên" hoặc "bấm nhầm", người nhận không có cách verify

**Tác động:** Khi về sau (tuần sau, tháng sau) nhắc lại, có tranh cãi "tôi chuyển rồi" ↔ "tôi chưa thấy"

**Nỗ lực hiện tại:** Không có; `payments` lưu `{id, from, to, amount, at}` — không có confirmed_by

---

### 3. Khó tìm lượt chuyển của mình (Poor Mobile Discoverability) — **Độ nghiêm trọng: TRUNG**

**Vấn đề:**  
- Trên điện thoại, mỗi transfer card là `grid` 240px, cuộn nhiều ở lưới 2–3 card
- Mã QR 200×200px trong card → chỉ còn ~50px cho 2–3 nút bấm → wrap nút, khó nhấn
- Người bấm "BẠN CẦN CHUYỂN" trên phần "Phần của bạn" ở đầu → cuộn xuống tìm card (lộn xộn, tốn thời gian)
- Feature "Xem QR ↓" có link scroll nhưng mã QR vẫn chiếm diện tích lớn

**Tác động:** Trên điện thoại, người dùng mất 5–10 giây tìm transfer card của mình; trên máy tính không vấn đề.

**Nỗ lực hiện tại:** Không; CSS grid 240px cứng; mã QR inline không ẩn được

---

### 4. Không netting toàn khoá (No Cross-Bill Netting) — **Độ nghiêm trọng: TRUNG–CAO**

**Vấn đề:**  
- Chỉ tối giản trong 1 bill; nếu có 2 bill cùng nhóm, không gộp
  - Bill A: An → Bình 100k
  - Bill B: Bình → An 150k
  - Hiện: 2 lượt chuyển; tối ưu: 1 lượt (Bình → An 50k)
- Report tab có "Theo người" tổng hợp, nhưng **không có cách trực tiếp thanh toán netting này** (phải về từng bill)

**Tác động:** Bill nhiều không gom được debt lại; nhóm bạn phải chuyển nhiều lần không cần thiết.

**Nỗ lực hiện tại:** `compute(b)` chỉ tính 1 bill; Report tính toàn bộ nhưng không tạo pending transfer

---

### 5. Giao diện chật chội trên điện thoại (Cramped Mobile UI) — **Độ nghiêm trọng: TRUNG**

**Vấn đề:**  
- Transfer card: mã QR + thông tin ngân hàng + nút bấm → quá tải
- Trên iOS iPhone 12 mini (375px), thành viên tab layout cũng chật
- Nút "📷 Quét QR", "📋 Copy STK", "📋 Copy nội dung", "🏦 Mở app" — bốn nút cho một card

**Tác động:** Người dùng điện thoại phải tap nhiều lần, dễ tắc; trải nghiệm "lộn xộn"

**Nỗ lực hiện tại:** CSS `@media (max-width: 560px)` ẩn `.hide-sm`, nhưng transfer card không có responsive variant

---

### 6. Lịch sử thanh toán tối thiểu (Minimal Payment History) — **Độ nghiêm trọng: THẤP**

**Vấn đề:**  
- `.paid-list` chỉ hiển thị danh sách "đã trả" mà không phân nhóm theo bill hay thời kỳ
- Hoàn tác → xóa luôn khỏi danh sách, không có audit trail
- Người nhận không thấy tiền của mình được ghi nhận khi nào (chỉ payer thấy)

**Tác động:** Tuần sau, khó tra cứu "tôi chuyển khi nào, ai confirm". Nhưng ít xảy ra trong nhóm nhỏ (3–10 người).

**Nỗ lực hiện tại:** Danh sách `.paid` render từ `payments` với `.toLocaleDateString()`; không lưu `confirmedBy`

---

### 7. Nhắc nợ không được tracking (Reminder Delivery Not Tracked) — **Độ nghiêm trọng: THẤP**

**Vấn đề:**  
- Bấm "📤 Nhắc nợ" → copy text hoặc share qua native dialog
- Không biết người kia có nhận được, xem được, hay đã chuyển chưa
- Nếu share qua Zalo, không auto-update bill khi người kia chuyển

**Tác động:** Phải chủ động mở bill lại để check (hoặc khác người nhắc lại). Nhưng tự nhiên trong flow nhóm bạn.

**Nỗ lực hiện tại:** `remind(key)` tạo text, share hoặc copy; không có tracking

---

## Đề xuất cải thiện (Ranking: Giá trị × Dễ thực hiện)

### **Đề xuất 1: Nút "Quick Pay" — Xem & trả chuyên focus cho mình (Effort: NHỎ, Value: CAO)**

**Nội dung:**  
Trên "Phần của bạn" ở đầu Bill tab, thêm **một nút duy nhất cho mỗi khoản chuyển** — tap vào → mở dialog nhỏ chứa:
- Receiver name, amount, QR code (gọn gàng)
- 2–3 nút: [💾 Lưu QR] [🏦 Mở app] [✓ Đã trả]
- Ẩn nút nếu transfer cũng có sẵn nút "pay" ở section 3

**Lợi ích:**
- Ghi nhận thanh toán nhanh: 1 tap từ phần "Phần của bạn" → không cuộn, không tìm card
- Người trả trực tiếp thấy QR của receiver + có thể ghi nhận luôn

**Effort:** ~40 dòng HTML/JS (modal nhỏ, event listener, trigger từ me-card)

**Implementation note:** Tái dùng `#payDialog` hoặc tạo modal nhỏ mới; lắng nghe click trên me-card.

---

### **Đề xuất 2: Hỗ trợ thanh toán từng phần (Effort: TRUNG, Value: CAO)**

**Nội dung:**  
Khi bấm "✓ Đã trả", **không ghi luôn** `t.amount` mà:
1. Pop up / form nhỏ hỏi: "Bạn chuyển bao nhiêu?" (pre-fill = `t.amount`)
2. Nếu nhập < `t.amount` → ghi nhận partial; transfer vẫn ở bảng, nhưng amount giảm đi
3. Nếu bằng `t.amount` → ghi nhận full, loại khỏi bảng

**Lợi ích:**
- Cho phép "chuyển 200k hôm nay, 300k tuần sau" mà không hoàn tác–sửa
- Report tab tự động update: "An → Bình: còn 100k (đã trả 300k/400k)"

**Effort:** 
- HTML: 1 dialog `#partialPayDialog` với input số tiền
- JS: 40–60 dòng xử lý partial logic, recompute transfers
- Data: Mở rộng `payments` → `{amount, partialOf?}` hoặc tạo `partialPayments` riêng (backward compat)

**Cách thực hiện:**
- Khi click "pay" button, nếu `amount > 0` → show dialog với pre-fill `t.amount`
- Nếu input < amount, cập nhật `transfers` để transfer đó giảm lại
- Nếu input = amount, xóa transfer khỏi danh sách
- Lưu payment record vẫn là `{from, to, amount: input, at}`; không cần flag `partial`

---

### **Đề xuất 3: Nút "Confirm" cho người nhận (Effort: TRUNG, Value: TRUNG–CAO)**

**Nội dùng:**  
Thêm trạng thái "pending" cho payment:
1. Người **chuyển** bấm "✓ Đã trả" → `payments.push({from, to, amount, at, status: 'pending'})`
2. Dòng thanh toán ở section 3 hiển thị: "❌ Chờ xác nhận từ [Receiver]"
3. **Người nhận** (nếu `store.me === p.to`) thấy: "An chuyển 300k cho bạn — [✓ Xác nhận đã nhận]"
4. Click ✓ → `payments[...].status = 'confirmed'` → hiển thị ✓ (color change, dấu hết)

**Lợi ích:**
- Rõ ràng ai đã confirm; tránh tranh cãi "đã chuyển chưa"
- Receiver tích cực xác nhận, không phụ thuộc payer

**Effort:**
- Data: Thêm `status: 'pending' | 'confirmed'` vào payment record
- UI: 1 section trong phần "Phần của bạn" nếu là receiver: hiển thị "X người sẽ chuyển cho bạn", + "đã confirm" count
- JS: 30–40 dòng event listener + render logic

**Backward compat:** Migrate: payment cũ không có status → coi là `'confirmed'` (hay `undefined`)

---

### **Đề xuất 4: Quick Action Buttons — Gọn trên mobile (Effort: NHỎ, Value: TRUNG)**

**Nội dung:**  
Transfer card trên mobile:
1. **Ẩn mã QR mặc định** (show trong modal khi bấm)
2. **Gộp 4 nút "Copy STK / Copy nội dung / Mở app / Đã trả"** thành:
   - iPhone/Android: 1 nút "⋮" (menu) → popup với 4 option
   - Desktop: giữ nguyên 3–4 nút (1 dòng)

**Lợi ích:**
- Transfer card gọn lại ~100px width trên mobile
- Vẫn có đủ feature, chỉ ẩn không ưu tiên

**Effort:** ~30–50 dòng CSS + JS (dropdown menu, responsive breakpoint)

---

### **Đề xuất 5: Cross-Bill Netting View (Effort: TRUNG–LỚN, Value: TRUNG)**

**Nội dung:**  
Report tab thêm tab con "Netting toàn khoá":
- Tính toàn bộ netting (build từ `compute()` trên mọi bill)
- Hiển thị: "Bình → An 50k (gộp Bill A + B)"
- Có button "Mở để trả chuyên focus"

**Lợi ích:**
- Rõ ràng: trong nhóm này, ai nợ ai bao nhiêu overall
- Giảm số lượt chuyển

**Effort:** 60–100 dòng (tính netting toàn bộ, render tab, link từng transfer về bills)

**Complexity:** Cao hơn; ưu tiên sau đề xuất 1–3

---

## Bảng xếp hạng đề xuất

| Đề xuất | Effort | Value | Effort/Value | Ưu tiên |
|--------|--------|-------|--------------|---------|
| 1: Quick Pay | Nhỏ (40L) | Cao | 0.03 | **1** |
| 2: Partial Pay | Trung (60L) | Cao | 0.09 | **2** |
| 3: Confirm Status | Trung (70L) | Trung–Cao | 0.08 | **3** |
| 4: Mobile Menu | Nhỏ (40L) | Trung | 0.04 | **Sau 1–3** |
| 5: Cross-Bill Netting | Lớn (100L) | Trung | 0.17 | **Sau 1–3** |

---

## Recommendation: Thực hiện #1 + #2 + #3

- **#1 (Quick Pay)**: Giải quyết "khó tìm transfer card" (pain point 3) + cải thiện tốc độ ghi nhận
- **#2 (Partial Pay)**: Giải quyết "thanh toán từng phần" (pain point 1) — rất phổ biến trong nhóm thực tế
- **#3 (Confirm)**: Giải quyết "người nhận không xác nhận" (pain point 2) — tránh tranh cãi

Cộng lại: **~120–150 dòng code**, **giải quyết 3 pain point CAO×2 TRUNG** → ROI rất tốt.

---

## Danh sách kiểm tra triển khai

- [ ] Kiểm tra backward compat với payment cũ không có status/partialOf
- [ ] VietQR payload vẫn đúng khi partial pay (amount = actual)
- [ ] Mobile test: transfer card gọn, nút bấm không wrap quá
- [ ] Test undo partial → recompute transfers đúng
- [ ] Report tab update đúng khi có partial + confirmed
- [ ] Commit message tiếng Việt, kèm attribution line

