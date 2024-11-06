# <p align="center"><strong>Priority Queue Pattern</strong></p>

## 🕵️ Mục lục
1. [Khái niệm](#introduction)
2. [Phân loại](#type)
3. [Những điểm cần lưu ý](#caution)
4. [Ưu điểm](#strong)
5. [Nhược điểm](#weak)
6. [Cách cài đặt](#setting)
7. [Các pattern liên quan](#link)
8. [Slide](#slide)
9. [Tài liệu tham khảo](#materials)


## 🔬 Khái niệm <a name="introduction"></a>
Là kiểu kiến trúc:
* Cho phép xử lý các tác vụ có mức độ ưu tiên cao trước các tác vụ có mức độ ưu tiên thấp.
* Đảm bảo xử lý các tác vụ khẩn cấp.
* Đáp ứng các thỏa thuận mức dịch vụ khác nhau (Service-level agreement).

## 🧩 Phân loại <a name="type"></a>
Có hai cách tiếp cận chính để triển khai Priority Queue Pattern:
### Single queue
![image](https://hackmd.io/_uploads/HkYWJ6Ob1l.png)
**Cấu trúc:** Tất cả message được gửi đến một hàng đợi và application (producer) gán một mức độ ưu tiên cho mỗi message sau đó gửi message đến hàng đợi. Hàng đợi sắp xếp các message theo mức độ ưu tiên, đảm bảo rằng consumer xử lý các thông điệp có mức độ ưu tiên cao hơn trước các message có mức độ ưu tiên thấp hơn.

**Trường hợp sử dụng:** Thích hợp với các ứng dụng đơn giản trong cài đặt và bảo trì như: hệ thống thông báo ưu tiên, hệ thống xử lý đơn hàng.
### Multiple queues
* Multiple queues cho phép phân chia các thông điệp theo mức độ ưu tiên. Application gán một mức độ ưu tiên cho mỗi thông điệp và chuyển thông điệp đến hàng đợi có mức độ ưu tiên tương ứng. Các messages sau đó sẽ được xử lý bởi các consumers. 
* Multiple queues có thể triển khai một single consumer pool duy nhất hoặc sử dụng multiple consumer pools.
#### Multiple consumer pools
![image](https://hackmd.io/_uploads/HyIzg6OZ1e.png)
Mỗi hàng đợi có consumer resources được phân bổ riêng. Các hàng đợi có mức độ ưu tiên cao nên sử dụng nhiều consumers hơn hoặc các cấp độ hiệu suất cao hơn để xử lý thông điệp nhanh hơn so với các hàng đợi có mức độ ưu tiên thấp.

**Trường hợp sử dụng:**
* Yêu cầu ngặt nghèo về hiệu năng: Các consumers với độ ưu tiên khác nhau sẽ được đáp ứng nhu cầu hiệu năng khác nhau.
* Yêu cầu độ tin cậy cao: Các consumer pools là độc lập. Khi xảy ra lỗi sẽ không ảnh hưởng tới những nhóm khác.
* Phù hợp với các ứng dụng phức tạp, nhất là yêu cầu đảm bảo hiệu năng khác nhau cho những tác vụ khác nhau.
#### Single consumer pool
![image](https://hackmd.io/_uploads/S1gB5Tu-kx.png)

**Trường hợp sử dụng:**
* Cần sự đơn giản trong cài đặt, quản lý: Đơn giản hơn trong việc cài đặt, theo dõi so với multiple consumer pool.
* Xử lý thống nhất: Việc sử dụng 1 consumer duy nhất giúp đồng bộ trong xử lý các tác vụ.
## ⚠️ Lưu ý trong cài đặt <a name="caution"></a>
### Starvation 
Những tác vụ có độ ưu tiên cao luôn được ưu tiên, khiến những tác vụ có độ ưu tiên thấp sẽ bị “tắc” lại.

**Cách khắc phục:**
* Chiến thuật time-slicing
* Điều chỉnh consumer pool động

### Chi phí
Những dịch vụ như Amazon Web Services SQS và Microsoft Azure Service Bus tính chi phí trên mỗi lần truy cập vào hàng đợi, không phải vào thời gian hay dung lượng nên cần ước tính số lượng truy cập trong 1 tháng để tiết kiệm chi phí.

## 💪 Ưu điểm <a name="strong"></a>
* Đảm bảo xử lý các nhiệm vụ quan trọng trước
* Cải thiện hiệu quả sử dụng tài nguyên
* Tăng khả năng tuân thủ SLA
* Giảm thiểu độ trễ cho các tác vụ khẩn cấp
## 🤧 Nhược điểm <a name="weak"></a>
* Nguy cơ bỏ sót nhiệm vụ ưu tiên thấp
* Độ phức tạp trong triển khai
* Khó dự đoán thời gian chờ
* Tốn tài nguyên giám sát
* Khả năng mất cân bằng tài nguyên

## 🔧 Cách cài đặt <a name="setting"></a>
### Clone repo này
```
git clone https://github.com/dangtiendung1201/KienTrucPhanMem.git
```

**Chú ý:** Điền các file `.env` theo ví dụ trong `.env.example`.
### Ví dụ 1: Single queue
 ```
cd example1
npm install
# Gửi các message với độ ưu tiên khác nhau đến single queue
node sendMessage
node receiveMessage
 ```

### Example 2: Multiple queues
 ```
cd example2
npm install
# Gửi 10 message đến hàng đợi High Priority và Low Priority
node sendMessage
# Nhận message từ hàng đợi High Priority
node PriorityQueueConsumerHigh
# Nhận message từ hàng đợi Low Priority
node PriorityQueueConsumerLow 
 ```
**Chú ý:** Tạo nhiều consumer bằng cách chạy đồng thời node PriorityQueueConsumerHigh, PriorityQueueConsumerLow.


### Example 3: Queue đang chứa 100 message với độ ưu tiên thấp đột ngột gửi message với mức ưu tiên cao
 ```
 cd example3
 npm install
 node sendMessage
 node receiveMessage
 ```
 
## 📌 Các pattern liên quan <a name="link"></a>
### Throttling
* Giới hạn số lượng yêu cầu giúp ngăn ngừa việc lạm dụng API.
* Giới hạn số lượng công việc để tránh quá tải hệ thống.
### Competing Consumers
* Xử lý song song.
* Phân tán tải công việc đồng đều giữa nhiều consumer.
 
## 🖼️ Slide <a name="slide"></a>
Truy cập slide tại [đây](https://www.canva.com/design/DAGTstuIdpE/ztZQ0hhD7SMRc9qaaMmn0g/view?utm_content=DAGTstuIdpE&utm_campaign=designshare&utm_medium=link&utm_source=editor).

## 📃 Tài liệu tham khảo <a name="materials"></a>
1. [Priority Queue pattern - Azure](https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue)
2. [The Priority Queue Pattern - DEV Community](https://dev.to/willvelida/the-priority-queue-pattern-23g8)
