import mongoose from 'mongoose'
import slugify from 'slugify'

/**
 * Hàm loại bỏ dấu tiếng Việt (diacritics) một cách thủ công và mạnh mẽ.
 * Điều này giải quyết các vấn đề Unicode mà thư viện slugify có thể bỏ sót.
 */
const removeVietnameseDiacritics = (str) => {
  // Ký tự chữ thường
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')

  // Ký tự chữ hoa
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')

  return str
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      unique: true,
      trim: true,
      maxlength: [50, 'Tên không được vượt quá 50 ký tự']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    image: {
      type: Object,
      required: [true, 'Ảnh đại diện là bắt buộc'],
      default: {
        url: 'https://placehold.co/100x100/eeeeee/333333?text=No+Image',
        public_id: 'default_placeholder'
      }
    }
  },
  {
    timestamps: true
  }
)

// Middleware: Tự động tạo slug từ tên trước khi lưu
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // 1. Áp dụng hàm loại bỏ dấu tiếng Việt
    const normalizedName = removeVietnameseDiacritics(this.name)

    // 2. Tạo slug từ chuỗi đã được chuẩn hóa (chỉ cần strict: true)
    this.slug = slugify(normalizedName, {
      lower: true,
      strict: true
    })
  }
  next()
})

const Category = mongoose.model('Category', categorySchema)
export default Category
