# Bảo mật bill sửa chung

## Cách hoạt động
- Mỗi thiết bị tự đăng nhập **ẩn danh** vào Firebase (không cần tài khoản hay mật khẩu).
- Người bấm "Bật sửa chung" là **chủ bill**.
- Mỗi người mở link chọn tên mình = **nhận tên** (ai nhận trước được, mỗi tên một người).

| Việc | Ai làm được |
|---|---|
| Xoá thành viên, đổi tên / ngày bill | Chủ bill |
| Sửa tên, STK của một thành viên | Chủ bill, hoặc người đã nhận tên đó |
| Sửa, xoá khoản chi | Chủ bill, hoặc người tạo khoản chi |
| Thêm khoản chi, thêm thành viên, nhận tên | Bất kỳ ai có link |
| Ghi nhận trả tiền, xác nhận | Như cũ (chưa khoá bằng luật) |
| Danh bạ đồng bộ (`dirs/`) | Như cũ: ai có link `#d=` đều sửa được |

Luật nằm ở `database.rules.json`; app có hàm `canWrite` trong `index.html` phản chiếu đúng luật này để ẩn nút và hoàn lại thao tác bị cấm.

## Cài đặt (làm đúng thứ tự)
1. **Đưa bản app này lên trước.** Nó chạy được với luật cũ, người dùng chưa thấy gì khác.
2. Firebase Console → **Authentication** → Sign-in method → bật **Anonymous**.
3. Authentication → Settings → **Authorized domains**: thêm tên miền đang host app (vd `firstlux.github.io`). `localhost` có sẵn.
4. Nếu API key có giới hạn referrer (Google Cloud → Credentials), cho phép tên miền đó.
5. Firebase Console → **Realtime Database → Rules** → dán nội dung `database.rules.json` → **Publish**.

Publish luật **trước** khi bật Anonymous sẽ làm mọi bill báo "Chưa đăng nhập ẩn danh được".

## Bill cũ (đã bật sửa chung trước bản này)
Chưa có chủ nên ai cũng sửa được hết. Người tạo bill mở bill, bấm **🔒 Nhận làm chủ**. Người đầu tiên bấm sẽ là chủ, nên hãy bấm sớm, trước khi gửi link cho người khác.

## Giới hạn cần biết
- **Danh tính gắn với trình duyệt.** Đóng app và mở lại vẫn nhớ, nhưng xoá dữ liệu trình duyệt thì mất quyền chủ bill và quyền nhận tên. Trên iPhone, app cài ra màn hình chính và Safari là **hai danh tính khác nhau**; link bấm từ Zalo luôn mở bằng Safari.
- **Nhận nhầm tên hoặc mất quyền:** chủ bill bấm **Gỡ nhận tên** ở tab Thành viên để người đó nhận lại.
- **Không có cách lấy lại quyền chủ bill** nếu thiết bị của chủ bị xoá dữ liệu. Hãy cho chủ bill giữ file sao lưu và đừng xoá dữ liệu trình duyệt.
- Ai nhận tên của người khác trước thì sửa được STK của tên đó cho đến khi chủ bill gỡ. App vẫn cảnh báo "STK vừa bị đổi" trên máy những người khác.
- Khoản trả và xác nhận chưa khoá bằng luật Firebase, chỉ khoá nút trong app.
- Danh bạ đồng bộ vẫn mở như cũ, chứa cả STK: đừng gửi link `#d=` vào nhóm chat chung.

## Kiểm tra luật bằng Rules Playground
Mình chưa chạy được bộ mô phỏng luật tự động, nên hãy thử tay trong Realtime Database → Rules → **Rules Playground** (đã đăng nhập kiểu *Authenticated*, đặt uid `uB`). Dữ liệu mẫu: bill `abcdefghijklmnop` có `owners/uOwner = true`, `claims/mA = "uOwner"`, `members/mA`, `members/mB`, `expenses/e1` với `by = "uOwner"`.

| Thao tác (Write) | Kết quả mong đợi |
|---|---|
| `bills/abcdefghijklmnop/name` | Từ chối |
| `bills/abcdefghijklmnop/members/mA/account` | Từ chối |
| `bills/abcdefghijklmnop/members/mA` xoá | Từ chối |
| `bills/abcdefghijklmnop/expenses/e1` xoá | Từ chối |
| `bills/abcdefghijklmnop/claims/mA` = `"uB"` | Từ chối |
| `bills/abcdefghijklmnop/claims/mB` = `"uB"` | Cho phép |
| `bills/abcdefghijklmnop/members/mB/account` (sau khi uB nhận mB) | Cho phép |
| `bills/abcdefghijklmnop/expenses/e2` với `by = "uB"` | Cho phép |
| Cùng các thao tác trên với uid `uOwner` | Cho phép |
| Mọi thao tác không đăng nhập (Unauthenticated) | Từ chối |
