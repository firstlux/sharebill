# Đánh giá UX: Onboarding & Collaboration - ShareBill

**Ngày**: 03/10/2026  
**Phạm vi**: Lưu ý trên onboarding (người tạo & người nhận), hiểu được app là gì, joining bill, xác định "tôi là ai", sửa chung realtime, quản lý nhiều nhóm/bill, empty state, cues về chia sẻ link.

---

## I. Điểm mạnh

### 1. **Tự động hỏi "Bạn là ai?" cho link mới (A1)**
- Khi mở bill từ link lần đầu, app tự hiển thị dialog "Bạn là ai trong bill này?" để người dùng xác định danh tính
- Giúp mọi người nhanh chóng biết "mình là ai" trong ngữ cảnh bill
- Cho phép skip nếu chỉ muốn xem (chỉ xem, bỏ qua)
- **Tác dụng**: Giảm nhầm lẫn ai là ai trong thanh toán, làm rõ trách nhiệm cá nhân

### 2. **Tổng hợp danh bạ dùng chung (B1)**
- Directory (danh bạ) được lưu riêng, dùng chung cho mọi bill
- Khi thêm người vào bill lần đầu, tự gợi ý từ danh bạ (hoặc tạo mới & lưu)
- Giảm nhập lại lần 2, 3, 4… tên người
- **Tác dụng**: Tốc độ, giảm lỗi (trùng tên, typo)

### 3. **Hai cách chia tiền (equal / shares / exact) (C1)**
- Chia đều, theo suất, theo số tiền cụ thể — linh hoạt cho nhiều tình huống
- Gợi ý nhóm để chọn nhanh ("chỉ chọn nhóm này")
- **Tác dụng**: Phù hợp với các kiểu chia khác nhau (ăn cơm chung, roommate, tiền xăng)

### 4. **Nhóm thành viên (Groups) (D1)**
- Một người có thể thuộc nhiều nhóm
- Giúp tổ chức & hiểu ai là ai: "Gia đình An", "Phòng 2", "Dự án X"
- **Tác dụng**: Quản lý rõ ràng, đặc biệt với 3-10 người ở nhiều context

### 5. **Đồng bộ realtime & trạng thái mạng (E1)**
- Bill sửa chung qua Firebase: người này sửa, người kia thấy ngay
- Hiển thị trạng thái: "Sửa chung · đã đồng bộ", "Mất kết nối · thay đổi sẽ gửi khi có mạng"
- **Tác dụng**: Trust — người dùng biết dữ liệu có safe không

### 6. **QR code ngân hàng & mở app (F1)**
- Quét QR trực tiếp trong app hoặc lưu ảnh để quét trong app ngân hàng
- Tối ưu workflow: không cần ghi tay, copy-paste số TK
- **Tác dụng**: Giảm sai sót, tăng tốc độ thanh toán

---

## II. Điểm yếu & Đau điểm (Pain Points)

### **🔴 Cao: Thường xuyên & Có hại**

#### 1. **Khó hiểu "Bạn là ai" lần đầu mở link (P1 - Tần suất: Cao, Độ nghiêm trọng: Cao)**
- **Triệu chứng**: Người dùng mở link từ Zalo/tin nhắn, không hiểu là họ phải chọn tên mình
  - Dialog "Bạn là ai trong bill này?" xuất hiện, nhưng có thể chưa rõ vì sao hỏi
  - Nút "Chỉ xem, bỏ qua" và danh sách tên có thể gây nhầm (có phải chọn 1 cái không?)
- **Root cause**: Không có hint/hướng dẫn rõ ràng. Nơi click không obvious.
- **Tác động**: Người dùng mới có thể bỏ cuộc, hoặc chọn sai người.

#### 2. **Không rõ link bill vs link danh bạ vs snapshot (P2 - Tần suất: Cao, Độ nghiêm trọng: Trung-Cao)**
- **Triệu chứng**:
  - 3 loại link khác nhau: #b=… (sửa chung online), #d=… (danh bạ đồng bộ), #… (snapshot bản chụp)
  - Người dùng không biết sự khác biệt khi nhận link
  - VD: "Copy link" được dùng cho bill sửa chung, nhưng nó là gì? Có được lưu vĩnh viễn không?
- **Root cause**: Không có text giải thích rõ khi copy, không có UI phân biệt loại link
- **Tác động**: 
  - Người nhận link không biết liệu họ có thể sửa hay chỉ xem
  - Khi cắt mạng và sửa offline, sau khi quay lại mạng không rõ dữ liệu có được lưu không

#### 3. **Empty state: "Bill chưa có ai" không rõ hướng tiếp theo (P3 - Tần suất: Cao, Độ nghiêm trọng: Trung)**
- **Triệu chứng**:
  - Tab "Bill" khi chưa có thành viên hiển thị: "Chưa có khoản chi" + một link nhỏ "Thêm thành viên →"
  - Tab "Thành viên" rõ ràng hơn: "Bill chưa có ai. Chọn từ danh bạ ở trên."
  - Nhưng flow từ "Bill" → tab "Thành viên" không mượt: người dùng phải click, scroll, tìm
- **Root cause**: Không tự động switch tab hoặc không có onboarding overlay rõ
- **Tác động**: Người dùng mới mất thời gian, có thể không hiểu được flow tạo bill đúng

#### 4. **Không rõ "Sửa chung" là gì & khi nào nên bật (P4 - Tần suất: Trung, Độ nghiêm trọng: Cao)**
- **Triệu chứng**:
  - Nút "☁️ Bật sửa chung" ở header, nhưng không rõ khác gì với "🔗 Copy link"
  - Người tạo bill có thể không biết phải bật "sửa chung" trước khi share link
  - Nếu share link mà chưa bật sửa chung, người khác mở được link (snapshot) nhưng không thấy update realtime
- **Root cause**: 
  - UI không nói rõ: "Bật sửa chung" = cho phép nhiều người sửa cùng lúc online
  - "Copy link" = copy link sửa chung (nếu đã bật) hay snapshot (nếu chưa bật)
  - Không có warning/reminder khi copy link nếu chưa bật sửa chung
- **Tác động**: Người nhận link không thấy updates của người khác → hoang mang, cho rằng app bị hỏng

#### 5. **Bị "Bạn là ai?" lặp lại nếu reload/quay lại bill từ link (P5 - Tần suất: Trung-Cao, Độ nghiêm trọng: Trung)**
- **Triệu chứng**:
  - Người A mở link, chọn tên mình, rồi reload trang → dialog hỏi lại
  - Hoặc người A nhận link, chọn tên, rồi chiều mai mở lại app (từ link cũ bấm) → hỏi lại
- **Root cause**: store.me[billId] chỉ được lưu local, không auto-fill khi mở lại từ link online
- **Tác động**: Phiền, dù không lỗi. Người dùng có thể chọn sai lần 2.

#### 6. **Danh bạ chưa tồn tại khi bill lần đầu (P6 - Tần suất: Cao khi bill online, Độ nghiêm trọng: Trung)**
- **Triệu chứng**:
  - Khi nhận link bill sửa chung từ người khác, nó tải từ Firebase → chưa có ai trong danh bạ của máy mình
  - Tab "Thành viên" của bill lúc đó: "Thêm từ danh bạ" toàn rỗng (danh bạ trống)
  - Nút "Lưu danh bạ" trên mỗi thành viên của bill để lưu vào danh bạ cá nhân
  - Nhưng người dùng có thể không phát hiện nút này (nhỏ, ở cuối dòng)
- **Root cause**:
  - Danh bạ local & bill online tách biệt
  - Không tự động add người từ bill vào danh bạ
  - Nút "Lưu danh bạ" không obvious
- **Tác động**: Người nhận link phải thêm thủ công lần tới nếu tạo bill khác với group này

### **🟡 Trung: Thỉnh thoảng gây confusion**

#### 7. **Không rõ "Người mà tôi thêm mới" từ bill có được lưu vào danh bạ chung không (P7 - Tần suất: Trung, Độ nghiêm trọng: Trung)**
- **Triệu chứng**:
  - Khi nhập tên người mới ở tab "Thành viên" của bill, app tự lưu vào danh bạ
  - Nhưng không có confirm toast/message rõ ràng
  - Người dùng không biết nếu người đó thuộc nhóm nào
- **Root cause**: Không hiển thị luồng "add to bill" → "auto save to dir" rõ ràng
- **Tác động**: Người dùng có thể chưa tin là danh bạ đã update

#### 8. **Nhóm trong bill vs nhóm trong danh bạ: người dùng không hiểu mối liên hệ (P8 - Tần suất: Trung, Độ nghiêm trọng: Trung)**
- **Triệu chứng**:
  - Mỗi bill có bản copy của nhóm danh bạ (liên kết qua pid)
  - Nếu đổi tên nhóm ở danh bạ, tất cả bill sẽ update
  - Nhưng UI không rõ điều này
- **Root cause**: Không có hint/tooltip rõ ràng về mối liên kết pid
- **Tác động**: Người dùng có thể bất ngờ khi tên nhóm đổi ở một bill khác

#### 9. **Trạng thái mạng (đang đồng bộ / mất kết nối) nhỏ, màu không rõ (P9 - Tần suất: Cao khi offline, Độ nghiêm trọng: Thấp)**
- **Triệu chứng**:
  - Text "☁️ Sửa chung · đã đồng bộ" hoặc "🔴 Mất kết nối · thay đổi sẽ gửi khi có mạng"
  - Nhỏ, ở góc header
  - Nếu người dùng không chú ý, không biết mình offline
- **Root cause**: Thiết kế vị trí & kích thước, người dùng đã quen với UI khác (Slack, Google Docs có indicator rõ hơn)
- **Tác động**: Người dùng offline sửa, nghĩ là đã lưu, nhưng không có (hoặc hỏi lại)

### **🟢 Thấp: Không cấp bách nhưng cải thiện được**

#### 10. **Không có hint khi join danh bạ đồng bộ từ link (P10)**
- **Triệu chứng**: Nút "Kết nối" ở danh bạ sau khi dán link không có hint "dán link #d=…"
- **Root cause**: Placeholder text quá ngắn
- **Tác động**: Người dùng có thể submit sai format

---

## III. Kiến nghị Giải pháp

### **Giai đoạn 1 (Tuần 1-2): Giải pháp Nhanh & Có Tác động Cao**

#### **P1-Fix: "Bạn là ai?" — Làm rõ hơn (Effort: S, Tác động: Cao)**
**Mục tiêu**: Giảm confusion khi lần đầu mở link  
**Chi tiết**:
1. Thêm subtitle dưới "Bạn là ai trong bill này?" → "Chọn tên để app nhớ đó là bạn"
2. Làm nút chọn tên rõ hơn: chuyển từ button list sang card list (mỗi tên 1 card to hơn)
3. Nút "Chỉ xem, bỏ qua" đổi màu, đặt dưới cùng rõ ràng
4. Thêm option "Chưa có tên bạn? Nhập để thêm vào bill" (đã có logic, chỉ cần rõ hơn)

**Code**: Sửa đoạn render `showWho()` (dòng 1607-1614)

---

#### **P2-Fix: Làm rõ loại link & khi nào dùng (Effort: M, Tác động: Cao)**
**Mục tiêu**: Khi copy link, người dùng biết nó là cái gì & cách dùng  
**Chi tiết**:
1. Khi click "Copy link":
   - Nếu bill chưa bật sửa chung → hiển thị toast: "Link bản chụp (snapshot). Người nhận sẽ thấy bill hiện tại, nhưng không update realtime."
   - Nếu bill đã bật sửa chung → toast: "Link sửa chung. Ai có link sẽ xem & sửa bill realtime."
2. Thêm hint ở nút "Copy link": "(để chia sẻ cho nhóm)"
3. Thêm help text ở section "Bật sửa chung": "Bật để cho phép nhóm sửa bill cùng lúc online qua link"

**Code**: Sửa đoạn copy link button (dòng 243, render header), thêm toast message

---

#### **P3-Fix: Empty state → Auto-navigate or onboarding (Effort: S, Tác động: Trung)**
**Mục tiêu**: Bill không có thành viên → dễ dàng thêm người  
**Chi tiết**:
1. Tab "Bill" khi không có thành viên: hiển thị thêm UI hint thay vì chỉ link nhỏ
   - Text: "📇 Chưa có ai. Hãy thêm thành viên từ danh bạ hoặc nhập tên mới"
   - 2 button: "Thêm từ danh bạ" (→ tab Members), "Nhập tên mới" (focus form, scroll down)
2. Hoặc: auto-switch sang tab "Thành viên" lần đầu tạo bill (gợi ý)

**Code**: Sửa `renderMe()` function hoặc thêm section trước expenses table

---

#### **P4-Fix: Làm rõ "Sửa chung" vs "Copy link" (Effort: M, Tác động: Cao)**
**Mục tiêu**: Người tạo biết khi nào bật sửa chung  
**Chi tiết**:
1. Thêm help text dưới "Bật sửa chung": 
   - "Cho phép nhóm sửa bill cùng lúc từ các thiết bị khác nhau. Link sẽ hoạt động realtime."
2. Nút "Copy link" bị disable hoặc cảnh báo nếu chưa bật sửa chung:
   - Tooltip: "Bật sửa chung trước để chia sẻ realtime"
3. Sau khi bật sửa chung thành công, toast: "✓ Đã bật sửa chung. Bấm 'Copy link' để chia sẻ với nhóm."

**Code**: Sửa logic `goLive()` và render header (dòng 244, 1011-1019)

---

#### **P5-Fix: Nhớ "Bạn là ai?" khi quay lại bill từ link (Effort: S, Tác động: Trung)**
**Mục tiêu**: Không hỏi lại nếu đã chọn trước đó  
**Chi tiết**:
1. Khi `maybeAskWho()` được gọi, check thêm:
   - Nếu `store.me[billId]` đã có (có giá trị), không hỏi lại
   - Nếu `store.me[billId]` undefined (bill từ link online lần đầu), hỏi
2. Khi mở bill từ link lần 2, local storage đã có store.me[billId] → skip dialog

**Code**: Sửa logic trong `maybeAskWho()` (dòng 1602-1606) để kiểm tra strict

---

#### **P6-Fix: Tự động add người từ bill online vào gợi ý danh bạ (Effort: M, Tác động: Trung)**
**Mục tiêu**: Khi tải bill từ link, danh bạ tab tự hiển thị nút "Lưu vào danh bạ" rõ ràng  
**Chi tiết**:
1. Khi bill online được tải, người từ bill đó nếu chưa có trong local directory → thêm nút "📇 Lưu danh bạ" trên mỗi người
2. Tooltip rõ: "Lưu người này vào danh bạ của bạn, dùng cho bill tiếp theo"
3. Hoặc tự động add nhưng hỏi confirm: "Lưu X người từ bill vào danh bạ?"

**Code**: Sửa `renderPeople()` logic (dòng 1360) và `billCard` template

---

#### **P7-Fix: Toast/Feedback rõ khi thêm người mới vào bill & danh bạ (Effort: S, Tác động: Trung)**
**Mục tiêu**: Người dùng rõ dữ liệu được lưu  
**Chi tiết**:
1. Khi submit form "Thêm thành viên" ở tab Bill: 
   - Toast: "✓ Đã thêm N người vào bill (& danh bạ)"
2. Đã có ở tab Danh bạ, nhưng có thể rõ hơn: "✓ Đã lưu vào danh bạ"

**Code**: Sửa toast message ở `memberForm submit` (dòng 1833-1841)

---

### **Giai đoạn 2 (Tuần 3-4): Giải pháp Tối ưu**

#### **P8-Fix: Hint về mối liên kết Nhóm bill ↔ Nhóm danh bạ (Effort: M, Tác động: Thấp-Trung)**
**Mục tiêu**: Người dùng hiểu nhóm được đồng bộ  
**Chi tiết**:
1. Thêm tooltip khi hover vào tên nhóm ở bill: "Đồng bộ từ danh bạ chung"
2. Khi đổi tên nhóm ở danh bạ, bill cập nhật → toast: "Tên nhóm đã cập nhật ở [Bill name]"

**Code**: Sửa CSS + thêm title attribute hoặc tooltip

---

#### **P9-Fix: Làm rõ hơn trạng thái mạng (Effort: M, Tác động: Thấp)**
**Mục tiêu**: Người dùng offline không nhầm là online  
**Chi tiết**:
1. Chuyển indicator từ small text → badge rõ hơn:
   - Online: "🟢 Đã đồng bộ"
   - Connecting: "🟡 Đang kết nối…"
   - Offline: "🔴 Offline · sẽ gửi khi có mạng"
2. Hoặc thêm banner ở đầu trang khi offline (giống Google Docs)

**Code**: Sửa `renderLive()` (dòng 1010-1019)

---

#### **P10-Fix: Placeholder rõ hơn cho form "Kết nối danh bạ" (Effort: S, Tác động: Rất thấp)**
**Mục tiêu**: Hướng dẫn rõ format  
**Chi tiết**:
1. Placeholder đổi: "Dán link #d=… hoặc mã kết nối"
2. Hint text: "Nhận từ người khác hoặc trong ⚙️ Cài đặt"

**Code**: Sửa placeholder input trong `renderDirSync()` (dòng 959)

---

## IV. Tóm tắt Kiến nghị ưu tiên

| Mã | Vấn đề | Effort | Tác động | Ưu tiên |
|----|--------|--------|----------|---------|
| P1 | "Bạn là ai?" rõ ràng | S | Cao | **#1** |
| P2 | Loại link rõ ràng | M | Cao | **#2** |
| P4 | Sửa chung vs Copy link | M | Cao | **#3** |
| P3 | Empty state → onboarding | S | Trung | **#4** |
| P5 | Nhớ "Bạn là ai?" | S | Trung | #5 |
| P6 | Gợi ý lưu danh bạ từ link | M | Trung | #6 |
| P7 | Toast thêm người rõ | S | Trung | #7 |
| P8 | Hint nhóm đồng bộ | M | Thấp | #8 |
| P9 | Indicator mạng rõ | M | Thấp | #9 |
| P10 | Placeholder danh bạ | S | Rất thấp | #10 |

---

## V. Kết luận

ShareBill có nền tảng UI/UX tốt cho bill chia tiền nhóm nhỏ. Điểm mạnh là tự động hỏi "bạn là ai", danh bạ chung, chia nhiều cách. Tuy nhiên:

- **Barrier to entry**: Người mở link lần đầu có thể confusion ở "Bạn là ai?" + "Link là gì"
- **Sửa chung**: Không rõ khi nào bật, người share link quên bật → realtime không work
- **Empty state**: Khi tạo bill mới, flow thêm người không obvious

**Giải pháp tối ưu**: Tập trung vào #1-4 để làm onboarding rõ ràng hơn, sau đó iterate trên collaborative clarity. Dự kiến 2-3 tuần để ship top 4 kiến nghị.

