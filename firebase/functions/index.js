const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Tự động gửi Email khi có contact mới (Mẫu)
 * Bạn cần cài đặt SendGrid hoặc một dịch vụ email để chạy thực tế
 */
exports.sendContactEmail = functions.firestore
    .document('contacts/{contactId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        console.log('Sending email for contact:', newValue.email);
        
        // Code gửi email sẽ nằm ở đây
        // VD: admin.firestore().collection('mail').add({ ... })
        return null;
    });

/**
 * Xử lý ảnh - Tạo thumbnail (Mẫu)
 * Kích hoạt khi có file mới được upload lên Storage
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;

    if (!contentType.startsWith('image/')) {
        return console.log('This is not an image.');
    }

    if (filePath.includes('_thumb')) {
        return console.log('Already a Thumbnail.');
    }

    console.log('Generating thumbnail for:', filePath);
    // Code xử lý ảnh dùng thư viện sharp hoặc tương tự sẽ nằm ở đây
    return null;
});

/**
 * Cron Job - Dọn dẹp dữ liệu cũ (Mẫu)
 * Chạy vào 00:00 mỗi ngày
 */
exports.dailyCleanup = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    console.log('Cleaning up old logs...');
    // Code dọn dẹp DB
    return null;
});
