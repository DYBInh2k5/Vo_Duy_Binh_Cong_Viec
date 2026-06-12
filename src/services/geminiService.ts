import { PERSONAL_INFO, EXPERIENCE, PROJECTS, SKILLS } from "../constants";

// LOCAL RULE-BASED RESPOND ENGINE FOR OFFLINE / KEYLESS OPERATION
const getOfflineResponse = (query: string): string => {
  const norm = query.toLowerCase().trim();

  // 1. Bio & Core Profile query patterns
  if (
    norm.includes("giới thiệu") ||
    norm.includes("who are you") ||
    norm.includes("who is") ||
    norm.includes("là ai") ||
    norm.includes("tên gì") ||
    norm.includes("cody") ||
    norm.includes("vũ duy bình") ||
    norm.includes("võ duy bình") ||
    norm.includes("yourself") ||
    norm.includes("tiểu sử")
  ) {
    return `🤖 [HỆ THỐNG PHÂN TÍCH] KHỞI TẠO HỒ SƠ CODY:
- HỌ VÀ TÊN: ${PERSONAL_INFO.fullName} (coDY)
- ĐỊNH HƯỚNG: Sinh viên Công nghệ Phần mềm, Kỹ sư tích hợp AI, Nhà phát triển tự động hóa truyền thông (Media Automation).
- NGÀY SINH: ${PERSONAL_INFO.birthday}
- NƠI CƯ TRÚ: ${PERSONAL_INFO.location}
- TRẠNG THÁI: Đang tích cực kiến tạo hệ thống Full-stack bền vững và các tác tử AI chuyên sâu.
- TIỂU SỬ: coDY kết hợp sự chuẩn xác hình học của phong cách Kiến trúc Thô mộc Bauhaus với sức mạnh tối tân từ các đường ống dữ liệu dựa trên AI.

"HÌNH DÁNG TUÂN THEO CÔNG NĂNG. ÍT HƠN LÀ NHIỀU HƠN (LESS IS MORE)."`;
  }

  // 2. Education details
  if (
    norm.includes("học vấn") ||
    norm.includes("education") ||
    norm.includes("trường") ||
    norm.includes("học ở đâu") ||
    norm.includes("hoa sen") ||
    norm.includes("sinh viên") ||
    norm.includes("ngoại ngữ") ||
    norm.includes("ngôn ngữ") ||
    norm.includes("ielts") ||
    norm.includes("toeic")
  ) {
    return `📚 [HỆ THỐNG PHÂN TÍCH] THÔNG TIN HỌC VẤN & NGÔN NGỮ:
- CHUYÊN NGÀNH: Công nghệ Phần mềm
- ĐẠI HỌC: Đại học Hoa Sen (HSU), TP. Hồ Chí Minh.
- HỆ SINH THÁI NGÔN NGỮ:
  * Tiếng Việt: Bản xứ (Native)
  * Tiếng Anh: IELTS 6.0 / TOEIC 650
  * Tiếng Trung: HSK 3
  * Tiếng Nhật: JLPT N5
  * Tiếng Hàn: TOPIK 1

Những cấu trúc kiên cố luôn được xây dựng trên nền móng ngôn ngữ vững chắc.`;
  }

  // 3. Experience Details
  if (
    norm.includes("kinh nghiệm") ||
    norm.includes("experience") ||
    norm.includes("làm việc") ||
    norm.includes("công ty") ||
    norm.includes("intern") ||
    norm.includes("lịch sử") ||
    norm.includes("freelance") ||
    norm.includes("ống ngắm")
  ) {
    const list = EXPERIENCE.map(
      (exp) => `  * Vị trí ${exp.role.toUpperCase()} tại ${exp.company.toUpperCase()} (${exp.period}):\n    ${exp.description}`
    ).join("\n\n");
    return `💼 [HỆ THỐNG PHÂN TÍCH] HÀNH TRÌNH CHUYÊN NGHIỆP:

${list}

"Mỗi hành trình là một điểm nút (node) được thiết kế để mở rộng cấu trúc."`;
  }

  // 4. Projects Details
  if (
    norm.includes("dự án") ||
    norm.includes("project") ||
    norm.includes("sản phẩm") ||
    norm.includes("composition") ||
    norm.includes("app") ||
    norm.includes("web") ||
    norm.includes("phát triển")
  ) {
    const list = PROJECTS.map(
      (p) => `  * ${p.title.toUpperCase()} [${p.category.toUpperCase()}]\n    - Slogan: ${p.tagline}\n    - Mô tả: ${p.description}\n    - Công nghệ cốt lõi: ${p.tech.join(", ")}`
    ).join("\n\n");
    return `🚀 [HỆ THỐNG PHÂN TÍCH] DANH SÁCH DỰ ÁN KIẾN TẠO:

${list}

Xem thêm các mã nguồn dự án tại GitHub của coDY: ${PERSONAL_INFO.socials.github}`;
  }

  // 5. Skills Details
  if (
    norm.includes("skills") ||
    norm.includes("kỹ năng") ||
    norm.includes("công nghệ") ||
    norm.includes("stack") ||
    norm.includes("lập trình") ||
    norm.includes("programming") ||
    norm.includes("ngôn ngữ lập trình") ||
    norm.includes("ai tool") ||
    norm.includes("python") ||
    norm.includes("react")
  ) {
    return `🛠️ [HỆ THỐNG PHÂN TÍCH] NĂNG LỰC ĐƯỜNG ỐNG DỮ LIỆU:

- CÔNG NGHỆ & WEB STACK:
  ${SKILLS.tech.join(" // ")}

- KIẾN TRÚC HỆ THỐNG TRÍ TUỆ NHÂN TẠO:
  ${SKILLS.ai.join(" // ")}

- SÁNG TẠO HÌNH ẢNH & TRUYỀN THÔNG:
  ${SKILLS.creative.join(" // ")}

Mọi yếu tố đều được thiết kế mô đun hóa chuẩn chỉnh.`;
  }

  // 6. Contact details
  if (
    norm.includes("contact") ||
    norm.includes("liên hệ") ||
    norm.includes("zalo") ||
    norm.includes("email") ||
    norm.includes("điện thoại") ||
    norm.includes("phone") ||
    norm.includes("mạng xã hội") ||
    norm.includes("social") ||
    norm.includes("facebook") ||
    norm.includes("github") ||
    norm.includes("linkedin")
  ) {
    return `📞 [HỆ THỐNG PHÂN TÍCH] PHƯƠNG THỨC LIÊN LẠC CHÍNH THỨC:
- THƯ ĐIỆN TỬ: ${PERSONAL_INFO.email}
- EMAIL DỰ PHÒNG: binhvo20055@gmail.com
- ĐIỆN THOẠI / ZALO: ${PERSONAL_INFO.phone}
- KÊNH TRUYỀN THÔNG ĐANG HOẠT ĐỘNG:
  * GitHub: ${PERSONAL_INFO.socials.github}
  * LinkedIn: ${PERSONAL_INFO.socials.linkedin}
  * Facebook: ${PERSONAL_INFO.socials.facebook}
  * Instagram: ${PERSONAL_INFO.socials.instagram}
  * Beacons Registry: ${PERSONAL_INFO.socials.beacons}

Hệ thống luôn sẵn sàng tiếp nhận các cấu hình hợp tác mới.`;
  }

  // 7. Draft Mode details
  if (
    norm.includes("draft mode") ||
    norm.includes("phác thảo") ||
    norm.includes("chế độ")
  ) {
    return `🎯 [HỆ THỐNG PHÂN TÍCH] PHÂN LOẠI CHẾ ĐỘ PHÁC THẢO (DRAFT MODE):
Draft Mode đại diện cho việc giản lược một bố cục tới phần tinh hoa kỹ thuật thuần túy nhất. Bằng cách lược bỏ toàn bộ các lớp trang trí bên ngoài trực quan bề mặt, nó trưng bày ra cấu hình lưới hình học nguyên bản, các hình khối trần trụi và tính toàn vẹn của phong cách Thô mộc Bauhaus. Đây là phương pháp nghệ thuật sáng chế phần mềm của coDY.`;
  }

  // 8. General Greetings / Politeness
  if (
    norm.includes("hello") ||
    norm.includes("hi") ||
    norm.includes("chào") ||
    norm.includes("hey") ||
    norm.includes("alo") ||
    norm.includes("test")
  ) {
    return `👋 KẾT NỐI PROTOCOL THÀNH CÔNG! Tôi là Trí Tuệ Bản Địa mạng lưới coDY.

Tôi có thể giúp gì cho bạn trong việc khám phá không gian làm việc số hóa của người sáng tạo ra tôi?
Bạn có thể hỏi bất cứ điều gì về:
- 'KỸ NĂNG' (Danh sách công nghệ và công cụ AI)
- 'DỰ ÁN' (Các sản phẩm thực nghiệm cốt lõi)
- 'KINH NGHIỆM' (Lịch sử làm việc chuyên nghiệp)
- 'LIÊN HỆ' (Zalo, email, điện thoại và mạng xã hội)`;
  }

  // Default fallback instructions
  return `🤖 [TRẠNG THÁI: HỆ THỐNG TRẢ LỜI NGOẠI TUYẾN]
Yêu cầu đầu vào của bạn đã kích hoạt chế độ ngoại tuyến bảo mật. Bạn có thể tự do khám phá các điểm dữ liệu bằng cách sử dụng các từ khóa sau:

1. 'GIỚI THIỆU' (Thông tin tiểu sử cá nhân)
2. 'DỰ ÁN' (Tập hợp các sản phẩm và bộ công nghệ áp dụng)
3. 'KINH NGHIỆM' (Lịch sử cống hiến thực tiễn)
4. 'KỸ NĂNG' (Hồ sơ năng lực kỹ thuật và truyền thông sáng tạo)
5. 'LIÊN HỆ' (Cổng kết nối Zalo, điện thoại, email)

(Nếu muốn cấu hình Gemini API trực tuyến, vui lòng thiết đặt khóa GEMINI_API_KEY trong tệp cấu hình .env!)`;
};

// MULTI-MODE RESPONDER DESIGNED FOR MAXIMUM RESILIENCE (ONLINE PROXIED GEMINI OR LOCAL OFFLINE INTERTACTIVE AGENT)
export const getCodyResponse = async (message: string, history: { role: 'user' | 'assistant', content: string }[] = []) => {
  try {
    // Attempt our secure, server-side Gemini API proxy endpoint
    const res = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return data.content;
      }
    }
  } catch (err) {
    console.warn("Server API Chat endpoint bypass triggered. Running keyless matching algorithm.", err);
  }

  // Elegant offline pattern-matching fallback running with zero keys required
  return getOfflineResponse(message);
};

// EXPORT RE-ROUTED GEOMETRIC GENERATOR FOR THE MOOD BOARD FOR REAL-TIME OPERATION
export const generateBauhausDesign = async (prompt: string) => {
  try {
    const response = await fetch("/api/generate-design", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.error("Server-side design generation error, falling back locally:", error);
  }

  // Backup static design layout when keyless offline composition is triggered
  const staticBauhaus = [
    { type: 'circle', x: 25, y: 35, size: 120, color: '#D02020', rotation: 0 },
    { type: 'square', x: 55, y: 20, size: 140, color: '#2850CE', rotation: 45 },
    { type: 'triangle', x: 40, y: 65, size: 180, color: '#FFD700', rotation: 180 },
    { type: 'cross', x: 75, y: 55, size: 80, color: '#1C1B1B', rotation: 12 },
    { type: 'frame', x: 15, y: 70, size: 100, color: '#1C1B1B', rotation: 90 }
  ];
  return staticBauhaus;
};
