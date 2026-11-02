// vi — từ điển tiếng Việt. Hình dạng khóa phải khớp en chính xác (tests/seo.test.ts).
// Giữ nguyên "Calculimo", các placeholder {n}/{count}/{query}/{category} và token kỹ thuật.
const vi = {
  brand: "Calculimo",
  tagline: "Mọi phép tính phần trăm chạy ngay trong trình duyệt.",
  metaDesc:
    "Máy tính phần trăm và tỉ lệ miễn phí: X% của Y, mức thay đổi, phần trăm ngược, giảm giá chồng, chia tiền tip và tỉ lệ. Tất cả trong trình duyệt — con số của bạn không bao giờ rời thiết bị.",

  nav: {
    tools: "Tất cả công cụ",
    categories: "Danh mục",
    about: "Giới thiệu",
    menu: "Menu",
    language: "Ngôn ngữ",
  },

  home: {
    heroTitle: "Mọi câu hỏi phần trăm, đều chỉ rõ phép tính",
    heroSub:
      "Calculimo là bộ máy tính phần trăm và tỉ lệ: phần trăm của một số, mức thay đổi, phần trăm ngược, giảm giá chồng, chia tiền tip và tỉ lệ. Tất cả trong trình duyệt — nhanh, miễn phí, không cần đăng ký, không gửi đi đâu.",
    browseAll: "Xem tất cả công cụ",
    categoriesTitle: "Danh mục",
    featuredTitle: "Công cụ phổ biến",
    trustLocal: "File luôn ở lại thiết bị của bạn",
    trustFree: "Miễn phí, không cần tài khoản",
    trustFast: "Tức thì, dùng được cả khi offline",
    rotating: [
      "15% của 80 là 12 — từng bước tính hiện trên màn hình",
      "Giảm giá chồng: 20% + 10% chỉ còn 28%, không phải 30% — hiểu vì sao",
      "Tăng 25% rồi thành 100? Giá gốc là 80, không phải 75",
      "Chia hóa đơn kèm tip cho ba người, chính xác đến xu",
    ],
    statsLabels: { tools: "công cụ", languages: "ngôn ngữ", uploads: "lượt tải lên", accounts: "tài khoản" },
    eyebrow: "Miễn phí mãi mãi",
    heroCtaSecondary: "Cách hoạt động",
    statsTools: "{n} công cụ",
    statsLanguages: "{n} ngôn ngữ",
    statsUploads: "0 lượt tải lên",
    statsAccounts: "0 tài khoản",
    categoriesSub: "Máy tính phần trăm và tỉ lệ, tất cả chạy trên thiết bị của bạn.",
    popularSub: "Những công cụ được mở nhiều nhất.",
    privacyTitle: "File của bạn không bao giờ rời khỏi thiết bị.",
    privacySub:
      "Không có bước tải lên. Các công cụ là JavaScript chạy trong trình duyệt của bạn — đó không phải lời hứa về chính sách, mà là cách chúng được xây dựng.",
    privacyPoint1T: "Xử lý cục bộ",
    privacyPoint1D:
      "File được đọc bằng File API của chính trình duyệt và xử lý trong bộ nhớ. Không có gì được truyền đi bất cứ đâu.",
    privacyPoint2T: "Không cần tài khoản",
    privacyPoint2D: "Không đăng ký, không email, không lưu lịch sử. Mở công cụ lên và dùng ngay.",
    privacyPoint3T: "Trung thực từ thiết kế",
    privacyPoint3D:
      "Nếu có gì đó thực sự không thể làm trong trình duyệt, chúng tôi nói thẳng thay vì giả vờ được.",
    privacyLink: "Đọc ghi chú riêng tư đầy đủ",
    endTitle: "Chọn một công cụ. Nó chỉ đơn giản là hoạt động.",
    endSub: "Mười lăm ngôn ngữ, không tải lên, không cần cài đặt.",
  },

  tools: {
    title: "Tất cả công cụ",
    subtitle: "Tìm kiếm trong {count} công cụ trình duyệt miễn phí. Không tải lên, không đăng ký.",
    filterPlaceholder: "Tìm công cụ…",
    count: "{count} công cụ",
    empty: "Không có công cụ nào khớp với “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Gộp, tách, chuyển đổi và chỉnh sửa file PDF mà không cần tải lên bất cứ đâu." },
    image: { name: "Ảnh", desc: "Nén, đổi kích thước, cắt và chuyển đổi ảnh ngay trong trình duyệt của bạn." },
    text: { name: "Văn bản", desc: "Đếm, làm sạch, sắp xếp và biến đổi văn bản tức thì khi bạn gõ." },
    developer: { name: "Lập trình viên", desc: "Trình định dạng, bộ mã hóa, bộ giải mã và trình tạo cho công việc dev hằng ngày." },
    seo: { name: "SEO", desc: "Thẻ meta, dữ liệu có cấu trúc, xem trước SERP và các trợ thủ SEO trên trang." },
    security: { name: "Bảo mật", desc: "Mật khẩu, hàm băm và tra cứu — tạo và kiểm tra ngay trên thiết bị của bạn." },
    utility: { name: "Phần trăm và tỉ lệ", desc: "Phần trăm của một số, mức thay đổi, phần trăm ngược, giảm giá chồng, chia tiền tip và tỉ lệ — cho những con số hằng ngày." },
  },

  tool: {
    howTo: "Cách sử dụng",
    faq: "Câu hỏi thường gặp",
    related: "Công cụ liên quan",
    privacyNote:
      "Công cụ này chạy hoàn toàn trong trình duyệt của bạn. Dữ liệu không bao giờ rời khỏi thiết bị — không được tải lên bất kỳ máy chủ nào.",
    inCategory: "Xem thêm trong {category}",
    backToCategory: "Tất cả công cụ {category}",
  },

  common: {
    copy: "Sao chép",
    copied: "Đã sao chép",
    download: "Tải xuống",
    reset: "Đặt lại",
    swap: "Đảo chiều",
    clear: "Xóa",
    error: "Đã xảy ra lỗi. Kiểm tra dữ liệu nhập và thử lại.",
    input: "Đầu vào",
    output: "Kết quả",
    settings: "Tùy chọn",
    dropFiles: "Kéo thả file vào đây hoặc bấm để chọn",
    dropFile: "Kéo thả file vào đây hoặc bấm để chọn",
    processing: "Đang xử lý…",
    fileSize: "Dung lượng",
    sample: "Dùng thử ví dụ",
    uppercase: "CHỮ IN HOA",
  },

  unit: {
    from: "Từ",
    to: "Sang",
    amount: "Số lượng",
    result: "Kết quả",
    common: "Chuyển đổi thường dùng",
    formula: "Công thức",
    allUnits: "Tất cả đơn vị",
  },

  text: {
    stats: {
      words: "Từ",
      characters: "Ký tự",
      charsNoSpaces: "Không khoảng trắng",
      sentences: "Câu",
      paragraphs: "Đoạn",
      lines: "Dòng",
      readingTime: "Thời gian đọc",
      readingMinutes: "{n} phút đọc",
    },
  },

  footer: {
    line: "Máy tính phần trăm và tỉ lệ. Không gì bạn nhập rời khỏi thiết bị của bạn.",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    about: "Giới thiệu",
    badges: "Huy hiệu",
    language: "Ngôn ngữ",
  },

  badge: {
    title: "Huy hiệu Calculimo",
    desc: "Gắn huy hiệu Calculimo lên trang web, README hoặc tài liệu của bạn. Nó dẫn về đây và cho biết các máy tính phía sau chạy hoàn toàn trong trình duyệt.",
    voluntary: "Việc nhúng hoàn toàn tự nguyện — chọn một huy hiệu nếu bạn thích dự án này. Không cần xin phép ai.",
    md: "Markdown (README)",
    html: "HTML (trang web)",
    thanks: "Cảm ơn bạn đã lan tỏa — mỗi lượt nhúng giúp nhiều người hơn khám phá những công cụ tôn trọng file của họ.",
  },

  embed: {
    title: "Nhúng công cụ này",
    desc: "Đưa công cụ này vào trang của bạn bằng một dòng — nó chạy trong trình duyệt của khách.",
  },

    mcp: {
    title: "Máy chủ MCP — công cụ cho AI gọi trực tiếp",
    desc1:
      "Calculimo đi kèm máy chủ MCP (Model Context Protocol): các trợ lý AI như Claude hay Cursor có thể chạy chính những máy tính phần trăm và tỉ lệ bạn thấy trên trang này — cùng logic đã kiểm thử, không cần viết lại.",
    desc2:
      "Các công cụ chạy chính hàm thuần của trang: phần trăm của một số, mức thay đổi, phần trăm ngược, giảm giá chồng, tiền tip và tỉ lệ. Việc thực thi diễn ra trên máy của ứng dụng AI qua npx — không gửi gì đến máy chủ của chúng tôi.",
    toolsTitle: "Công cụ chạy được ({n})",
    requiresNode: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
    privacy: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
  },

    notFound: {
    title: "Không tìm thấy trang",
    body: "Công cụ bạn tìm không tồn tại. Hãy xem tất cả công cụ thay thế.",
    home: "Về trang chủ",
  },
};

export default vi;
