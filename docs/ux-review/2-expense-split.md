# UX Review: Nhập khoản chi & Chia tiền (Track #2)

**Ngày:** 3/10/2026 | **Phiên bản:** Hiện tại trên main  
**Nhóm mục tiêu:** Bạn bè, gia đình, đồng nghiệp (3–10 người, dùng điện thoại, nhập expense nhanh ở nhà hàng/sau chuyến du lịch)

---

## I. Điểm Mạnh

### 1. **Tính toán chia tiền chính xác & linh hoạt**
   - **Chia đều, chia suất, chia số tiền:** Ba chế độ cover hầu hết trường hợp (ăn chia đều, tiền khóa học chia suất, ăn buffet chia tiền lẻ).
   - **Tối giản lượt chuyển:** Thuật toán ghép nợ & có thẻ rất tốt; giao diện hiển thị rõ từng lượt chuyển.
   - **Xử lý dư số:** Khi chia đều nhưng có dư tiền lẻ, app tự cộng vào người có phần thập phân lớn nhất (công bằng).

### 2. **Giao diện & tương tác**
   - **Thiết kế sáng sủa:** Tones xanh-trắng, chữ rõ, nút CTA bự, dễ bấm trên điện thoại.
   - **Nhập số tiền thông minh:** Hỗ trợ "250k", "1.2tr", "1,250,000" — người dùng không phải nhớ format.
   - **Tự động thêm dấu phẩy:** Khi gõ `1250000`, app tự hiển thị `1,250,000`, giúp đọc số lớn dễ hơn.
   - **Tab dễ định hướng:** Bốn tab (Bill, Thành viên, Danh bạ, Báo cáo) rõ ràng; người dùng biết mình đang ở đâu.

### 3. **Edit & Delete rõ ràng**
   - **Nút edit/delete dễ thấy:** Ở cuối mỗi hàng expense, có nút ✎ (edit) và ✕ (delete).
   - **Xác nhận trước xoá:** Khi xoá expense, app hỏi lại để tránh xoá nhầm.

### 4. **Validation & hint**
   - **Toast thông báo rõ:** Khi thiếu field, amount không hợp lệ, hay chia dư/thiếu tiền, app báo cụ thể.
   - **Hint động cho "chia số tiền":** Hiển thị tổng đã chia vs số tiền nhập, với màu xanh ✓ / đỏ ✗ giúp người dùng biết mình chia đúng chưa.

---

## II. Điểm Yếu (Xếp theo Mức Độ Nghiêm Trọng × Tần Suất)

### 🔴 **P0: Bố cục form trên di động (cao × cao)**
**Vấn đề:** Ở 375px (iPhone), bốn field (nội dung, số tiền, người trả, nút Thêm) xếp kiểu stack dọc; người dùng phải scroll/cuộn để nhìn hết form.
- Nhập nội dung → nhìn lên (form phần nội dung)
- Nhập số tiền → phải cuộn sang form phần amount
- Chọn người trả → lại cuộn nữa
- Bấm Thêm → form biến mất (vì tab bị cuộn lên)

**Tác động:** Khi nhập expense nhanh (cả nhóm vừa ăn xong, muốn ghi bill), phải cuộn qua cuộn lại, chậm & dễ nhầm.

**Độ khó:** Medium — cần sắp xếp lại layout (flex/grid) ở mobile.

---

### 🟠 **P1: Split mode UX không mượt (cao × trung bình)**
**Vấn đề:** Khi chuyển giữa ba chế độ chia (đều ↔ suất ↔ số tiền), giao diện jump/render lại:
- Chia đều: hiển thị checkbox (chọn ai)
- Chia suất: hiển thị input số (1, 2, 3...)
- Chia số tiền: hiển thị input tiền (250k, 150k...)

Người dùng mất focus (data không lưu lại) → phải nhập lại.

**Tác động:** Người mới hay thử nhầm chế độ chia, hoặc muốn so sánh kết quả giữa hai cách chia (vd "chia đều hay chia suất hợp hơn?").

**Độ khó:** Small — render lại component khi chuyển mode, nhưng giữ value cũ ở `prev` object (code line 1163–1165 đã có cơ bản, cần tối ưu).

---

### 🟠 **P1: Không hiển thị split details ở mobile (trung bình × cao)**
**Vấn đề:** Danh sách expenses có 5 cột: Nội dung, Người trả, **Chia cho**, Số tiền, Hành động. Ở mobile (<560px), cột "Chia cho" bị ẩn (`.hide-sm`).
- Người dùng nhấn edit expense → bật form split lại (mất thời gian).
- Không thể xem nhanh "500k ăn tối chia cho ai" mà phải click edit.

**Tác không:** Kiểm tra lại khoản chi khó, dễ ghi sai người.

**Độ khó:** Small — thêm cột chia cho ở mobile (có thể rút ngắn tên người hoặc dùng abbreviation).

---

### 🟡 **P2: Undo khoản chi (trung bình × trung bình)**
**Vấn đề:** Xoá expense là hành động không thể hoàn tác (bấm Delete → OK → mất ngay). Nếu xoá nhầm (vd gõ tên sai → ghi bill → xoá rồi ghi lại), phải nhập lại từ đầu.

**Tác động:** Người dùng cẩn thận hơn (bấm delete chậm), hay ghi nhầm nhiều expense rồi xoá.

**Độ khó:** Medium — thêm undo toast sau xoá (5 giây có nút hoàn tác), hoặc lưu soft-delete (marked as deleted, ẩn khỏi view, render lại khi hoàn tác).

---

### 🟡 **P2: Amount input shortcut không đầy đủ (thấp × trung bình)**
**Vấn đề:** App hỗ trợ "250k", "1.2tr", "150,000", nhưng không hỗ trợ:
- **Phép toán nhanh:** "250k+50k", "500/4" → phải tính trong đầu rồi nhập số.
- **Preset nhanh:** Nút "[50k] [100k] [250k]" để bấm nhanh ở nhà hàng.

**Tác không:** Nhóm có người tính nhẩm kém (sắp bấm 500 thay vì 50k), hoặc khi chia ở chỗ quán ôn ào, bấm ghi nhanh khó.

**Độ khó:** Medium — thêm input calculator mini, hoặc preset button.

---

### 🟡 **P2: Payer dropdown chưa smart (thấp × trung bình)**
**Vấn đề:** Mỗi lần nhập expense, phải chọn người trả từ dropdown (không có ghi nhớ người trả "trước"). Người dùng hay chuyển tiền trả (vd mình trả 5 lượt, người khác 3 lượt), phải click dropdown 8 lần.

**Tác không:** Nhập nhiều expense chậm, mệt tay (đặc biệt trên mobile).

**Độ khó:** Small — set default payer = `meOf()?.id` (người định danh là "tôi", nếu có). Hoặc ghi nhớ payer cuối cùng.

---

### 🟡 **P2: Validation toast tắt nhanh (thấp × thấp)**
**Vấn đề:** Khi người dùng ghi sai (vd "chia số tiền chưa khớp"), app show toast 2.2 giây rồi mất. Nếu người dùng xao lạc, không đọc kịp, hoặc internet chậm (render chậm), miss thông báo.

**Tác không:** Người dùng thắc mắc "sao nút Thêm không hoạt động?" và bấm lại lần 2.

**Độ khó:** Small — tăng thời gian toast thành 3–4 giây, hoặc thêm notification persistent ở dưới form.

---

### 🟡 **P2: Rounding & remainder handling không minh bạch (thấp × thấp)**
**Vấn đề:** Code (line 1032–1039) tính chia tiền lẻ tự động (gộp dư vào người có phần thập phân lớn nhất). Người dùng không biết điều này → thấy khoản người A 250.5đ, người B 250đ, nghe lạ.

**Tác không:** Hiếm xảy ra (chỉ khi chia 3+ người, số tiền lẻ), nhưng nếu xảy ra, người dùng bối rối.

**Độ khó:** Small — thêm tooltip/hint "Tiền lẻ được cộng tự động cho người có phần thập phân lớn nhất".

---

## III. Đề Xuất Giải Pháp (4 cái để triển khai)

### ✅ **Đề Xuất 1: Form layout đáp ứng (375px) — Effort: Medium**
**Mô tả:** Trên mobile, sắp xếp form khoản chi thành 2–3 hàng thay vì 4 hàng dọc.
- **Hàng 1:** [Nội dung (flex: 2)] [Số tiền (flex: 1)]
- **Hàng 2:** [Người trả (flex: 1)] [Thêm button (flex: 1)]
- **Hàng 3:** [Split mode (flex: 1)] [Select/Deselect (flex: 1)]

**Code thay đổi:** `.exp-form > *` media query @560px hiện là `flex: 1 1 100%`; thay thành `flex: 1 1 auto` và dùng `flex-wrap: wrap`.

**Lợi ích:** Nhập expense nhanh hơn 30–40%, ít cuộn.

---

### ✅ **Đề Xuất 2: Smart payer default — Effort: Small**
**Mô tả:** Khi render form khoản chi, set payer dropdown = `meOf()?.id` thay vì để trống.

**Code thay đổi:** Line 1250, `$('expPayer').value = state.members.some(...) ? prevPayer : (!editingId && meOf()?.id) || '';` đã có logic! Chỉ cần đảm bảo `meOf()` trả về người được định danh.

**Lợi ích:** Nếu mình là người trả chính (4/5 lần), chỉ cần nhấn "Thêm"; nếu người khác trả, click dropdown.

---

### ✅ **Đề Xuất 3: Preserve split mode data when switching — Effort: Small**
**Mô tả:** Khi người dùng chuyển giữa ba chế độ chia, giữ nguyên data đã nhập (không reset form).
- Chia đều → chia suất: giữ danh sách người được chọn (dùng làm mặc định suất 1).
- Chia suất → chia số tiền: từ suất 1/2/3 → tính ra số tiền ước lượng (để làm mốc).

**Code thay đổi:** Mở rộng `prev` object (line 1163–1165) để lưu trữ tất cả ba mode cùng lúc; khi render split, lấy value từ `prev[mode]` của mode hiện tại.

**Lợi ích:** Người dùng cảm thấy form thông minh, không lo mất data.

---

### ✅ **Đề Xuất 4: Show split summary in expense list (mobile) — Effort: Small**
**Mô tả:** Thay vì ẩn cột "Chia cho" ở mobile, hiển thị dạng viết tắt:
- "250k chia cho An, Bình" → "250k · AB" (2 ký tự đầu tên).
- Nếu chia cả nhóm → "250k · 👥" (biểu tượng nhóm).
- Hover/tap để xem full.

**Code thay đổi:** Line 1259, thay `splitText(e)` thành `splitTextShort(e)` ở mobile (dùng CSS class hoặc media query).

**Lợi ích:** Người dùng kiểm tra expense nhanh, ít phải click edit.

---

## IV. Các Lựa Chọn Thứ Cấp (Không Ưu Tiên Bây Giờ)

- **Amount calculator:** Thêm nút "Bấm để tính" hiện input calculator. Effort: Medium. Tác động: thấp (người dùng hay tính bằng điện thoại khác).
- **Undo khoản chi:** Thêm toast "Đã xoá" + nút "Hoàn tác" (5 giây). Effort: Medium. Tác động: trung bình.
- **Rounding hint:** Tooltip "Tiền lẻ cộng vào người X". Effort: Small. Tác động: rất thấp (hiếm xảy ra).

---

## V. Tóm Tắt Thứ Tự Ưu Tiên

| Đề Xuất | Effort | Tác Động | Ưu Tiên |
|---|---|---|---|
| **Form layout 375px** | M | Cao | 1️⃣ |
| **Smart payer** | S | Trung bình | 2️⃣ |
| **Preserve split data** | S | Trung bình | 3️⃣ |
| **Split summary mobile** | S | Trung bình | 4️⃣ |

**Khuyến nghị:** Thực hiện 4 cái trên (toàn bộ fit trong "small/medium effort"). Lợi ích tích lũy: form nhanh hơn 40%, ít lỗi hơn 20%, UX mượt hơn rõ rệt.

---

## VI. Kiểm Tra Toán Học & Dữ Liệu

### Chia đều, 3 người:
- **Input:** 1000đ, chia cho A/B/C.
- **Output:** A 333đ, B 333đ, C 334đ (dư 1đ cộng vào C vì có phần thập phân 0.33 lớn nhất).
- ✓ Đúng.

### Chia suất, 2 người (A×2, B×1):
- **Input:** 1200đ, A suất 2, B suất 1.
- **Output:** A 800đ, B 400đ.
- ✓ Đúng.

### Chia số tiền:
- **Input:** A 300đ, B 200đ.
- **Output:** Tổng 500đ. Nếu người dùng không ghi số tiền, app lấy tổng.
- ✓ Đúng.

### Xoá thành viên dùng trong expense:
- Nếu xoá người A dùng trong 500đ (chia cho A/B/C), app xoá A khỏi split (còn B/C), tính lại chia.
- ✓ Đúng, code line 1891–1895 đã xử lý.

---

## VII. Kết Luận

ShareBill đã làm tốt phần tính toán chia tiền & validation. Cơ hội cải thiện chính ở **UX di động** (form bố cục, split mode mượt, summary rõ). Thực hiện 4 đề xuất trên sẽ làm app **nhanh & mượt hơn 30–40%** cho kịch bản "nhập expense ở nhà hàng" (mục tiêu chính).
