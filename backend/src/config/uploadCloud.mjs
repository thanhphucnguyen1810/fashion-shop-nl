// upload.mjs
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
// COPY TOÀN BỘ THU MỤC ASSETS BÊN TRONG src/data/ ĐẶT VÀO TRONG THƯ MỤC CONFIG MỚI ĐẨY LÊN CLOUD ĐƯỢC

// import { env } from './environment.js'
// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dgec7q298',
  api_key: '464232232459821',
  api_secret:'1es9Akccwje2emBB-lStcg1ISa4',
  secure: true
})

// --- Danh sách file hình ảnh của bạn (Đã bổ sung đầy đủ) ---
const imageFiles = [
  // Product 1
  './assets/product_01/p_img2_1.png',
  './assets/product_01/p_img2_2.png',
  './assets/product_01/p_img2_3.png',
  './assets/product_01/p_img2_4.png',
  './assets/product_01/p_img2.png',

  // Product 2
  './assets/product_02/ao_len_1.webp',
  './assets/product_02/ao_len_2.webp',
  './assets/product_02/ao_len_3.webp',
  './assets/product_02/ao_len_4.webp',
  './assets/product_02/ao_len_5.webp',
  './assets/product_02/ao_len_6.webp',

  // Product 3
  './assets/product_03/product_03_01.jpg',
  './assets/product_03/product_03_02.jpg',
  './assets/product_03/product_03_03.jpg',

  // Product 4
  './assets/product_04/product_04_01.jpg',
  './assets/product_04/product_04_02.jpg',
  './assets/product_04/product_04_03.jpg',

  // Product 5
  './assets/product_05/product_05_01.jpg',
  './assets/product_05/product_05_02.jpg',
  './assets/product_05/product_05_03.jpg',

  // Product 6
  './assets/product_06/product_06_01.webp',
  './assets/product_06/product_06_02.jpg',
  './assets/product_06/product_06_03.webp',

  // Product 7
  './assets/product_07/product_07_01.jpg',
  './assets/product_07/product_07_02.webp',
  './assets/product_07/product_07_03.jpg',

  // Product 8
  './assets/product_08/p1_product_i1.png',
  './assets/product_08/p1_product_i2.png',
  './assets/product_08/p1_product_i3.png',
  './assets/product_08/p1_product_i4.png',
  './assets/product_08/p1_product.png',
  './assets/product_08/product_2.png',

  // Product 9
  './assets/product_09/p_img9_1.png',
  './assets/product_09/p_img9_2.png',
  './assets/product_09/p_img9_3.png',
  './assets/product_09/p_img9_4.jpg',

  // Product 10
  './assets/product_10/p_img10_1.png',
  './assets/product_10/p_img10_2.png',
  './assets/product_10/p_img10_3.png',

  // Product 11
  './assets/product_11/p_img11_1.png',
  './assets/product_11/p_img11_2.png',

  // Product 12
  './assets/product_12/p_img12_1.png',
  './assets/product_12/p_img12_2.png',
  './assets/product_12/p_img12_3.png',

  // Product 13
  './assets/product_13/p_img13_1.png',
  './assets/product_13/p_img13_2.png',
  './assets/product_13/p_img13_3.png',
  './assets/product_13/p_img13_4.png',

  // Product 14
  './assets/product_14/p_img14_1.png',
  './assets/product_14/p_img14_2.png',
  './assets/product_14/p_img14_3.png',

  // Product 15
  './assets/product_15/p_img15_1.png',
  './assets/product_15/p_img15_2.png',
  './assets/product_15/p_img15_3.png',

  // Product 16
  './assets/product_16/p_img16_1.png',
  './assets/product_16/p_img16_2.png',
  './assets/product_16/p_img16_3.png',
  './assets/product_16/p_img16_4.png',

  // Product 17
  './assets/product_17/p_img17_1.png',
  './assets/product_17/p_img17_2.png',
  './assets/product_17/p_img17_3.png',
  './assets/product_17/p_img17_4.png',

  // Product 18
  './assets/product_18/p_img18_1.png',
  './assets/product_18/p_img18_2.png',
  './assets/product_18/p_img18_3.png',
  './assets/product_18/p_img18_4.png',

  // Product 19
  './assets/product_19/p_img19_1.png',
  './assets/product_19/p_img19_2.png',
  './assets/product_19/p_img19_3.png',
  './assets/product_19/p_img19_4.png',

  // Product 20
  './assets/product_20/p_img20_1.png',
  './assets/product_20/p_img20_2.png',
  './assets/product_20/p_img20_3.png',
  './assets/product_20/p_img20_4.png',

  // Product 21
  './assets/product_21/p_img21_1.png',
  './assets/product_21/p_img21_2.png',
  './assets/product_21/p_img21_3.png',

  // Product 22
  './assets/product_22/p_img22_1.png',
  './assets/product_22/p_img22_2.png',
  './assets/product_22/p_img22_3.png',

  // Product 23
  './assets/product_23/p_img23_1.png',
  './assets/product_23/p_img23_2.png',
  './assets/product_23/p_img23_3.png',

  // Product 24
  './assets/product_24/p_img24_1.png',
  './assets/product_24/p_img24_2.jpg',
  './assets/product_24/p_img24_3.jpg',
  './assets/product_24/p_img24_4.jpg',

  // Product 25
  './assets/product_25/p_img25.png',

  // Product 26
  './assets/product_26/p_img26.png',

  // Product 27
  './assets/product_27/p_img27_1.png',
  './assets/product_27/p_img27_2.jpg',
  './assets/product_27/p_img27_3.jpg',

  // Product 28
  './assets/product_28/p_img28.png',

  // Product 29
  './assets/product_29/p_img29_1.png',
  './assets/product_29/p_img29_2.jpg',
  './assets/product_29/p_img29_3.jpg',

  // Product 30
  './assets/product_30/p_img30_1.png',
  './assets/product_30/p_img30_2.jpg',
  './assets/product_30/p_img30_3.jpg',

  // Product 31
  './assets/product_31/p_img31_1.png',
  './assets/product_31/p_img31_2.jpg',
  './assets/product_31/p_img31_3.jpg',

  // Product 32
  './assets/product_32/p_img32.png',

  // Product 33
  './assets/product_33/p_img33_1.png',
  './assets/product_33/p_img33_2.jpg',
  './assets/product_33/p_img33_3.jpg',

  // Product 34
  './assets/product_34/p_img34_1.png',
  './assets/product_34/p_img34_2.jpg',
  './assets/product_34/p_img34_3.jpg',

  // Product 35
  './assets/product_35/p_img35_1.png',
  './assets/product_35/p_img35_2.jpg',
  './assets/product_35/p_img35_3.jpg',
  './assets/product_35/p_img35_4.jpg',

  // Product 36
  './assets/product_36/p_img36_1.png',
  './assets/product_36/p_img36_2.jpg',
  './assets/product_36/p_img36_3.jpg',
  './assets/product_36/p_img36_4.jpg',

  // Product 37
  './assets/product_37/p_img37_1.png',
  './assets/product_37/p_img37_2.jpg',
  './assets/product_37/p_img37_3.jpg',
  './assets/product_37/p_img37_4.jpg',

  // Product 38
  './assets/product_38/p_img38_1.png',
  './assets/product_38/p_img38_2.jpg',
  './assets/product_38/p_img38_3.jpg',

  // Product 39
  './assets/product_39/p_img39_1.png',
  './assets/product_39/p_img39_2.jpg',
  './assets/product_39/p_img39_3.jpg',

  // Product 40
  './assets/product_40/p_img40_1.png',
  './assets/product_40/p_img40_2.jpg',
  './assets/product_40/p_img40_3.jpg',
  './assets/product_40/p_img40_4.jpg',

  // Product 41
  './assets/product_41/p_img41_1.png',

  // Product 42
  './assets/product_42/p_img42_1.png',

  // Product 43
  './assets/product_43/p_img43_1.png',

  // Product 44
  './assets/product_44/p_img44_1.png',
  './assets/product_44/p_img44_2.jpg',
  './assets/product_44/p_img44_3.jpg',

  // Product 45
  './assets/product_45/p_img45_1.jpg',
  './assets/product_45/p_img45_2.jpg',
  './assets/product_45/p_img45_3.jpg',
  './assets/product_45/p_img45_4.jpg',
  './assets/product_45/p_img45_5.jpg',

  // Product 46
  './assets/product_46/p_img46_1.jpg',
  './assets/product_46/p_img46_2.jpg',
  './assets/product_46/p_img46_3.jpg',

  // Product 47
  './assets/product_47/p_img47_1.jpg',
  './assets/product_47/p_img47_2.jpg',
  './assets/product_47/p_img47_3.jpg',
  './assets/product_47/p_img47_4.jpg',

  // Product 48
  './assets/product_48/p_img48_1.jpg',
  './assets/product_48/p_img48_2.jpg',
  './assets/product_48/p_img48_3.jpg',
  './assets/product_48/p_img48_4.jpg',
  './assets/product_48/p_img48_5.jpg',
  './assets/product_48/p_img48_6.jpg',

  // Product 49
  './assets/product_49/p_img49_1.jpg',
  './assets/product_49/p_img49_2.jpg',
  './assets/product_49/p_img49_3.jpg',
  './assets/product_49/p_img49_4.jpg',
  './assets/product_49/p_img49_5.jpg',
  './assets/product_49/p_img49_6.jpg',
  './assets/product_49/p_img49_7.jpg',
  './assets/product_49/p_img49_8.jpg',

  // Product 50
  './assets/product_50/p_img50_1.jpg',
  './assets/product_50/p_img50_2.jpg',
  './assets/product_50/p_img50_3.jpg',

  // Product 51
  './assets/product_51/p_img51_1.jpg',
  './assets/product_51/p_img51_2.jpg',
  './assets/product_51/p_img51_3.jpg',
  './assets/product_51/p_img51_4.jpg',

  // Product 52
  './assets/product_52/p_img52_1.jpg',
  './assets/product_52/p_img52_2.jpg',
  './assets/product_52/p_img52_3.jpg',

  // Product 53
  './assets/product_53/p_img53_1.jpg',
  './assets/product_53/p_img53_2.jpg',
  './assets/product_53/p_img53_3.jpg',

  // Product 54
  './assets/product_54/p_img54_1.jpg',
  './assets/product_54/p_img54_2.jpg',
  './assets/product_54/p_img54_3.jpg',

  // Product 55
  './assets/product_55/p_img55_1.jpg',
  './assets/product_55/p_img55_2.jpg',
  './assets/product_55/p_img55_3.jpg'
]
// ----------------------------------------

// Tải lên từng ảnh
// Tải lên từng ảnh
async function uploadImages() {
  console.log(`Bắt đầu tải lên ${imageFiles.length} hình ảnh...`)
  const results = []

  for (const filePath of imageFiles) {
    // Lấy tên file để tạo Public ID
    const fileName = filePath.split('/').pop().split('.')[0]

    const uploadOptions = {
      folder: 'products',
      public_id: fileName,
      overwrite: true
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, uploadOptions)
      results.push({
        local_path: filePath,
        cloudinary_url: result.secure_url,
        public_id: result.public_id
      })
      console.log(`Đã tải lên: ${filePath} -> ${result.secure_url}`)
    } catch (error) {
      console.error(`Lỗi khi tải lên ${filePath}:`, error.message)
    }
  }

  console.log('--- Hoàn tất quá trình tải lên ---')

  // Lưu kết quả ra file JSON
  await fs.writeFile('cloudinary_urls.json', JSON.stringify(results, null, 2)) // 👈 Sửa lỗi: Gọi writeFile trực tiếp
  console.log('Các URL đã được lưu vào file: cloudinary_urls.json')
}

uploadImages()
